<script setup>
import { RouterLink } from "vue-router";
</script>

<template>
  <nav class="topbar" aria-label="Primary">
    <RouterLink class="brand" :to="{ name: 'home' }">
      <span class="brand-mark">PTA</span>
      <span class="brand-copy">
        <strong>Puppy to Adult</strong>
        <span>Breed photo reference base</span>
      </span>
    </RouterLink>
    <div class="topbar-links">
      <RouterLink :to="{ name: 'home', hash: '#breed-gallery' }">Browse breeds</RouterLink>
      <RouterLink :to="{ name: 'home', hash: '#site-plan' }">Plan the library</RouterLink>
    </div>
  </nav>
</template>
