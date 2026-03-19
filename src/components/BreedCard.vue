<script setup>
import { RouterLink } from "vue-router";

defineProps({
  breed: {
    type: Object,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  index: {
    type: Number,
    default: 0,
  },
});

defineEmits(["select"]);
</script>

<template>
  <article :class="['breed-card', { 'is-active': active }]" :style="{ '--card-index': index }">
    <div class="breed-card-header">
      <div>
        <p>{{ breed.group }}</p>
        <h3>{{ breed.name }}</h3>
      </div>
      <span class="size-pill">{{ breed.size }}</span>
    </div>

    <p class="breed-card-summary">{{ breed.summary }}</p>

    <div class="stage-pair">
      <figure class="stage-card">
        <img :src="breed.puppyImage" :alt="`${breed.name} puppy stage placeholder illustration`" loading="lazy">
        <figcaption>
          <strong>Puppy stage</strong>
          <span>{{ breed.puppyWindow }}</span>
        </figcaption>
      </figure>

      <figure class="stage-card">
        <img :src="breed.adultImage" :alt="`${breed.name} adult stage placeholder illustration`" loading="lazy">
        <figcaption>
          <strong>Adult stage</strong>
          <span>{{ breed.adultWindow }}</span>
        </figcaption>
      </figure>
    </div>

    <dl class="breed-facts">
      <div>
        <dt>Coat</dt>
        <dd>{{ breed.coat }}</dd>
      </div>
      <div>
        <dt>Adult weight</dt>
        <dd>{{ breed.adultWeight }}</dd>
      </div>
    </dl>

    <div class="chip-row">
      <span v-for="trait in breed.traits" :key="trait" class="chip">{{ trait }}</span>
    </div>

    <div class="card-actions">
      <button class="card-action" type="button" @click="$emit('select', breed.id)">
        Focus this breed
      </button>
      <RouterLink class="card-link" :to="{ name: 'breed', params: { slug: breed.slug } }">
        View profile
      </RouterLink>
    </div>
  </article>
</template>
