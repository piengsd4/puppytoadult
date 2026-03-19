<script setup>
import { watchEffect } from "vue";
import { RouterLink } from "vue-router";
import SiteHeader from "../components/SiteHeader.vue";

watchEffect(() => {
  document.title = "Page not found | Puppy to Adult";
});
</script>

<template>
  <div class="page-shell">
    <SiteHeader />

    <main>
      <section class="detail-section missing-page">
        <p class="section-kicker">404</p>
        <h1 class="detail-title">This page does not exist.</h1>
        <p class="detail-intro">
          The current project has a homepage and breed detail routes. Everything else should route back into that
          library structure.
        </p>
        <div class="missing-page-links">
          <RouterLink class="button button-primary" :to="{ name: 'home' }">Back to homepage</RouterLink>
          <RouterLink class="button button-secondary" :to="{ name: 'home', hash: '#breed-gallery' }">
            Browse breed gallery
          </RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
