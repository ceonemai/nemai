# Homepage design and content handoff

This is a review-stage direction, not a statement of public-app availability.

## Wireframe

1. **Hero:** centered positioning and unavailable download action above a phone screenshot carousel, surrounded by example metric cards cropped from the provided app screenshot.
2. **Meet NEM AI:** introductory product visual and six candidate capability cards.
3. **How it works:** illustrative profile, connection, and insights journey.
4. **Personal Health Intelligence:** health-context messaging and insight-screen placeholder.
5. **Privacy & trust:** placeholders for verified policy details and a link to the current privacy policy.
6. **Emergency Health Intelligence:** expertise, pending functionality, and an emergency-services disclaimer.
7. **About:** mission, brand mark, and a company-background placeholder.
8. **Download and footer:** unavailable download action, subscription, legal, and social links.

The hero uses a centered layout on all screen sizes. Other sections use spacious split layouts and cards on desktop, stacking in reading order on tablet and mobile.

## Visual direction / moodboard

- **Personality:** calm, optimistic, human, intelligent, and accessible.
- **Palette:** the previous site's light blue, cyan, and mint gradients, with deep readable text; brand blue `#4598C3`, cyan `#59E0F4`, green `#9FECB8`, and light green `#CCECD4` inform accents and surfaces. Darker shades preserve text contrast.
- **Typography:** existing Prometo for clear interface and headings, with a restrained editorial serif accent for emphasis.
- **Visual language:** generous whitespace, soft rounded panels, fine rules, subtle botanical/health-inspired color fields, and real product screenshots when approved. No fabricated interface is presented as a screenshot.
- **Motion:** staggered hero entrance, a floating phone with an automatically rotating screenshot slideshow, drifting screenshot cards with illustrative values that count up and gently fluctuate while visible, orbiting accents, ambient glow, and hover transitions. Rotation pauses on hover or keyboard focus. Reduced motion disables automatic playback and keeps the original screenshot values static.

## Content and components

Homepage sections, screenshot placeholders, and reusable section headings live in `src/components/HomePage/`. Candidate capabilities and journey steps are collected in `content.js`; all remain labeled pending confirmation. The shared `DownloadCTA` uses the supplied App Store badge and displays a disabled action with a release-pending notice until `appDownloadUrl` in `content.js` is set to an approved store URL. Do not set it to a web-app, localhost, or placeholder URL.

The hero cards use cropped images in `src/assets/images/hero-*.png`. The original screenshot is in `public/app screenshot/`, so the complete original is also publicly accessible and will be included in builds; review its contents before deployment.
The phone carousel uses that screenshot and the supplied app video from the same public folder. The video plays muted without visible controls when motion is enabled and is unloaded outside the visible carousel; review the full video before deployment. The screenshot is displayed for the video's duration, and rotation waits for the video to finish.

Before publication, supply and review:

- Approved mobile screenshots and descriptive alt text for each screenshot placeholder; confirm the example data in the hero cards is appropriate for publication.
- Confirmed public-app features, supported integrations, and the actual onboarding journey; remove or clearly label anything unavailable.
- Approved store URL and platform-specific download copy, if needed.
- Verified details about data permissions, synchronization, security, and responsible AI; ensure these match the linked policy.
- Approved emergency guidance, clinical safety language, company background, and mission copy.

When a real download link is configured, activating it emits the browser event `nemai:download` with `{ placement }` (`hero` or `final`) in `event.detail`. An analytics integration can listen for this event without collecting health data. No analytics vendor is configured, and no event is emitted for the disabled state.

The header and footer are shared with the existing blog and legal routes. The subscription form retains its existing behavior.

## Review locally

Run `npm run dev` for a development preview, or `npm run build` followed by `npm run preview` for a production-build preview. Review on desktop and mobile before deployment.
