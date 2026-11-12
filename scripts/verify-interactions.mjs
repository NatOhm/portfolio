/**
 * Browser verification for the interactive components that typechecking
 * cannot cover (ARCHITECTURE.md §10.4).
 *
 * Builds nothing: run `npm run build` first, then `npm run verify:ui`.
 * Starts `next start` on a spare port, drives Chromium against the production
 * build, prints each assertion, and exits non-zero on the first failure.
 */
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

import { archiveCollections } from "../src/lib/archive-collections.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const PORT = Number(process.env.VERIFY_PORT ?? 4211);
const BASE = `http://127.0.0.1:${PORT}`;
const isWin = process.platform === "win32";

const results = [];
let failed = 0;

function check(name, ok, detail) {
  results.push({ name, ok, detail });
  if (!ok) failed += 1;
  console.log(`${ok ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
}

async function startServer() {
  const child = spawn(`npx next start -p ${PORT}`, {
    cwd: root,
    stdio: "ignore",
    shell: true,
    detached: !isWin,
  });

  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) return child;
    } catch {
      /* not ready yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error("next start did not become ready in 60s");
}

function stopServer(child) {
  if (!child?.pid) return;
  if (isWin) {
    spawn(`taskkill /pid ${child.pid} /T /F`, { stdio: "ignore", shell: true });
  } else {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  }
}

const collectErrors = (page, sink) => {
  page.on("console", (m) => {
    if (m.type() === "error") sink.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => sink.push(`pageerror: ${e.message}`));
};

/** The Monitor: real transport, real duration, a keyboard-operable scrubber. */
async function verifyTransport(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  collectErrors(page, errors);

  await page.goto(`${BASE}/`, { waitUntil: "load" });

  const button = page.getByRole("button", { name: /Play reel|Pause reel/ });
  await button.waitFor({ state: "visible", timeout: 10_000 });
  /*
   * The transport is client-side: its click handler only exists once React has
   * hydrated. Wait for the network to settle so the click cannot land on the
   * server-rendered markup before hydration (a no-op that would read as a
   * broken toggle rather than a slow one).
   */
  await page.waitForLoadState("networkidle");
  const before = await button.getAttribute("aria-pressed");

  await button.click();
  await page.waitForTimeout(350);
  const after = await button.getAttribute("aria-pressed");
  check("transport toggles its pressed state", before !== after, `${before} → ${after}`);

  const scrub = page.getByRole("slider", { name: "Reel position" });
  check("scrubber is exposed as a named slider", (await scrub.count()) === 1);

  check(
    "scrubber is reachable by keyboard",
    (await scrub.evaluate((el) => el.tabIndex >= 0)) === true,
  );

  await page
    .waitForFunction(
      () => {
        const video = document.querySelector("video");
        return Boolean(video) && Number.isFinite(video.duration) && video.duration > 0;
      },
      null,
      { timeout: 20_000 },
    )
    .catch(() => {});

  const valueText = await scrub.getAttribute("aria-valuetext");
  check(
    "timecode reports the clip's real duration",
    /\d{2}:\d{2} of \d{2}:\d{2}/.test(valueText ?? ""),
    valueText ?? "unreadable",
  );

  check("no console errors on the homepage", errors.length === 0, errors.join(" | ") || "none");
  await ctx.close();
}

/** Active route state and the archive's announced filter result. */
async function verifyArchive(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  collectErrors(page, errors);

  await page.goto(`${BASE}/work`, { waitUntil: "load" });

  const workLink = page.getByRole("link", { name: "Work", exact: true }).first();
  check(
    "current route is marked with aria-current",
    (await workLink.getAttribute("aria-current")) === "page",
    (await workLink.getAttribute("aria-current")) ?? "missing",
  );

  const live = page.locator('[aria-live="polite"]').first();
  check("filtered result count is a live region", (await live.count()) === 1);
  check(
    "result count starts at the full archive",
    /7 projects/.test((await live.textContent()) ?? ""),
    (await live.textContent()) ?? "",
  );

  const discipline = page.getByRole("group", { name: /Filter work by discipline/i });
  const threeD = discipline.getByRole("button", { name: "3D", exact: true });
  await threeD.click();
  await page.waitForTimeout(200);

  check(
    "selected filter reports aria-pressed",
    (await threeD.getAttribute("aria-pressed")) === "true",
  );
  check(
    "other filters are unpressed",
    (await discipline.getByRole("button", { name: "All", exact: true }).getAttribute("aria-pressed")) ===
      "false",
  );
  check("filtered count updates", /2 projects/.test((await live.textContent()) ?? ""), (await live.textContent()) ?? "");

  check("no console errors on the archive", errors.length === 0, errors.join(" | ") || "none");
  await ctx.close();
}


/** The complete archive: every collection indexable, every piece rendered. */
async function verifyCompleteArchive(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  collectErrors(page, errors);

  await page.goto(`${BASE}/work#archive`, { waitUntil: "load" });

  const cards = page.locator(`a[href^="/work/collection/"]`);
  const collectionTotal = archiveCollections.length;
  check(
    "archive index lists every collection",
    (await cards.count()) === collectionTotal,
    `${await cards.count()} cards`,
  );

  const archiveCount = page.locator('[aria-live="polite"]').nth(1);
  check(
    "archive count reports the full catalogue",
    new RegExp(`${collectionTotal} collections`).test((await archiveCount.textContent()) ?? ""),
    (await archiveCount.textContent()) ?? "",
  );

  const photography = page.getByRole("button", { name: "Photography", exact: true });
  await photography.click();
  await page.waitForTimeout(200);
  check(
    "archive filter narrows to one discipline",
    /1 collection/.test((await archiveCount.textContent()) ?? "") &&
      (await page.locator(`a[href^="/work/collection/"]`).count()) === 1,
    (await archiveCount.textContent()) ?? "",
  );

  await page.goto(`${BASE}/work/collection/pattaya-posts`, { waitUntil: "load" });
  const images = page.locator("article figure img");
  const imageCount = await images.count();
  check("collection page renders every image", imageCount === 196, `${imageCount} images`);
  const firstImage = images.first();
  await firstImage.scrollIntoViewIfNeeded();
  await page
    .waitForFunction(
      () => {
        const img = document.querySelector("article figure img");
        return Boolean(img && img.complete && img.naturalWidth > 0);
      },
      null,
      { timeout: 15000 },
    )
    .catch(() => {});
  check(
    "collection images actually load",
    await firstImage.evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  const weeks = page.locator("article h2");
  check("collection pages keep the source subfolders", (await weeks.count()) === 23, `${await weeks.count()} sections`);

  await page.goto(`${BASE}/work/collection/tk-reels`, { waitUntil: "load" });
  const videos = page.locator("article video");
  check("video collection renders every clip", (await videos.count()) === 31, `${await videos.count()} clips`);
  const playable = await videos.first().evaluate(async (video) => {
    video.muted = true;
    try {
      await video.play();
    } catch {
      return false;
    }
    await new Promise((r) => setTimeout(r, 1200));
    return video.currentTime > 0.2 && video.readyState >= 2;
  });
  check("a proxy clip plays from the collection page", playable);

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const narrow = await mobile.newPage();
  await narrow.goto(`${BASE}/work/collection/enphoto`, { waitUntil: "load" });
  const width = await narrow.evaluate(() => document.documentElement.scrollWidth);
  check("collection page has no horizontal overflow at 390", width <= 390, `${width}px`);
  await mobile.close();

  check("no console errors on the archive routes", errors.length === 0, errors.join(" | ") || "none");
  await ctx.close();
}

async function verifyMobileMenu(browser) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  const errors = [];
  collectErrors(page, errors);

  await page.goto(`${BASE}/`, { waitUntil: "load" });

  const trigger = page.getByRole("button", { name: "Open menu" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Site menu" });
  await dialog.waitFor({ state: "visible", timeout: 5000 });

  const describeActive = () =>
    page.evaluate(() => {
      const el = document.activeElement;
      const panel = document.querySelector('[role="dialog"][aria-label="Site menu"]');
      return {
        label:
          el?.getAttribute("aria-label") ||
          el?.textContent?.trim().replace(/\s+/g, " ") ||
          el?.tagName,
        inPanel: Boolean(panel && el && panel.contains(el)),
      };
    });

  const focusables = await dialog.evaluate((panel) =>
    Array.from(panel.querySelectorAll('a[href], button:not([disabled])')).map(
      (el) => el.getAttribute("aria-label") || el.textContent.trim().replace(/\s+/g, " "),
    ),
  );
  /* Close, four nav links and Résumé — the panel's whole tab ring. */
  check("menu exposes its focusable order", focusables.length === 6, focusables.join(" → "));

  let state = await describeActive();
  check(
    "opening the menu focuses the close button",
    state.inPanel && state.label === "Close menu",
    state.label,
  );

  const walk = [];
  for (let i = 0; i < focusables.length; i += 1) {
    await page.keyboard.press("Tab");
    walk.push(await describeActive());
  }
  check(
    "Tab stays inside the panel while walking forward",
    walk.every((s) => s.inPanel),
    walk.map((s) => s.label).join(" → "),
  );
  check(
    "Tab reaches the last item then wraps to the first",
    walk[walk.length - 1].label === focusables[0],
    `landed on "${walk[walk.length - 1].label}"`,
  );

  await page.keyboard.press("Shift+Tab");
  const backWrap = await describeActive();
  check(
    "Shift+Tab from the first item wraps to the last",
    backWrap.inPanel && backWrap.label === focusables[focusables.length - 1],
    backWrap.label,
  );

  await page.keyboard.press("Shift+Tab");
  const backOne = await describeActive();
  check(
    "Shift+Tab continues backwards inside the panel",
    backOne.inPanel && backOne.label === focusables[focusables.length - 2],
    backOne.label,
  );

  /* Read while the panel is still mounted: contain stops scroll chaining. */
  const overscroll = await page.evaluate(() => {
    const panel = document.querySelector('[role="dialog"]');
    return panel ? getComputedStyle(panel).overscrollBehaviorY : "missing";
  });
  check(
    "menu panel contains scroll chaining",
    overscroll === "contain",
    `overscroll-behavior-y: ${overscroll}`,
  );

  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached", timeout: 5000 }).catch(() => {});
  check("Escape closes the menu", (await page.getByRole("dialog").count()) === 0);

  const restored = await page.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  check(
    "Escape restores focus to the trigger",
    restored === "Open menu",
    `activeElement: ${restored}`,
  );

  check("no console errors on mobile page", errors.length === 0, errors.join(" | ") || "none");
  await ctx.close();
}

const server = await startServer();
let browser;
try {
  browser = await chromium.launch();
  console.log(`\nVerifying ${BASE} with Chromium ${browser.version()}\n`);
  await verifyTransport(browser);
  console.log("");
  await verifyArchive(browser);
  console.log("");
  await verifyCompleteArchive(browser);
  console.log("");
  await verifyMobileMenu(browser);
} finally {
  await browser?.close();
  stopServer(server);
}

console.log(`\n${results.length - failed}/${results.length} assertions passed`);
if (failed) {
  console.log("Interaction verification FAILED");
  process.exit(1);
}
console.log("Interaction verification passed");
