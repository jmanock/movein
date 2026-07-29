# Front-end performance

The production build statically renders 50 pages and keeps only essential interactivity in client components: navigation, ZIP lookup, corrections, analytics bridge, and print action. Lookup pages remain server-rendered. No animation, UI, analytics, CMS, or visual-testing framework was added.

The homepage hero uses Next.js Image with explicit 1600×880 dimensions, responsive `sizes`, modern negotiated formats, and priority because it is the LCP candidate. The 1200×630 social PNG is not loaded into page content. `npm run frontend:audit` warns on public raster assets over 1 MB.

Release checks use production `next start`, representative HTTP requests, browser layout inspection, and static asset counts. This is not a substitute for field data. After deployment, review LCP, INP, and CLS by page type before adding scripts or imagery.

Local evidence for this release: the production build compiled in about 1.5 seconds and generated 50 pages; representative HTML responses ranged from roughly 20 KB (unsupported ZIP) to 120 KB (multi-provider ZIP). The audit found six client components and four public raster images, with none over its 1 MB warning threshold. Browser inspection reported no horizontal overflow at 320px or 1280px and a loaded hero image with explicit dimensions.
