# Frontend styling and loading

The frontend uses Tailwind CSS v4 through the Vite plugin. `src/index.css` contains only the Tailwind import, theme tokens, global defaults, and animation definitions. Font stylesheets are linked from `index.html`, avoiding a CSS import chain.

Component and responsive styles belong in JSX. `src/components/ui/styles.ts` holds reusable utility strings for buttons, fields, panels, and restaurant card geometry. Page buttons are pills; the `in-[dialog]` variant gives modal buttons softer rectangular corners. Restaurant cards and their skeletons share geometry constants.

`src/components/ui/Skeleton.tsx` provides accessible loading regions and reduced-motion-aware placeholders. Screen layouts live in `LoadingSkeletons.tsx`, `DiscoverySkeleton.tsx`, and `RestaurantSkeletons.tsx`. Skeletons render for missing data, while refreshes keep existing content visible. `useResource` owns its cache per mounted component, keeping admin data isolated. Public discovery and favorites retain their existing shared caches.

Route screens are lazy loaded through `PageLoader`, with matching skeleton fallbacks and a retry screen if a chunk cannot load. Backend endpoints, request contracts, and authentication decisions remain in their existing services and guards.

Run these checks from the project root:

- `npm --prefix frontend run build`
- `npm --prefix frontend run lint`
- `npm --prefix frontend run test:ux`
- `npm --prefix frontend run test:styles`

The style test checks component utilities against the installed Tailwind compiler, catching forgotten custom class names or unsupported utilities. Tailwind source detection is limited to `src`, so skill documents and tests cannot inflate production CSS.
