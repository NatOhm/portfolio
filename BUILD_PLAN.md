# Natnithichai Portfolio Website — Complete Build Plan

Status: implementation-ready plan  
Target application: `Port-full/Web`  
Framework: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4  
Primary source library: `Port-full/Portfolio`  
Primary résumé source: `Port-full/Natnithichai_Resume.pdf`

Architecture companion: [`ARCHITECTURE.md`](./ARCHITECTURE.md)

## 1. Project objective

Build a fast, accessible, image-led portfolio for Natnithichai Srikolchan that helps recruiters, studios, agencies, and potential clients understand the quality and range of the work within roughly one minute.

The website must communicate one clear positioning:

> Natnithichai is a multidisciplinary multimedia designer who turns stories and briefs into finished video, motion, 3D, and visual campaign work.

The website is not an archive of every file. It is a curated presentation of the strongest work, with enough process and context to establish authorship, judgment, and production depth.

## 2. Success criteria

The first production release is complete when:

- The site contains no placeholder biography, project, contact, metadata, or social-link content.
- Six real projects are represented and at least three have complete case studies.
- Every published claim can be supported by a résumé entry, project file, project presentation, or user-confirmed detail.
- Visitors can identify the designer's name, role, disciplines, selected work, experience, and contact method without searching.
- No original multi-gigabyte video is served directly to visitors.
- The homepage remains usable before video loads and with JavaScript, animation, or autoplay unavailable.
- The site works at 375, 768, 1024, and 1440 CSS pixels without horizontal overflow.
- Keyboard navigation, visible focus, reduced motion, meaningful image alternatives, and video captions are supported.
- Production pages have unique titles, descriptions, canonical URLs, and social-preview images.
- `npm run lint` and `npm run build` complete successfully.
- A production smoke test finds no broken navigation, missing media, browser-console errors, or failed requests.

## 3. Audiences and user journeys

### 3.1 Primary audiences

1. **Creative recruiter or hiring manager**
   - Wants to understand role fit, craft quality, software familiarity, and work history quickly.
   - Needs selected work, clear authorship, résumé access, and contact information.

2. **Agency or studio creative lead**
   - Wants evidence of visual judgment, production range, collaboration, and the ability to follow a brief.
   - Needs process, responsibilities, credits, and finished deliverables.

3. **Potential freelance client**
   - Wants to know what can be commissioned and whether the designer can deliver consistently.
   - Needs service categories, relevant commercial work, availability, and low-friction contact.

### 3.2 Primary journeys

- Home → selected project → case study → next project → contact.
- Home → experience → résumé → contact.
- Work → category filter → project → contact.
- Direct project URL → project context → more work → contact.

## 4. Scope

### 4.1 Version-one scope

- Responsive homepage.
- Filterable work index.
- Six real project entries.
- Three launch-ready case studies, with the remaining three allowed to use a concise gallery format if confirmed narrative information is unavailable.
- About page.
- Experience page.
- Contact page.
- Downloadable résumé.
- Per-page metadata, sitemap, robots file, favicon, and Open Graph image.
- Optimized images, poster frames, and web-ready video previews.
- Accessibility and performance validation.
- Deployment documentation and production smoke-test checklist.

### 4.2 Explicit non-goals for version one

- A CMS or admin dashboard.
- User accounts.
- A database.
- Comments or public uploads.
- A complex contact backend.
- Full multilingual duplication before English and Thai copy are confirmed.
- Publishing all approximately 500 source assets.
- Claiming engagement, sales, conversion, or business results without evidence.

## 5. Content strategy

### 5.1 Primary message

Recommended headline:

> Stories in motion. Brands with character.

Recommended supporting line:

> Multimedia designer creating video, motion, 3D, and visual campaigns from concept to final delivery.

Both lines are working copy. Confirm them before launch.

### 5.2 Voice

- Direct, confident, and concise.
- Specific about contribution and deliverables.
- Professional without corporate filler.
- Visual work leads; copy supplies context.
- Use first person on About and Contact pages.
- Use neutral project language in case studies.
- Avoid unsupported superlatives such as “award-winning,” “industry-leading,” or “high-performing.”

### 5.3 Evidence rules

- Separate personal work, academic work, club work, freelance work, and client work.
- State the exact role rather than implying sole ownership.
- Credit collaborators when known.
- Use production facts such as number of modules, reels, graphics, or deliverable formats when outcome metrics are not available.
- Label concept work as concept work.
- Do not display confidential client information or unapproved internal material.
- Confirm permission to publish identifiable people, client logos, and commissioned work.

## 6. Information architecture

### 6.1 Routes

| Route | Purpose | Primary action |
| --- | --- | --- |
| `/` | Positioning and selected work | View a project |
| `/work` | Complete curated project index | Filter and open a project |
| `/work/[slug]` | Project case study | Continue to another project or contact |
| `/about` | Biography, approach, skills, education | Download résumé |
| `/experience` | Work history and responsibilities | Contact |
| `/contact` | Direct contact and social links | Send email |
| `/resume.pdf` | Downloadable résumé | Download or print |

### 6.2 Global navigation

Desktop navigation:

- Name or monogram linking to Home.
- Work.
- About.
- Experience.
- Contact.
- Résumé download.

Mobile navigation:

- Name or monogram.
- Menu button with an accessible name and expanded state.
- Full-screen or large-panel menu with the same route order.
- Escape key and explicit close button.
- Focus returns to the menu trigger after closing.

## 7. Page specifications

### 7.1 Homepage

Section order:

1. **Hero**
   - Name, role, headline, supporting line, and availability/location if confirmed.
   - Primary CTA: `View selected work`.
   - Secondary CTA: `Contact me`.
   - Implemented: a short muted showreel band under the hero (`videos/hero/reel.mp4`, 6.4s, 1.4MB, ping-pong encoded so it restarts without a cut) with the project title linked to its case study.
   - Autoplay only starts when the visitor allows motion; reduced-motion visitors get the poster frame and download nothing. A visible pause control is always offered (WCAG 2.2.2).
   - Hero remains complete when motion is disabled.

2. **Selected work**
   - Six project cards.
   - AnimHoodie receives the largest visual treatment.
   - Mix portrait and landscape media without a visually chaotic masonry layout.
   - Each card includes title, disciplines, role, and year.

3. **Capability summary**
   - Video editing and storytelling.
   - Motion graphics.
   - 3D design and animation.
   - Graphic design and social campaigns.
   - Do not lead with UI/UX until a publishable interface project is available.

4. **Experience proof**
   - Short timeline containing only confirmed entries.
   - Link to full Experience page and résumé.

5. **About preview**
   - Portrait or working image if available and approved.
   - 60–100 word introduction.
   - Link to About.

6. **Contact call to action**
   - Direct email link.
   - Availability statement if confirmed.
   - Relevant social profiles only.

### 7.2 Work index

- Page title and a concise explanation of the disciplines represented.
- Filters: All, Video, Motion, 3D, Graphic Design.
- Filters must behave as buttons, not ARIA tabs, unless matching tab panels are implemented.
- Filtering must not trap focus or produce disorienting motion.
- Maintain a stable grid when possible.
- Cards must remain meaningful without hover.
- Do not auto-play videos in every card.
- Optional future enhancement: synchronize the active filter to a query string.

### 7.3 Case-study page

Required sections:

1. Back to Work link.
2. Project title and short summary.
3. Role, year, disciplines, tools, client/context, and deliverables.
4. Hero image or user-controlled video. Implemented: the hero is centred and capped at ~74vh by its own aspect ratio, so a 9:16 turntable, a square campaign graphic and a 2.4:1 post band all open at a comparable size instead of one filling the viewport. Video heroes need a poster and a real `src`; the native player is always user-controlled.
5. Brief or problem.
6. Creative approach.
7. Process.
8. Final work.
9. Result or evidence-based output summary.
10. Credits.
11. Previous and next project navigation.
12. Contact CTA.

Narrative sections should be omitted when reliable information does not exist. Never render placeholder headings with empty copy.

### 7.4 About page

- 150–250 word biography.
- Design philosophy or working approach.
- Four core disciplines.
- Software grouped by function rather than shown as an undifferentiated logo wall.
- Education with confirmed institution, program, and dates.
- Portrait or behind-the-scenes image if available.
- Résumé download.
- Contact CTA.

### 7.5 Experience page

Use a reverse-chronological timeline. Candidate entries found in the résumé include:

- 2026 freelance graphic design work for Pattaya Guide Thailand.
- 2026 freelance-contract motion graphic work for Me Style Solution Co., Ltd.
- 2025 part-time multimedia design work; company name and Thai description require confirmation.
- 2024 Coordinator and Gaffer internship at 20Pix Studio.
- 2020–2023 Content Creative and Multimedia Designer work for EN Photo Club.

Every entry must be checked against the résumé and corrected by the owner before publication because Thai PDF text extraction is incomplete.

Each entry should include:

- Position.
- Organization.
- Dates.
- Employment type.
- Two or three concrete responsibilities.
- Relevant disciplines or tools.
- Link to a related case study when applicable.

### 7.6 Contact page

- Large email link.
- Location and relocation/remote availability only after confirmation.
- Selected social links.
- Résumé download.
- No form in version one unless email delivery, spam handling, validation, success, and error states are implemented and tested.
- Do not expose a private phone number unless explicitly approved.

## 8. Project curation

### 8.1 Launch project order

1. AnimHoodie.
2. TK agricultural multimedia campaign.
3. Pattaya Guide Thailand social content system.
4. BlueVentureTPA e-learning series.
5. EN KKU events and ENPHOTO visual work.
6. Experimental 3D sci-fi environments.

### 8.2 Project 1 — AnimHoodie

Source:

- `Portfolio/03_Motion Graphics & 3D/Project AnimHoodie (Art toy Concept)`.
- `Portfolio/01_Short-Form Video/AnimHoodie Renders`.

Positioning:

- Academic or personal art-toy design project.
- Strongest complete case study and recommended lead project.

Available evidence:

- Project presentation.
- Character concept and objectives.
- Blender and Photoshop workflow.
- Modeling, sculpting, materials, lighting, rendering, and post-production.
- Front, back, side, and detail renders.
- Short rendered clips.

Required web deliverables:

- One 16:9 or 3:2 hero composition.
- Four optimized final renders.
- One short process or turntable video.
- Three process images if available.
- Complete case-study copy.

### 8.3 Project 2 — TK agricultural multimedia campaign

Sources:

- `Portfolio/01_Short-Form Video/TK Reels`.
- `Portfolio/01_Short-Form Video/TK Highlights & Ads`.
- `Portfolio/02_Long-Form Video/TK Full Interviews`.
- `Portfolio/04_Graphic Design/TK Promo Graphics`.

Positioning:

- Integrated field-content and social campaign.
- Demonstrates interviews, long-form editing, short-form adaptation, advertisements, and campaign graphics.

Available evidence:

- 27 reels.
- 11 highlights or advertisements.
- 7 full interviews.
- 72 promotional graphics.

Required confirmation:

- Client/brand name and permission.
- Exact responsibilities in production, camera, sound, editing, copy, and design.
- Production dates.
- Collaborators.
- Which products or claims may legally be displayed.

Required web deliverables:

- One landscape campaign montage.
- Two portrait reel previews.
- One full-interview excerpt.
- Four supporting graphics.
- Case-study copy emphasizing format adaptation and production workflow.

### 8.4 Project 3 — Pattaya Guide Thailand

Source:

- `Portfolio/04_Graphic Design/PattayaGuide.Thailand`.

Positioning:

- High-volume social-media design system for weekly travel and event content.
- Demonstrates speed, consistency, image compositing, typography, and brand adaptation.

Available evidence:

- Approximately 196 published or prepared graphics.
- Résumé identifies freelance graphic design work for the Instagram account.

Required web deliverables:

- Eight to twelve representative posts.
- One overview contact sheet showing system consistency.
- Before/after or template/process material if available.
- Copy describing cadence, constraints, and content categories.

### 8.5 Project 4 — BlueVentureTPA e-learning

Source:

- `Portfolio/02_Long-Form Video/BlueVentureTPA E-Learning`.

Positioning:

- Long-form educational motion and editing system for technical insurance content.

Available evidence:

- 20 video modules.
- Consistent presenter/character, typography, and graphic treatment.

Required confirmation:

- Client naming and publication permission.
- Role split across editing, motion, illustration, audio, and content preparation.
- Whether full clips or only short excerpts may be published.

Required web deliverables:

- One showreel-style module montage.
- Three still frames demonstrating information hierarchy.
- One process or template-system graphic.
- Concise gallery case study unless fuller production context is supplied.

### 8.6 Project 5 — EN KKU events and ENPHOTO

Sources:

- `Portfolio/02_Long-Form Video/En KKU Events`.
- `Portfolio/01_Short-Form Video/En KKU Short`.
- `Portfolio/04_Graphic Design/ENPHOTO`.

Positioning:

- Event storytelling and visual communication produced within a university creative organization.

Available evidence:

- Four long-form event films.
- Two short-form videos.
- Apparel, countdown, promotional, and identity graphics.
- Résumé identifies 2020–2023 work for EN Photo Club.

Required web deliverables:

- One event-film excerpt.
- Six selected graphics.
- One short summary of team context and responsibilities.
- Credits and dates.

### 8.7 Project 6 — Experimental 3D sci-fi environments

Sources:

- `Portfolio/03_Motion Graphics & 3D/3D Scifi Environment`.
- `Portfolio/03_Motion Graphics & 3D/3D Social Posts`.

Positioning:

- Experimental study of looping animation, materials, lighting, procedural form, and science-fiction environments.

Available evidence:

- Seven MP4 loops.
- One AVI render.
- Supporting stills.

Required web deliverables:

- Three compressed looping previews.
- Four stills.
- A short tools-and-exploration description.
- Clearly label this as experimental or personal work.

### 8.8 Secondary gallery

Potential material:

- CocoDamneon.
- Manipulation.
- Personal Art.
- Calligraphy.
- Graduation photography.
- Additional corporate video.

Add this only after the six primary projects are coherent. The secondary gallery must not compete with the case studies.

## 9. Content model

Replace the placeholder `Project` type with a model capable of representing real media and evidence.

Recommended conceptual shape:

```ts
type ProjectMedia = {
  type: "image" | "video";
  src: string;
  poster?: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  autoplayPreview?: boolean;
};

type Project = {
  slug: string;
  title: string;
  summary: string;
  context: "client" | "freelance" | "academic" | "club" | "personal";
  client?: string;
  year: string;
  disciplines: Array<"Video" | "Motion" | "3D" | "Graphic Design" | "Photography">;
  roles: string[];
  tools: string[];
  deliverables: string[];
  featured: boolean;
  featuredOrder?: number;
  cover: ProjectMedia;
  hero: ProjectMedia;
  brief?: string;
  approach?: string;
  process?: string;
  result?: string;
  evidence?: string[];
  gallery: ProjectMedia[];
  credits?: Array<{ role: string; name: string }>;
};
```

Implementation rules:

- Keep content in typed TypeScript for version one.
- Keep media metadata next to project content.
- Do not place filesystem discovery logic in request-time application code.
- Generate static project routes from the typed project list.
- Validate every slug and require unique slugs.
- Keep client components limited to interaction-heavy elements such as the mobile menu, filters, and optional media controls.
- Render project copy and static layouts as Server Components.

## 10. Visual design system

### 10.1 Direction

**Chosen style: Cinematic Editorial Minimalism with a Swiss-inspired grid.**

This is the approved visual direction for the build. It combines the atmosphere and scale of a film or motion-design portfolio with the order, readability, and restraint of Swiss editorial design. The result should feel confident, experimental, and visually distinctive while remaining professional enough for recruiters, studios, and commercial clients.

This direction fits the source work because:

- AnimHoodie and the sci-fi environments benefit from a dark, cinematic frame.
- The bright Pattaya Guide, TK, CocoDamneon, and promotional graphics stand out against a restrained neutral interface.
- Video, motion, 3D, graphic design, and photography can coexist inside one consistent editorial system.
- A spacious grid makes the portfolio feel curated rather than like a folder containing hundreds of unrelated files.
- Controlled typography and motion demonstrate visual judgment without competing with the work itself.

Core visual characteristics:

- Warm dark surfaces rather than pure black.
- High-contrast off-white typography.
- Olive and citron accents used selectively.
- Oversized editorial project titles.
- Spacious asymmetric compositions built on a clear grid.
- Large edge-to-edge media instead of small cards.
- Thin dividers and minimal borders.
- Mostly square corners or very small radii.
- Subtle film grain used only on large atmospheric surfaces.
- Short metadata labels set in monospace type.
- Restrained transitions that feel closer to professional video editing than decorative web animation.

Homepage visual treatment:

1. Open with the name, role, and the working headline `Stories in motion. Brands with character.`
2. Pair the introduction with one strong AnimHoodie composition or a short, muted showreel preview.
3. Keep `View selected work` as the dominant action and `Contact me` as the secondary action.
4. Follow the hero with six large projects arranged in an editorial grid with deliberate changes in scale.
5. Let project artwork provide most of the page color; keep navigation, copy, and controls visually quiet.
6. End with a simple, high-contrast contact statement rather than another decorated card section.

Styles and patterns to avoid:

- Generic white résumé-template styling.
- Glassmorphism, translucent panels, or blurred cards.
- Dashboard-like bento boxes surrounding every piece of content.
- Large border radii that make the site feel like a generic product interface.
- Multiple unrelated neon interface colors.
- Heavy glow, lens-flare, or science-fiction effects applied to commercial projects.
- Dense card grids that make every project appear equally important.
- Continuous parallax, scroll-jacking, bouncing transitions, or several autoplaying videos.
- A custom cursor that replaces essential hover, focus, or link feedback.
- Decorative visual effects that make copy harder to read or delay access to the work.

### 10.2 Palette

Revised on the owner's instruction: the warm brown canvas was replaced with a neutral
near-black so that project media is the only colour on the page, and Citron was promoted to
the primary accent (Olive moved to a secondary role).

| Token | Current value | Use |
| --- | --- | --- |
| Ink | `#0E0E0F` | Main background (neutral graphite; was warm brown `#454040`) |
| Slate | `#34343A` | Hairlines, borders, image placeholders |
| Citron | `#E6F082` | Primary accent: eyebrow labels, display highlights, primary CTAs |
| Olive | `#D8D365` | Secondary accent: card meta, selected state, cursor ring |
| Paper | `#F6F6F3` | Primary foreground |
| Muted | `#B6B6BA` | Secondary text; 9.1:1 on the current ink |

Per-project accent: each project carries an `accent` value in `src/lib/projects.ts`, sampled from
its own artwork, and `--accent` defaults to Citron in `globals.css`. Case studies and card meta use
it, so the archive carries the colours of the work instead of one brand hue. `npm run validate`
fails the build if an accent drops below 4.5:1 on Ink.

Required action:

- Measure all text and control-state combinations.
- Adjust muted text if it does not reach 4.5:1 at body-text sizes.
- Use Citron for visible keyboard focus but not as the only status indicator.
- Do not introduce unrelated accent colors; project media supplies color variation.

### 10.3 Typography

- Display: Archivo (600/700) for short English headings only, uppercase with negative tracking. Asimovian was retired on the owner's instruction; Archivo holds up better beside the project stills.
- Body: Inter.
- Metadata: Space Mono.
- Thai body copy, if published: add one locally hosted Thai-capable family such as Noto Sans Thai or IBM Plex Sans Thai after visual testing.
- Do not set long paragraphs in the display or monospace fonts.
- Keep body measure near 55–75 characters.
- Use fluid heading sizes with controlled minimum and maximum values.

### 10.4 Layout

- Maximum content width: approximately 1440px.
- Mobile gutters: 24px.
- Tablet and desktop gutters: 40px minimum.
- Use a 12-column desktop grid and a single-column mobile flow.
- Base spacing rhythm: 4, 8, 16, 24, 32, 48, 64, 96, 128.
- Prefer large media fields and simple dividers over card-within-card decoration.
- Keep important text above the fold at a 768px-high laptop viewport.

### 10.5 Motion

- Motion intensity: moderate, never continuous without purpose.
- Standard reveal duration: 300–500ms.
- Page-entry maximum: approximately 700ms.
- Use opacity and small translations; avoid heavy blur filters on many elements.
- Avoid scroll-jacking and mandatory horizontal scrolling.
- Pause media when offscreen where practical.
- With `prefers-reduced-motion: reduce`, render content in its final state and disable parallax, cursor effects, and nonessential looping motion.
- Do not animate layout bounds in ways that shift surrounding content on hover.

### 10.6 Custom cursor decision

The current site hides the native cursor and supplies a custom cursor on fine pointers. Before launch:

- Prefer removing native-cursor hiding.
- If retained, treat the custom cursor as a progressive decorative enhancement.
- Never make it the only indication of link purpose or state.
- Disable it under reduced motion and on touch/coarse pointers.
- Confirm it cannot lag, obscure controls, or remain stuck after navigation.

## 11. Component plan

### 11.1 Existing components to retain and revise

| Component | Action |
| --- | --- |
| `Navbar` | Retain; add real résumé link and route-state semantics |
| `MobileMenu` | Retain; verify focus management, Escape, body scroll, and return focus |
| `Hero` | Rewrite around confirmed copy and real poster/showreel media |
| `SelectedWork` | Retain structure; populate real ordered projects |
| `ProjectCard` | Replace swatches with optimized images and optional controlled preview |
| `Capabilities` | Reduce to four evidence-supported disciplines |
| `AboutPreview` | Replace placeholder copy and add real image if approved |
| `ContactCTA` | Replace copy and real contact destination |
| `WorkGrid` | Correct filter semantics and minimize animation cost |
| `CaseStudyBody` | Render real image/video media and evidence-based sections |
| `AboutBody` | Replace placeholder content and restructure skills |
| `ExperienceBody` | Populate confirmed résumé data |
| `ContactBody` | Populate real links and résumé download |
| `CustomCursor` | Remove or downgrade to optional progressive enhancement |
| `Footer` | Add current year, primary links, and real social links |

### 11.2 New components

- `ResponsiveImage` for consistent sizing, quality, and captions.
- `ProjectVideo` with poster, controls, captions, and optional muted preview mode.
- `ProjectMeta` for role, year, context, tools, and deliverables.
- `MediaGallery` supporting image and video items without duplicating layout code.
- `ResumeLink` to centralize download filename and tracking-free behavior.
- `SectionHeading` to standardize labels and heading hierarchy.
- `SkipLink` only if not retained directly in the root layout.

### 11.3 Server/client boundary

Default to Server Components.

Client Components should be limited to:

- Mobile-menu interaction.
- Work filters.
- Optional user-controlled video preview.
- Essential motion wrappers.

Do not mark full pages or complete case studies as client components solely to animate them. Keep serialized client props small and avoid shipping project narrative data twice.

## 12. Media-production pipeline

### 12.1 Source policy

- Treat `Port-full/Portfolio` as source material, not a deployable public directory.
- Copy only approved, optimized derivatives into the web project.
- Keep original files unchanged.
- Create a curation manifest that records each source path and its web derivative.
- Exclude drafts, duplicates, raw exports, internal documents, and private data.

### 12.2 Image derivatives

For every published image:

- Preserve a high-quality master outside `public`.
- Export WebP or AVIF where visual quality is acceptable.
- Use dimensions appropriate to actual display size.
- Supply width and height to prevent layout shift.
- Create a dedicated hero image when the source crop does not fit the layout.
- Use descriptive alt text for meaningful images.
- Use empty alt text for decorative duplicates.
- Put extra visual detail in captions rather than stuffing alt text.

Suggested targets:

- Hero image: 1600–2400px wide, generally under 500KB when practical.
- Project card: 800–1200px wide, generally under 200KB.
- Gallery image: 1200–1800px wide, generally under 350KB.
- Open Graph image: 1200×630.

These are targets, not automatic quality limits. Inspect every export for artifacts.

### 12.3 Video derivatives

- Never ship the 33GB long-form source directory directly.
- Export short previews rather than entire source programs for grids and hero sections.
- Use H.264 MP4 as the compatibility baseline; add WebM only if it creates meaningful savings.
- Create a poster image for every video.
- Use `playsInline` for mobile playback.
- Muted autoplay is allowed only for short previews with no essential audio.
- Full videos require visible controls.
- Use `preload="none"` or `metadata` below the fold.
- Do not autoplay several cards simultaneously.
- Provide captions for spoken content that is necessary to understand the work.
- Avoid infinite looping for long or narrative clips.

Suggested preview targets:

- Duration: 6–15 seconds.
- Resolution: 720p or 1080p depending on placement.
- Frame rate: retain 24/25/30fps unless motion quality requires more.
- Size: aim below 8MB for typical project previews and below 15MB for a single hero preview.

### 12.4 Suggested public structure

```text
public/
  images/
    profile/
    projects/
      animhoodie/
      tk-campaign/
      pattaya-guide/
      blueventure-elearning/
      en-kku/
      sci-fi-environments/
    social/
  videos/
    projects/
      animhoodie/
      tk-campaign/
      blueventure-elearning/
      en-kku/
      sci-fi-environments/
  documents/
    natnithichai-srikolchan-resume.pdf
```

## 13. Accessibility requirements

- One descriptive `h1` per page.
- Heading levels follow document structure.
- A working skip link is the first focusable element.
- Keyboard focus is always visible and is not hidden by sticky navigation.
- All interactive targets have accessible names.
- Mobile-menu state is announced with `aria-expanded` and `aria-controls`.
- Work filters use normal buttons unless full tab semantics are implemented.
- Do not rely on hover to reveal essential project information.
- Do not rely on color alone for active filters or links.
- Meaningful images have useful alt text.
- Decorative imagery uses empty alt text.
- Videos containing meaningful speech have captions or an adjacent transcript.
- Auto-playing media is muted, short, and pausable or stoppable where required.
- Reduced-motion users receive complete static content.
- Text reaches at least 4.5:1 contrast; large text and non-text controls meet applicable thresholds.
- Controls have comfortable pointer targets, approximately 44×44 CSS pixels where practical.
- External-link behavior is clear and does not unexpectedly replace work in progress.
- Link text describes its destination; avoid repeated unexplained “View more” links.
- Test at 200% zoom and with browser text enlargement.

## 14. Performance requirements

### 14.1 Performance budget

- Target Lighthouse performance: 90 or higher on representative production mobile runs.
- Target LCP: under 2.5 seconds at the 75th percentile after real-user data is available.
- Target CLS: under 0.1.
- Target INP: under 200ms.
- Initial route must not download full-resolution gallery media or long videos.

### 14.2 Implementation rules

- Use `next/image` for raster images unless a tested exception exists.
- Prioritize only the actual LCP image.
- Keep static content in Server Components.
- Dynamically import heavy optional client features.
- Import icons directly rather than through large custom barrel files.
- Defer analytics and other third-party scripts.
- Avoid blur filters and many simultaneous animated elements on long pages. Reveals are CSS transitions toggled by IntersectionObserver (components/Reveal.tsx), so there is no animation-library runtime to keep hydrated.
- Use `content-visibility: auto` cautiously for long below-the-fold galleries after testing focus and anchor behavior.
- Do not preload every project asset.
- Preload or prefetch high-value project routes on intentional hover/focus only if measurement supports it.
- Keep fonts local, subset weights, and load only used styles.
- Confirm that image and font choices do not create layout shift.

## 15. SEO and sharing

- Replace `https://example.com` with the production origin through configuration.
- Unique title and description for every project.
- Canonical URL for every indexable page.
- Dynamic or project-specific Open Graph image.
- Descriptive Open Graph title and summary.
- Correct `robots.ts` and `sitemap.ts` production URLs.
- Add person/portfolio JSON-LD only if implemented with safe serialization and verified data.
- Use semantic project titles and visible text; do not depend on filenames.
- Ensure the résumé is discoverable but does not expose unapproved private details.
- Include a custom 404 page with links back to Work and Home.

## 16. Privacy and publishing checks

- Confirm permission for client names and logos.
- Confirm rights to music used in public video excerpts.
- Confirm releases or publication permission for identifiable interview subjects and photography.
- Remove embedded location or author metadata from public derivatives when unnecessary.
- Do not publish personal address or phone details from the résumé without explicit approval.
- Do not publish raw project presentations if they contain student IDs or private metadata.
- Do not expose source-folder paths in rendered markup or production logs.

## 17. Implementation phases

### Phase 0 — Repository and project baseline

- [ ] Initialize Git in `Port-full/Web` only if the owner wants this directory to be the repository root.
- [ ] Add or verify `.gitignore` for `.next`, `node_modules`, local environment files, and generated media workfiles.
- [ ] Record current Node and package-manager expectations.
- [ ] Run the existing lint and production build before changing code.
- [ ] Capture baseline screenshots at 375, 768, 1024, and 1440 widths.
- [ ] Decide whether `portfolio-homepage` and `portfolio-scaffold` are references or obsolete copies; do not delete them as part of this build.

Acceptance:

- A clean, reproducible baseline exists and unrelated files are not included in future commits.

### Phase 1 — Content confirmation and curation

- [ ] Confirm name spelling and preferred public role title.
- [ ] Confirm public email, location, availability, and social links.
- [ ] Confirm English-only or English/Thai launch scope.
- [ ] Review résumé entries and correct Thai extraction gaps.
- [ ] Confirm the six launch projects.
- [ ] Confirm role, year, client/context, tools, deliverables, and credits for each project.
- [ ] Confirm publication permissions.
- [ ] Select specific source files for each project.
- [ ] Write 50–80 word summaries for all projects.
- [ ] Write complete narrative sections for the first three case studies.
- [ ] Approve headline and biography.

Acceptance:

- No build task depends on placeholder copy or an unidentified asset.

### Phase 2 — Media preparation

- [ ] Create the public media directory structure.
- [ ] Build a source-to-derivative manifest.
- [ ] Export project-card images.
- [ ] Export hero images.
- [ ] Export gallery images.
- [ ] Export short video previews.
- [ ] Generate poster images.
- [ ] Prepare captions or transcripts for required clips.
- [ ] Create the social-preview image.
- [ ] Copy a privacy-reviewed résumé PDF into `public/documents`.
- [ ] Inspect derivatives for crop quality, text readability, compression artifacts, and color shifts.

Acceptance:

- Every media reference in project data resolves to an approved, web-ready derivative.

### Phase 3 — Content architecture

- [ ] Expand project and media types.
- [ ] Replace placeholder project data with six real entries.
- [ ] Replace profile, capability, experience, education, and social data.
- [ ] Add a central site-configuration object for production URL and résumé path.
- [ ] Add validation or build-time assertions for missing slugs and required media.
- [ ] Keep static data server-side by default.

Acceptance:

- Searching the source directory for `Placeholder`, `example.com`, and placeholder social URLs returns no user-facing content.

### Phase 4 — Design-system foundation

- [ ] Validate palette contrast.
- [ ] Define semantic tokens for background, surface, foreground, muted text, border, accent, focus, and overlays.
- [ ] Define spacing, width, typography, radius, icon, and motion tokens.
- [ ] Add Thai font support only if Thai copy is approved.
- [ ] Remove native-cursor hiding or make the custom cursor a safe optional enhancement.
- [ ] Establish shared section and media styles.

Acceptance:

- Tokens cover all common states without one-off per-page colors or spacing values.

### Phase 5 — Global shell

- [ ] Update root metadata and production origin handling.
- [ ] Rebuild desktop navigation.
- [ ] Verify mobile-menu focus behavior.
- [ ] Keep and test the skip link.
- [ ] Update footer links and copy.
- [ ] Add the résumé download route/link.
- [ ] Add favicon and social-preview assets.
- [ ] Verify active-route indication.

Acceptance:

- All routes are reachable by keyboard and navigation remains usable at every target width.

### Phase 6 — Homepage

- [ ] Implement final hero copy and media.
- [ ] Implement selected-work composition.
- [ ] Connect real project cards.
- [ ] Reduce capabilities to supported disciplines.
- [ ] Add experience and about previews.
- [ ] Add final contact CTA.
- [ ] Apply restrained motion and reduced-motion behavior.

Acceptance:

- The homepage communicates name, role, work range, three strong projects, and contact path within one screen and one short scroll sequence.

### Phase 7 — Work index and case studies

- [ ] Correct filter semantics.
- [ ] Implement responsive project grid.
- [ ] Implement real image/video rendering in cards.
- [ ] Implement shared project metadata.
- [ ] Implement mixed-media galleries.
- [ ] Build complete AnimHoodie case study.
- [ ] Build complete TK campaign case study.
- [ ] Build complete Pattaya Guide case study.
- [ ] Build concise BlueVentureTPA, EN KKU, and 3D experiment pages.
- [ ] Add previous/next project navigation and contact CTA.
- [ ] Add per-project metadata and social images.

Acceptance:

- Every card opens a complete route; no project page contains a placeholder tile or empty narrative section.

### Phase 8 — About, experience, and contact

- [ ] Publish confirmed biography.
- [ ] Publish grouped skills and tools.
- [ ] Publish confirmed education.
- [ ] Publish corrected work timeline.
- [ ] Link related projects from experience entries.
- [ ] Publish approved contact and social information.
- [ ] Verify résumé download filename and document privacy.

Acceptance:

- All personal information is accurate, approved, and internally consistent across pages and résumé.

### Phase 9 — Accessibility and responsive QA

- [ ] Keyboard-test every route and control.
- [ ] Test focus visibility and order.
- [ ] Test menu open/close and focus return.
- [ ] Test reduced motion.
- [ ] Test at 200% zoom.
- [ ] Test 375, 768, 1024, and 1440 widths.
- [ ] Test long English and Thai text where applicable.
- [ ] Verify heading order and landmarks.
- [ ] Verify image alternatives and captions.
- [ ] Verify video controls, poster frames, and playback behavior.
- [ ] Run automated accessibility checks and manually review the results.

Acceptance:

- No known critical or serious accessibility defect remains.

### Phase 10 — Performance and production validation

- [ ] Run lint.
- [ ] Run a production build.
- [ ] Inspect route sizes and client-component boundaries.
- [ ] Verify only the hero LCP image is prioritized.
- [ ] Check video preload behavior.
- [ ] Check for layout shift.
- [ ] Run Lighthouse on Home, Work, and one media-heavy case study.
- [ ] Check browser console and network failures.
- [ ] Validate metadata, robots, sitemap, canonical URLs, favicon, and social preview.
- [ ] Test direct navigation and refresh on every route.
- [ ] Test 404 behavior.

Acceptance:

- Lint and production build pass, no broken media or routes exist, and performance targets are met or documented with an evidence-based exception.

### Phase 11 — Deployment and launch

- [ ] Choose and configure the production host.
- [ ] Set the canonical domain or temporary production origin.
- [ ] Configure only required environment variables.
- [ ] Deploy a preview and complete stakeholder review.
- [ ] Correct content, media, and layout issues found in preview.
- [ ] Deploy production.
- [ ] Run the production smoke test from a clean browser session.
- [ ] Verify social-preview rendering with a public URL.
- [ ] Record the production revision and deployment date.

Acceptance:

- The public URL serves the expected revision over HTTPS and all critical journeys succeed.

## 18. Recommended implementation commits

If Git is initialized, use small reviewable commits in this order:

1. `chore: establish portfolio project baseline`
2. `content: add confirmed profile and project data`
3. `assets: add optimized portfolio media`
4. `style: establish portfolio design tokens`
5. `feat: build global navigation and footer`
6. `feat: build portfolio homepage`
7. `feat: build work archive and filters`
8. `feat: build project case study media system`
9. `content: add six portfolio case studies`
10. `feat: complete about experience and contact pages`
11. `seo: add metadata sitemap and social previews`
12. `fix: complete accessibility and responsive QA`
13. `perf: optimize portfolio images video and client bundle`
14. `docs: add deployment and launch verification notes`

Do not combine source assets, generated derivatives, broad component refactors, and content changes into one unreviewable commit.

## 19. Test matrix

### Functional

- Global navigation links work.
- Mobile menu opens, closes, and restores focus.
- Work filters return the correct projects.
- Every project slug resolves.
- Unknown project slugs show the custom 404 page.
- Previous and next project links resolve.
- Email and social links use correct destinations.
- Résumé downloads with a clear filename.

### Responsive

- 375×667 mobile.
- 390×844 mobile.
- 768×1024 tablet portrait.
- 1024×768 tablet or small laptop landscape.
- 1440×900 desktop.
- 200% browser zoom.

### Media

- Poster appears before video playback.
- Videos do not unexpectedly play audio.
- Offscreen videos do not all preload or autoplay.
- Portrait and landscape media preserve intended crops.
- Images do not shift layout while loading.
- Missing media produces a deliberate fallback during development and fails validation before production.

### Accessibility

- Keyboard-only navigation.
- Visible focus.
- Screen-reader spot check on navigation, filters, media, headings, and links.
- Reduced-motion mode.
- Contrast verification.
- Captions or transcripts for meaningful spoken content.

### Production

- Clean direct load of every route.
- Refresh of dynamic project routes.
- No mixed content.
- No console errors.
- No failed requests.
- Correct canonical origin.
- Correct sitemap and robots output.
- Correct social sharing image.

## 20. Launch checklist

- [ ] Confirm all visible names, roles, dates, and organization names.
- [ ] Confirm contact email and social URLs.
- [ ] Confirm publication and music rights.
- [ ] Remove personal data not intended for the public site.
- [ ] Remove every placeholder string and placeholder asset.
- [ ] Confirm every project credit.
- [ ] Confirm every media caption and alt text.
- [ ] Confirm captions/transcripts.
- [ ] Confirm résumé filename and contents.
- [ ] Confirm production domain.
- [ ] Pass lint and build.
- [ ] Complete responsive, keyboard, reduced-motion, and media tests.
- [ ] Complete preview review.
- [ ] Complete production smoke test.

## 21. Required owner decisions

The following information cannot be reliably inferred from the asset library and must be supplied or approved before launch:

1. Preferred public title: `Multimedia Designer`, `Motion & Multimedia Designer`, or another title.
2. Final headline and biography.
3. Public email, location, availability, and social links.
4. English-only or English/Thai launch.
5. Confirmed institution and degree wording.
6. Correct 2025 employer name and responsibilities.
7. Exact role and credits for every client/team project.
8. Permission to name clients and show the selected work.
9. Permission to publish identifiable people in interviews and photography.
10. Whether the custom cursor should be removed.
11. Final production domain and host.

## 22. Definition of done

The portfolio is done when it is no longer a scaffold: it presents approved real work, accurate authorship, meaningful project narratives, responsive and accessible interactions, optimized media, valid production metadata, and a verified contact path. A visually attractive page with placeholder content, raw media, inaccessible motion, or unverifiable claims does not satisfy this plan.
