<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()

const currentUnitName = computed(() =>
  configStore.unit === 'celsius' ? '섭씨' : '화씨',
)

const nextUnitName = computed(() =>
  configStore.unit === 'celsius' ? '화씨' : '섭씨',
)
</script>

<template>
  <div class="unit-toggler" role="group" aria-label="온도 단위 설정">
    <span class="current-unit">
      <small>날씨 단위</small>
      <strong>{{ currentUnitName }} {{ configStore.unitSymbol }}</strong>
    </span>

    <motion.button
      type="button"
      :aria-label="`온도 단위를 ${nextUnitName}로 변경`"
      :while-hover="{ y: -2, scale: 1.025 }"
      :while-press="{ scale: 0.94 }"
      :transition="{ type: 'spring', stiffness: 430, damping: 24 }"
      @click="configStore.toggleUnit"
    >
      <span aria-hidden="true">↔</span>
      단위 변경
    </motion.button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
  padding-left: 12px;
  border-left: 1px solid rgb(31 42 43 / 14%);
}

.current-unit {
  display: grid;
  min-width: 68px;
  gap: 1px;
  color: #66716f;
  text-align: right;
}

.current-unit small {
  color: #89918f;
  font-size: 0.58rem;
  font-weight: 700;
}

.current-unit strong {
  color: #263332;
  font-size: 0.72rem;
  font-weight: 850;
}

button {
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 11px;
  border: 0;
  border-radius: 999px;
  color: #ffffff;
  background: #263332;
  box-shadow: none;
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
  transition:
    background 150ms ease,
    transform 150ms ease;
}

button:hover,
button:focus-visible {
  background: #df6b44;
  outline: 3px solid rgb(237 124 82 / 18%);
  transform: translateY(-1px);
}

@media (max-width: 560px) {
  .unit-toggler {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
    padding: 8px 5px 2px;
    border-top: 1px solid rgb(31 42 43 / 14%);
    border-left: 0;
  }

  .current-unit {
    text-align: left;
  }
}
</style>
