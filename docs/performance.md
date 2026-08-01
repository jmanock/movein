# Front-end performance

The production build keeps only essential interactivity in client components: navigation, ZIP lookup, corrections, the privacy-safe analytics bridge, and print action. Lookup pages and the new local-resource sections remain server-rendered. Phase 3 added no image, animation, UI, CMS, or visual-testing dependency and removed unused legacy CSS selectors.

The homepage hero uses Next.js Image with explicit 1600×880 dimensions, responsive `sizes`, modern negotiated formats, and priority because it is the LCP candidate. The 1200×630 social PNG is not loaded into page content. `npm run frontend:audit` warns on public raster assets over 1 MB.

Release checks use production `next start`, representative HTTP requests, browser layout inspection, and static asset counts. This is not a substitute for field data. After deployment, review LCP, INP, and CLS by page type before adding scripts or imagery.

Local evidence for this release: the production build compiled in under two seconds and generated 55 pages. Compressed response sizes were about 9.6 KB for the homepage, 13.1 KB for Learn Your Area, and 37.9 KB for a content-rich multi-provider ZIP page. The runtime audit found seven focused client components, four public raster images, 64 representative internal targets, and no serious front-end failures; none of the images crossed the 1 MB warning threshold.
