# Manish Kushwaha — Portfolio

A Next.js portfolio styled as a code editor (IDE) with depth-based parallax scrolling — dark theme in black / neon green / cyan.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Project structure

- `app/page.js` — assembles all sections and handles active-tab tracking
- `app/layout.js` — fonts (JetBrains Mono + Inter) and page metadata
- `components/ParallaxBackground.js` — the multi-layer parallax depth effect (grid + drifting code tokens + big glyphs)
- `components/Sidebar.js` — file-tree navigation (acts as your nav menu)
- `components/TabBar.js` — open-tabs bar (also navigation, syncs with active section)
- `components/StatusBar.js` — bottom VS Code–style status bar
- `components/SectionFrame.js` — shared wrapper that gives every section its line-number gutter + file path breadcrumb
- `components/About.js`, `Skills.js`, `Projects.js`, `Experience.js`, `Blog.js`, `Contact.js` — the actual content sections

## What you should customize

1. **Resume**: replace `public/resume.pdf` with your real resume (same filename, or update the link in `components/About.js`).
2. **Projects**: edit the `PROJECTS` array in `components/Projects.js` — add real names, descriptions, tech stacks, GitHub links and live demo URLs.
3. **Experience/Education**: edit the `TIMELINE` array in `components/Experience.js` with your real history.
4. **Blog**: once you're ready to publish, replace the placeholder draft list in `components/Blog.js` with real posts (or wire it up to an MDX/CMS source later).
5. **Bio copy**: tweak the paragraph in `components/About.js` to match your voice.
6. **Contact form**: currently uses a `mailto:` link (no backend/email service needed) — it opens the visitor's email client pre-filled with their message, addressed to manishkushwaha572000@gmail.com. If you'd rather have messages land directly in an inbox without opening the visitor's mail client, you can later swap this for a service like Formspree, EmailJS or Resend.

## Notes

- Colors and fonts are defined as design tokens in `tailwind.config.js` — change them there to retheme everything at once.
- Parallax respects `prefers-reduced-motion`.
- Sidebar collapses into a drawer on mobile/tablet; tabs scroll horizontally on small screens.
