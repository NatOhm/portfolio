/**
 * Regenerates public/images/og/default.jpg — the social share card.
 *
 * Rendered with the real brand fonts and palette tokens so a shared link
 * matches the site. Dimensions stay 1200x630, which is what src/lib/
 * media-dimensions.ts declares for this path (and what OpenGraph expects).
 *
 *   node scripts/generate-og.mjs
 */
import { chromium } from "playwright";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { profile } from "../src/lib/content.ts";
import { site } from "../src/lib/site.ts";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const WIDTH = 1200;
const HEIGHT = 630;

const fontFile = async (pkg, file) =>
  (await readFile(resolve(root, "node_modules/@fontsource", pkg, "files", file))).toString("base64");

const archivo700 = await fontFile("archivo", "archivo-latin-700-normal.woff2");
const mono700 = await fontFile("space-mono", "space-mono-latin-700-normal.woff2");
const mono400 = await fontFile("space-mono", "space-mono-latin-400-normal.woff2");

// Palette mirrors src/app/globals.css.
const INK = "#0E0E0F";
const PAPER = "#F6F6F3";
const CITRON = "#E6F082";
const MUTED = "#B6B6BA";

const headline = profile.headline.toUpperCase();

const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      @font-face {
        font-family: "Archivo"; font-weight: 700; font-style: normal;
        src: url(data:font/woff2;base64,${archivo700}) format("woff2");
      }
      @font-face {
        font-family: "Space Mono"; font-weight: 700; font-style: normal;
        src: url(data:font/woff2;base64,${mono700}) format("woff2");
      }
      @font-face {
        font-family: "Space Mono"; font-weight: 400; font-style: normal;
        src: url(data:font/woff2;base64,${mono400}) format("woff2");
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: ${WIDTH}px; height: ${HEIGHT}px;
        background: ${INK}; color: ${PAPER};
        display: flex; flex-direction: column; justify-content: space-between;
        padding: 56px 64px 48px;
        font-family: "Space Mono", monospace;
        -webkit-font-smoothing: antialiased;
      }
      .top { display: flex; align-items: baseline; justify-content: space-between; }
      .wordmark {
        font-weight: 700; font-size: 19px; letter-spacing: 0.22em; text-transform: uppercase;
      }
      .dot { color: ${CITRON}; }
      .role { font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: ${MUTED}; }
      .headline {
        font-family: "Archivo", sans-serif; font-weight: 700;
        font-size: 96px; line-height: 0.94; letter-spacing: -0.03em;
        text-transform: uppercase;
      }
      .headline .accent { color: ${CITRON}; }
      .bottom { display: flex; flex-direction: column; gap: 20px; }
      .rule { height: 2px; background: ${CITRON}; width: 100%; }
      .meta {
        display: flex; justify-content: space-between;
        font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; color: ${MUTED};
      }
      .meta .email { color: ${CITRON}; letter-spacing: 0.12em; }
    </style>
  </head>
  <body>
    <div class="top">
      <div class="wordmark">${site.name.split(" ")[0]}<span class="dot">.</span></div>
      <div class="role">${profile.role}</div>
    </div>

    <div class="headline">
      ${headline
        .split(". ")
        .map((part, i) =>
          i === 0
            ? `${part}.<br />`
            : `<span class="accent">${part}</span><br />`,
        )
        .join("")}
    </div>

    <div class="bottom">
      <div class="rule"></div>
      <div class="meta">
        <span>${profile.location}</span>
        <span class="email">${site.email}</span>
      </div>
    </div>
  </body>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: 1,
});
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);

const outDir = resolve(root, "public/images/og");
await mkdir(outDir, { recursive: true });
const buffer = await page.screenshot({ type: "jpeg", quality: 92, fullPage: false });
await writeFile(resolve(outDir, "default.jpg"), buffer);
await browser.close();

console.log(`wrote public/images/og/default.jpg (${WIDTH}x${HEIGHT}, ${Math.round(buffer.length / 1024)} KB)`);
