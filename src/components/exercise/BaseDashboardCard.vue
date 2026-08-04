<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    default: '',
  },
  headingId: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <section class="dashboard-card" :aria-labelledby="headingId">
    <h2 :id="headingId">
      <span v-if="icon" aria-hidden="true">{{ icon }}</span>
      {{ title }}
    </h2>

    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  margin-top: 24px;
  padding: 22px;
  border: 1px solid #e0ebf4;
  border-radius: 20px;
  background: linear-gradient(145deg, rgb(248 252 255 / 94%), #f4f9fd);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 90%);
}

h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 0 0 15px;
  color: #29445e;
  font-size: 1rem;
  letter-spacing: -0.015em;
}

@media (max-width: 560px) {
  .dashboard-card {
    padding: 15px;
  }
}
</style>
