<script setup>
import { motion } from 'motion-v'

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
  <motion.section
    class="dashboard-card"
    :aria-labelledby="headingId"
    :initial="{ opacity: 0, y: 28, filter: 'blur(8px)' }"
    :while-in-view="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
    :in-view-options="{ once: true, amount: 0.16, margin: '0px 0px -48px 0px' }"
    :transition="{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }"
  >
    <h2 :id="headingId">
      <motion.span
        v-if="icon"
        :while-hover="{ rotate: 9, scale: 1.12 }"
        :transition="{ type: 'spring', stiffness: 360, damping: 18 }"
        aria-hidden="true"
      >{{ icon }}</motion.span>
      {{ title }}
    </h2>

    <slot />
  </motion.section>
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
