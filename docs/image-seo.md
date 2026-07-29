# Image SEO

- Homepage hero uses Next.js Image with fixed intrinsic dimensions, responsive `sizes`, WebP encoding, and preload because it is the LCP candidate. Its empty alt is intentional: adjacent text communicates the full purpose and the image is decorative.
- Default social card: `public/images/seo/movein-og-2026.png`, 1200×630. It contains the brand and purpose in a safe social-sharing layout.
- Route metadata uses `/og?title=…&path=…` for distinct 1200×630 server-generated cards with concise route context.
- Content imagery should be added only where it teaches something. Informative images need specific alt text; decorative images use empty alt.
- Keep explicit width/height or aspect ratio, prefer modern formats for page imagery, and avoid loading offscreen images eagerly.
