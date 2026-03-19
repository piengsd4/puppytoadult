<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
  breed: {
    type: Object,
    default: null,
  },
  stage: {
    type: String,
    default: "puppy",
  },
});

const emit = defineEmits(["update:stage"]);

const facts = computed(() => {
  if (!props.breed) {
    return [];
  }

  return [
    ["Group", props.breed.group],
    ["Size", props.breed.size],
    ["Origin", props.breed.origin],
    ["Adult weight", props.breed.adultWeight],
    ["Puppy window", props.breed.puppyWindow],
    ["Adult maturity", props.breed.adultWindow],
  ];
});

const currentImage = computed(() => {
  if (!props.breed) {
    return "";
  }

  return props.stage === "adult" ? props.breed.adultImage : props.breed.puppyImage;
});

const currentStageLabel = computed(() => (props.stage === "adult" ? "adult" : "puppy"));

const currentCaption = computed(() => {
  if (!props.breed) {
    return "";
  }

  return props.stage === "adult"
    ? `${props.breed.name} adult view. Replace this placeholder with a mature breed image when the library is ready.`
    : `${props.breed.name} puppy view. Replace this placeholder with an early-stage breed image when the library is ready.`;
});
</script>

<template>
  <section class="spotlight" aria-labelledby="spotlight-title">
    <div class="spotlight-copy">
      <p class="section-kicker">Breed spotlight</p>

      <template v-if="breed">
        <h2 id="spotlight-title">{{ breed.name }}</h2>
        <p class="spotlight-summary">{{ breed.summary }} {{ breed.note }}</p>

        <dl class="spotlight-facts">
          <div v-for="[label, value] in facts" :key="label">
            <dt>{{ label }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>

        <div class="tag-list" aria-label="Temperament tags">
          <span v-for="trait in breed.traits" :key="trait" class="tag">{{ trait }}</span>
        </div>

        <div class="spotlight-actions">
          <RouterLink class="button button-secondary" :to="{ name: 'breed', params: { slug: breed.slug } }">
            Open full profile
          </RouterLink>
        </div>
      </template>

      <template v-else>
        <h2 id="spotlight-title">No breed matches those filters</h2>
        <p class="spotlight-summary">Adjust the search or filters to restore the gallery.</p>
      </template>
    </div>

    <div class="spotlight-visual">
      <div class="stage-toggle" role="tablist" aria-label="Spotlight image stage">
        <button
          class="stage-toggle-button"
          :class="{ 'is-active': stage === 'puppy' }"
          type="button"
          :aria-pressed="String(stage === 'puppy')"
          @click="emit('update:stage', 'puppy')"
        >
          Puppy stage
        </button>
        <button
          class="stage-toggle-button"
          :class="{ 'is-active': stage === 'adult' }"
          type="button"
          :aria-pressed="String(stage === 'adult')"
          @click="emit('update:stage', 'adult')"
        >
          Adult stage
        </button>
      </div>

      <template v-if="breed">
        <figure class="spotlight-frame">
          <img :src="currentImage" :alt="`${breed.name} ${currentStageLabel} stage placeholder illustration`">
          <figcaption>{{ currentCaption }}</figcaption>
        </figure>

        <div class="mini-stage-grid" aria-label="Selected breed comparison">
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
      </template>
    </div>
  </section>
</template>
