# Puppy to Adult

A Vue + Vite starter website for showing how dog breeds change from puppy stage to adult stage.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Structure

- `src/App.vue`: router host
- `src/router/index.js`: homepage, breed profile, and not-found routes
- `src/views/HomeView.vue`: homepage with gallery, filters, and spotlight
- `src/views/BreedView.vue`: routed breed detail page
- `src/views/NotFoundView.vue`: fallback route
- `src/components/BreedCard.vue`: reusable gallery card
- `src/components/SpotlightPanel.vue`: featured breed comparison panel
- `src/components/SiteHeader.vue`: shared top navigation
- `src/data/breeds.json`: raw breed content records
- `src/data/breeds.js`: data enrichment, placeholder image generation, and helpers
- `src/style.css`: global layout and visual system

## Routes

- `/`: homepage
- `/breeds/:slug`: individual breed profile pages

## Replace placeholder images

Each breed profile uses the slug from `src/data/breeds.json`. The image scaffold is already created under `public/images/breeds/`.

Example:

```text
public/images/breeds/golden-retriever/puppy.jpg
public/images/breeds/golden-retriever/adult.jpg
```

## Next steps

- Connect real image paths in the data layer
- Move breed data into a CMS when the content set grows
- Add photo credits and submission workflows
