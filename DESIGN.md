# Design

## Source of truth
- Status: Active
- Last refreshed: 2026-06-06
- Primary product surfaces: single-page portfolio/curriculum, unified project universe, timeline, contact CTA.
- Evidence reviewed: `assets/` project images, `assets/fotoprofilo.png`, live reference at `https://enricoiorio.vercel.app`, current-site HTML snapshot saved under `.omx/logs/current-site.html`.

## Brand
- Personality: direct, energetic, technical, disciplined, accessible.
- Trust signals: real profile photo, project logos/screens, years of experience, client/project counts, links to live sites, clear contact data.
- Avoid: generic agency landing-page feel, flat black page with no hierarchy, empty vertical scrolling, decorative-only visuals without project evidence.

## Product goals
- Goals: present Enrico Iorio as a full-stack developer/freelancer, show work history, make projects memorable, drive email/contact.
- Non-goals: exact pixel clone of the old site, authentication, CMS, multi-page routing, backend form handling.
- Success signals: first viewport communicates name/role immediately, projects are visually rich, horizontal motion is present but controllable, contact CTA is obvious.

## Personas and jobs
- Primary personas: small business owners, community/server founders, local professionals, collaborators evaluating technical work.
- User jobs: understand who Enrico is, scan experience, inspect project examples, visit live sites, contact quickly.
- Key contexts of use: mobile-first browsing from social links, desktop review by potential clients, quick portfolio sharing.

## Information architecture
- Primary navigation: Home, Bio, Competenze, Esperienza, Progetti, Metodo, Contatti.
- Core routes/screens: static `index.html` sections with anchored navigation.
- Content hierarchy: hero identity and CTA first, biography and skill proof, timeline with CreateMe, unified project section, method/process, contact.

## Design principles
- Principle 1: every large visual element should be tied to Enrico or a real project asset.
- Principle 2: motion should make browsing feel guided, not block content access.
- Tradeoffs: black, white, and violet are the main theme; panels stay compact so the visual weight does not become chaotic.

## Visual language
- Color: black base, white text, violet lines/buttons/details, restrained white glow accents.
- Typography: geometric display headings, readable sans-serif body, tight but not compressed hierarchy.
- Spacing/layout rhythm: generous section spacing, compact project cards, centered project headings, mouse-wheel horizontal carousel, moving rails to break normal vertical scrolling.
- Shape/radius/elevation: crisp 8px radius max, thin borders, layered shadows with violet tint.
- Motion: loader, reveal-on-scroll, marquee rails, inertial mouse-wheel project carousel, constellation canvas, scanline drift, cursor trail, magnetic CTAs, card tilt/spotlight, timeline signal pulse, subtle parallax, reduced-motion fallback.
- Imagery/iconography: use local project images and profile photo; icons are simple text/symbol treatments where no icon library exists.

## Components
- Existing components to reuse: none; the repository was empty except assets.
- New/changed components: fixed nav, hero portrait stage, animated stats, marquee strips, skill bars, timeline cards with logos and pulse, compact inertial project carousel, moving image rails, compact project archive, magnetic contact panel.
- Variants and states: active nav state, hover/focus states, reduced-motion behavior, mobile menu.
- Token/component ownership: tokens live in `styles.css`; behavior lives in `script.js`.

## Accessibility
- Target standard: practical WCAG AA.
- Keyboard/focus behavior: visible focus outlines on links/buttons; anchors remain native.
- Contrast/readability: dark text on white, violet accents checked by using darker violet for text/buttons.
- Screen-reader semantics: semantic sections, headings, alt text, aria labels for menu/progress.
- Reduced motion and sensory considerations: `prefers-reduced-motion` disables heavy animation/canvas movement and transform effects degrade to static readable content.

## Responsive behavior
- Supported breakpoints/devices: mobile portrait, tablets, desktop, wide desktop.
- Layout adaptations: hero/timeline/project areas collapse to one column; horizontal project track supports mouse-wheel scrolling and native touch scrolling.
- Touch/hover differences: drag and wheel enhancement where pointer is available; touch uses native horizontal scroll.

## Interaction states
- Loading: short animated loader with progress line.
- Empty: no empty states required for static content.
- Error: failed images retain alt text and card context.
- Success: mail/social/site links open through native browser behavior.
- Disabled: not applicable.
- Offline/slow network, if applicable: all primary assets are local; external links are optional.

## Content voice
- Tone: confident, concrete, friendly, Italian-first.
- Terminology: "progetti", "lavori", "metodo", "siti web", "server", "freelance".
- Microcopy rules: short CTAs, no over-explaining UI behavior on-screen.

## Implementation constraints
- Framework/styling system: static HTML/CSS/JS; no build step required.
- Design-token constraints: CSS custom properties only.
- Performance constraints: lazy-load non-critical images, avoid dependencies, respect reduced motion.
- Compatibility constraints: modern evergreen browsers.
- Test/screenshot expectations: serve locally and inspect generated layout; run basic HTML/link/asset validation.

## Open questions
- [ ] Replace placeholder-level project descriptions with more precise metrics/case results when available / Enrico / improves credibility.
- [ ] Confirm whether old domains `imperialcraft.it`, `devora.it`, `mindmirror.app`, and `clonix.io` are still active / Enrico / prevents dead external CTAs.
