<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import BreedCard from "../components/BreedCard.vue";
import SiteHeader from "../components/SiteHeader.vue";
import SpotlightPanel from "../components/SpotlightPanel.vue";
import { breeds } from "../data/breeds";

const sizeOrder = ["Small", "Medium", "Large", "Giant"];

const search = ref("");
const group = ref("all");
const size = ref("all");
const stage = ref("puppy");
const selectedBreedId = ref(breeds[0]?.id ?? null);

watchEffect(() => {
  document.title = "Puppy to Adult | Browse dog breeds from puppy to adult";
});

const groups = computed(() => [...new Set(breeds.map((breed) => breed.group))].sort());

const sizes = computed(() =>
  [...new Set(breeds.map((breed) => breed.size))].sort(
    (left, right) => sizeOrder.indexOf(left) - sizeOrder.indexOf(right)
  )
);

const filteredBreeds = computed(() => {
  const query = search.value.trim().toLowerCase();

  return breeds.filter((breed) => {
    const matchesSearch =
      !query ||
      breed.name.toLowerCase().includes(query) ||
      breed.group.toLowerCase().includes(query) ||
      breed.traits.some((trait) => trait.toLowerCase().includes(query));

    const matchesGroup = group.value === "all" || breed.group === group.value;
    const matchesSize = size.value === "all" || breed.size === size.value;

    return matchesSearch && matchesGroup && matchesSize;
  });
});

watch(
  filteredBreeds,
  (nextBreeds) => {
    if (!nextBreeds.length) {
      return;
    }

    if (!nextBreeds.some((breed) => breed.id === selectedBreedId.value)) {
      selectedBreedId.value = nextBreeds[0].id;
    }
  },
  { immediate: true }
);

const selectedBreed = computed(() => {
  if (!filteredBreeds.value.length) {
    return null;
  }

  return filteredBreeds.value.find((breed) => breed.id === selectedBreedId.value) ?? filteredBreeds.value[0];
});

const resultsLabel = computed(() => {
  const count = filteredBreeds.value.length;
  return `${count} breed${count === 1 ? "" : "s"} shown`;
});

const groupSummary = computed(() =>
  group.value === "all" ? "Every breed group is visible." : `${group.value} breeds are currently in focus.`
);

const sizeSummary = computed(() =>
  size.value === "all" ? "Sizes from small to giant are included." : `${size.value} breeds are currently in focus.`
);

function selectBreed(breedId) {
  selectedBreedId.value = breedId;
}
</script>

<template>
  <div class="page-shell">
    <header class="hero" id="top">
      <SiteHeader />

      <div class="hero-grid">
        <section class="hero-copy">
          <p class="eyebrow">Growth gallery starter</p>
          <h1>Show how every breed grows from a soft-faced puppy into its full adult shape.</h1>
          <p class="hero-text">
            This base is structured for side-by-side imagery, breed notes, and quick filtering, so the site can start
            as a curated gallery and later grow into a full photo library.
          </p>
          <div class="hero-actions">
            <a class="button button-primary" href="#breed-gallery">Explore breed cards</a>
            <a class="button button-secondary" href="#site-plan">See expansion plan</a>
          </div>
          <ul class="hero-stats" aria-label="Site snapshot">
            <li>
              <strong>{{ breeds.length }}</strong>
              <span>starter breeds</span>
            </li>
            <li>
              <strong>2-stage</strong>
              <span>comparison layout</span>
            </li>
            <li>
              <strong>Searchable</strong>
              <span>gallery controls</span>
            </li>
          </ul>
        </section>

        <aside class="hero-panels" aria-label="Stage highlights">
          <article class="stage-teaser stage-teaser-puppy">
            <p>Puppy stage</p>
            <h2>Rounder faces, oversized paws, softer coats.</h2>
          </article>
          <article class="stage-teaser stage-teaser-adult">
            <p>Adult stage</p>
            <h2>Finished proportions, mature coat, settled expression.</h2>
          </article>
        </aside>
      </div>
    </header>

    <main>
      <section class="control-panel" aria-label="Breed filters">
        <div class="control-group">
          <label for="search-input">Search breed</label>
          <input
            id="search-input"
            v-model="search"
            name="search"
            type="search"
            placeholder="Golden Retriever, Husky, Shiba Inu..."
            autocomplete="off"
          >
        </div>
        <div class="control-group control-group-select">
          <label for="group-filter">Group</label>
          <div class="select-shell select-shell-moss">
            <span class="select-accent">Pack</span>
            <select id="group-filter" v-model="group" name="group">
              <option value="all">All groups</option>
              <option v-for="breedGroup in groups" :key="breedGroup" :value="breedGroup">
                {{ breedGroup }}
              </option>
            </select>
            <span class="select-chevron" aria-hidden="true"></span>
          </div>
          <p class="control-note">{{ groupSummary }}</p>
        </div>
        <div class="control-group control-group-select">
          <label for="size-filter">Size</label>
          <div class="select-shell select-shell-accent">
            <span class="select-accent">Scale</span>
            <select id="size-filter" v-model="size" name="size">
              <option value="all">All sizes</option>
              <option v-for="breedSize in sizes" :key="breedSize" :value="breedSize">
                {{ breedSize }}
              </option>
            </select>
            <span class="select-chevron" aria-hidden="true"></span>
          </div>
          <p class="control-note">{{ sizeSummary }}</p>
        </div>
      </section>

      <SpotlightPanel :breed="selectedBreed" :stage="stage" @update:stage="stage = $event" />

      <section class="gallery-section" id="breed-gallery">
        <div class="section-header">
          <div>
            <p class="section-kicker">Gallery</p>
            <h2>Starter breed collection</h2>
          </div>
          <p class="section-copy">
            Each card is already set up to show puppy and adult imagery together, so replacing placeholder artwork with
            real photography is a straight swap.
          </p>
        </div>

        <p class="results-meta" aria-live="polite">{{ resultsLabel }}</p>

        <div v-if="filteredBreeds.length" class="breed-grid">
          <BreedCard
            v-for="(breed, index) in filteredBreeds"
            :key="breed.id"
            :breed="breed"
            :active="breed.id === selectedBreedId"
            :index="index"
            @select="selectBreed"
          />
        </div>

        <div v-else class="empty-state">
          <strong>No breeds matched.</strong>
          <p>Try a broader search term or reset the group and size filters.</p>
        </div>
      </section>

      <section class="plan-section" id="site-plan" aria-labelledby="plan-title">
        <div class="section-header">
          <div>
            <p class="section-kicker">Build forward</p>
            <h2 id="plan-title">How this base can expand</h2>
          </div>
          <p class="section-copy">
            The current structure already supports a real content pipeline: photo URLs, breed facts, and a larger
            catalogue can be fed into the same layout later.
          </p>
        </div>

        <div class="plan-grid">
          <article class="plan-card">
            <h3>Swap in real photography</h3>
            <p>
              Replace each placeholder image with a real puppy photo and adult photo while keeping alt text, metadata,
              and breed notes intact.
            </p>
          </article>
          <article class="plan-card">
            <h3>Add deeper breed profiles</h3>
            <p>
              Link every gallery card to a profile page with timelines, grooming notes, weight ranges, and growth
              milestones.
            </p>
          </article>
          <article class="plan-card">
            <h3>Collect community submissions</h3>
            <p>
              Add a submission form for owners or breeders to upload matching puppy/adult pairs and supply photo
              credits.
            </p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
