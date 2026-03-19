<script setup>
import { computed, ref, watch, watchEffect } from "vue";
import { RouterLink, useRoute } from "vue-router";
import SiteHeader from "../components/SiteHeader.vue";
import { getBreedBySlug, getRelatedBreeds } from "../data/breeds";

const route = useRoute();
const stage = ref("puppy");

const breed = computed(() => getBreedBySlug(String(route.params.slug || "")));

watch(
  () => route.params.slug,
  () => {
    stage.value = "puppy";
  }
);

watchEffect(() => {
  document.title = breed.value ? `${breed.value.name} | Puppy to Adult` : "Breed not found | Puppy to Adult";
});

const detailFacts = computed(() => {
  if (!breed.value) {
    return [];
  }

  return [
    ["Group", breed.value.group],
    ["Size", breed.value.size],
    ["Origin", breed.value.origin],
    ["Coat", breed.value.coat],
    ["Adult weight", breed.value.adultWeight],
    ["Life expectancy", breed.value.lifeExpectancy],
  ];
});

const currentImage = computed(() => {
  if (!breed.value) {
    return "";
  }

  return stage.value === "adult" ? breed.value.adultImage : breed.value.puppyImage;
});

const currentCaption = computed(() => {
  if (!breed.value) {
    return "";
  }

  return stage.value === "adult"
    ? `${breed.value.name} adult view. Replace this image with a mature-stage photo when the real library is ready.`
    : `${breed.value.name} puppy view. Replace this image with an early-stage photo when the real library is ready.`;
});

const relatedBreeds = computed(() => (breed.value ? getRelatedBreeds(breed.value, 3) : []));
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main v-if="breed">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <RouterLink :to="{ name: 'home' }">Home</RouterLink>
        <span>/</span>
        <span aria-current="page">{{ breed.name }}</span>
      </nav>

      <section class="detail-hero">
        <div class="detail-copy">
          <p class="section-kicker">{{ breed.group }} reference</p>
          <h1 class="detail-title">{{ breed.name }}</h1>
          <p class="detail-intro">{{ breed.detailIntro }}</p>

          <div class="tag-list">
            <span v-for="trait in breed.traits" :key="trait" class="tag">{{ trait }}</span>
          </div>

          <dl class="detail-facts-grid">
            <div v-for="[label, value] in detailFacts" :key="label">
              <dt>{{ label }}</dt>
              <dd>{{ value }}</dd>
            </div>
          </dl>
        </div>

        <div class="detail-visual">
          <div class="stage-toggle" role="tablist" aria-label="Breed image stage">
            <button
              class="stage-toggle-button"
              :class="{ 'is-active': stage === 'puppy' }"
              type="button"
              :aria-pressed="String(stage === 'puppy')"
              @click="stage = 'puppy'"
            >
              Puppy stage
            </button>
            <button
              class="stage-toggle-button"
              :class="{ 'is-active': stage === 'adult' }"
              type="button"
              :aria-pressed="String(stage === 'adult')"
              @click="stage = 'adult'"
            >
              Adult stage
            </button>
          </div>

          <figure class="spotlight-frame detail-frame">
            <img :src="currentImage" :alt="`${breed.name} ${stage} stage placeholder illustration`">
            <figcaption>{{ currentCaption }}</figcaption>
          </figure>

          <div class="detail-stage-grid">
            <article class="detail-stage-card detail-stage-card-puppy">
              <p>Puppy look</p>
              <h2>{{ breed.puppyLook }}</h2>
              <span>{{ breed.puppyWindow }}</span>
            </article>
            <article class="detail-stage-card detail-stage-card-adult">
              <p>Adult look</p>
              <h2>{{ breed.adultLook }}</h2>
              <span>{{ breed.adultWindow }}</span>
            </article>
          </div>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Growth timeline</p>
            <h2>What changes over time</h2>
          </div>
          <p class="section-copy">
            These milestone notes give the future content model a real profile structure instead of only a gallery card.
          </p>
        </div>

        <div class="timeline-grid">
          <article v-for="entry in breed.growthTimeline" :key="entry.age" class="timeline-card">
            <p class="timeline-age">{{ entry.age }}</p>
            <h3>{{ entry.title }}</h3>
            <p>{{ entry.description }}</p>
          </article>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Photo planning</p>
            <h2>How to capture a good puppy-to-adult pair</h2>
          </div>
          <p class="section-copy">
            This section turns the site into a useful reference, even before a full photo archive exists.
          </p>
        </div>

        <div class="detail-columns">
          <article class="detail-note-card">
            <p>Comparison note</p>
            <h3>{{ breed.note }}</h3>
          </article>

          <article class="detail-note-card">
            <p>Image folder</p>
            <h3>{{ breed.imageDirectory }}</h3>
            <span>Drop `puppy.jpg` and `adult.jpg` into this folder when real photography is ready.</span>
          </article>

          <ul class="detail-list">
            <li v-for="tip in breed.photoAdvice" :key="tip">{{ tip }}</li>
          </ul>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Care profile</p>
            <h2>What this breed needs around maturity</h2>
          </div>
          <p class="section-copy">
            These content slots make the profile pages more valuable than a pure image grid.
          </p>
        </div>

        <div class="care-grid">
          <article v-for="item in breed.careProfile" :key="item.label" class="care-card">
            <p>{{ item.label }}</p>
            <h3>{{ item.value }}</h3>
            <span>{{ item.description }}</span>
          </article>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Stage comparison</p>
            <h2>Keep both images visible together</h2>
          </div>
          <p class="section-copy">
            The same pair can live inside a profile page, a homepage card, and future comparison tools without changing
            the data shape.
          </p>
        </div>

        <div class="mini-stage-grid detail-mini-stage-grid">
          <article class="mini-stage-card">
            <img :src="breed.puppyImage" :alt="`${breed.name} puppy stage placeholder illustration`" loading="lazy">
            <h3>Puppy stage</h3>
            <p>{{ breed.puppyWindow }}</p>
          </article>
          <article class="mini-stage-card">
            <img :src="breed.adultImage" :alt="`${breed.name} adult stage placeholder illustration`" loading="lazy">
            <h3>Adult stage</h3>
            <p>{{ breed.adultWindow }}</p>
          </article>
        </div>
      </section>

      <section class="detail-section">
        <div class="section-header">
          <div>
            <p class="section-kicker">Related breeds</p>
            <h2>Explore similar growth stories</h2>
          </div>
          <p class="section-copy">
            Related navigation keeps users moving through the catalogue instead of bouncing after one profile.
          </p>
        </div>

        <div class="related-grid">
          <RouterLink
            v-for="relatedBreed in relatedBreeds"
            :key="relatedBreed.slug"
            class="related-card"
            :to="{ name: 'breed', params: { slug: relatedBreed.slug } }"
          >
            <img :src="relatedBreed.puppyImage" :alt="`${relatedBreed.name} puppy stage placeholder illustration`" loading="lazy">
            <div>
              <p>{{ relatedBreed.group }}</p>
              <h3>{{ relatedBreed.name }}</h3>
              <span>{{ relatedBreed.summary }}</span>
            </div>
          </RouterLink>
        </div>
      </section>
    </main>

    <main v-else>
      <section class="detail-section missing-page">
        <p class="section-kicker">Breed not found</p>
        <h1 class="detail-title">That breed profile is not in the library yet.</h1>
        <p class="detail-intro">
          The route exists, but there is no matching breed record for this slug. Return to the homepage and choose a
          breed from the current starter collection.
        </p>
        <div class="missing-page-links">
          <RouterLink class="button button-primary" :to="{ name: 'home' }">Back to homepage</RouterLink>
          <RouterLink class="button button-secondary" :to="{ name: 'home', hash: '#breed-gallery' }">
            Browse current breeds
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
