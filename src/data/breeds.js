import breedRecords from "./breeds.json";

function svgToDataUri(svg) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escapeForSvg(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function createPlaceholderArtwork(breedName, stageLabel, palette, hint) {
  const [light, mid, dark] = palette;
  const stageName = stageLabel === "puppy" ? "Puppy stage" : "Adult stage";
  const safeBreedName = escapeForSvg(breedName);
  const safeTitle = escapeForSvg(`${breedName} ${stageName}`);
  const safeHint = escapeForSvg(hint);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 520" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${light}" />
          <stop offset="100%" stop-color="${mid}" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="20" stdDeviation="18" flood-color="${dark}" flood-opacity="0.18" />
        </filter>
      </defs>
      <rect width="640" height="520" rx="42" fill="url(#bg)" />
      <circle cx="100" cy="94" r="100" fill="#ffffff" fill-opacity="0.16" />
      <circle cx="552" cy="432" r="136" fill="#ffffff" fill-opacity="0.18" />
      <g transform="translate(154 94)" filter="url(#shadow)">
        <ellipse cx="166" cy="290" rx="140" ry="48" fill="${dark}" fill-opacity="0.18" />
        <ellipse cx="166" cy="158" rx="120" ry="132" fill="${mid}" />
        <ellipse cx="112" cy="114" rx="28" ry="78" transform="rotate(-24 112 114)" fill="${mid}" />
        <ellipse cx="220" cy="114" rx="28" ry="78" transform="rotate(24 220 114)" fill="${mid}" />
        <ellipse cx="166" cy="214" rx="56" ry="42" fill="#ffffff" fill-opacity="0.24" />
        <circle cx="128" cy="158" r="8" fill="${dark}" />
        <circle cx="204" cy="158" r="8" fill="${dark}" />
        <circle cx="166" cy="192" r="10" fill="${dark}" />
        <path d="M142 208 Q166 228 190 208" stroke="${dark}" stroke-width="8" stroke-linecap="round" fill="none" />
      </g>
      <text x="42" y="58" fill="${dark}" font-size="20" font-family="Trebuchet MS, sans-serif" letter-spacing="3">PUPPY TO ADULT</text>
      <text x="42" y="440" fill="${dark}" font-size="50" font-family="Georgia, serif" font-weight="700">${safeBreedName}</text>
      <text x="42" y="482" fill="${dark}" font-size="24" font-family="Trebuchet MS, sans-serif">${stageName} placeholder</text>
      <text x="598" y="58" text-anchor="end" fill="${dark}" font-size="18" font-family="Trebuchet MS, sans-serif">${safeHint}</text>
    </svg>
  `;

  return svgToDataUri(svg);
}

function getStageImage(record, stage) {
  const palette = stage === "adult" ? record.colors.adult : record.colors.puppy;
  const hint = stage === "adult" ? "Swap in real adult photo" : "Swap in real puppy photo";

  return createPlaceholderArtwork(record.name, stage, palette, hint);
}

export const breeds = breedRecords.map((record) => ({
  ...record,
  puppyImage: getStageImage(record, "puppy"),
  adultImage: getStageImage(record, "adult"),
  imageDirectory: `/public/images/breeds/${record.slug}/`,
}));

export function getBreedBySlug(slug) {
  return breeds.find((breed) => breed.slug === slug) ?? null;
}

export function getRelatedBreeds(currentBreedOrSlug, limit = 3) {
  const currentBreed =
    typeof currentBreedOrSlug === "string" ? getBreedBySlug(currentBreedOrSlug) : currentBreedOrSlug;

  if (!currentBreed) {
    return [];
  }

  return breeds
    .filter((candidate) => candidate.slug !== currentBreed.slug)
    .map((candidate) => {
      const sharedTraits = candidate.traits.filter((trait) => currentBreed.traits.includes(trait)).length;
      let score = sharedTraits;

      if (candidate.group === currentBreed.group) {
        score += 3;
      }

      if (candidate.size === currentBreed.size) {
        score += 2;
      }

      return {
        candidate,
        score,
      };
    })
    .sort((left, right) => right.score - left.score || left.candidate.name.localeCompare(right.candidate.name))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
