# Performance and Core Web Vitals

## Launch implementation

- The only above-the-fold editorial image uses `next/image`, explicit intrinsic output dimensions, a responsive `sizes` value, WebP compression, and preload discovery in the initial HTML.
- Below-the-fold content remains text, CSS, and the existing tree-shaken Lucide icon set; no slider, video, parallax, animation framework, or third-party tracking script was added.
- Guide visuals are server-rendered HTML/CSS and do not add image requests or client hydration.
- Most routes are statically generated. Only the newsletter endpoint and whitelisted social-image route require request-time work.
- Image containers have fixed dimensions to prevent layout shift.
- Fonts use the Next.js font integration with `display: swap`.
- Timeline and newsletter are the only feature-level client components; guide content remains server-rendered.

## Targets and interpretation

- LCP: 2.5 seconds or better
- CLS: 0.1 or better
- INP: 200 ms or better when field interaction data is available

Lab tools estimate performance under simulated conditions. Search Console and the Chrome User Experience Report provide field Core Web Vitals only after enough real traffic exists. Record the audit tool, route, device profile, date, and environment whenever comparing releases.

## Regression checks

Run a production build and server, inspect `/`, `/timeline`, `/florida`, and one long guide, then confirm:

- the hero image is discoverable in initial HTML and is not lazy-loaded;
- no route has horizontal overflow at supported widths;
- no new third-party scripts or blocking font requests appear;
- browser and server consoles remain clear;
- images have stable boxes and useful alt text;
- the sitemap and canonical pages return 200.

## July 27, 2026 production audit

Lighthouse was run against the local optimized production server with its simulated mobile profile:

| Route | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 83 | 100 | 100 | 100 | 0.8 s | 4.7 s | 20 ms | 0 |
| `/florida/hurricane-preparation` | 98 | 100 | 100 | 100 | 0.8 s | 2.5 s | 10 ms | 0 |

The accessibility figures include the contrast-token correction made after the first audit. The homepage lab LCP remains a follow-up item; its zero CLS and low blocking time indicate a stable, responsive page, but real-user field data should determine whether further hero simplification is warranted.
