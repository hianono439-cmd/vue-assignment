<script setup>
import { computed } from 'vue'
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

    <button
      type="button"
      :aria-label="`온도 단위를 ${nextUnitName}로 변경`"
      @click="configStore.toggleUnit"
    >
      <span aria-hidden="true">↔</span>
      단위 변경
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-left: auto;
  padding-left: 12px;
  border-left: 1px solid #dce9f3;
}

.current-unit {
  display: grid;
  min-width: 68px;
  gap: 1px;
  color: #60788d;
  text-align: right;
}

.current-unit small {
  color: #91a3b3;
  font-size: 0.58rem;
  font-weight: 700;
}

.current-unit strong {
  color: #375b76;
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
  border-radius: 10px;
  color: #ffffff;
  background: #294f6d;
  box-shadow: 0 7px 14px rgb(41 79 109 / 16%);
  font-size: 0.7rem;
  font-weight: 800;
  white-space: nowrap;
  transition:
    background 150ms ease,
    transform 150ms ease;
}

button:hover,
button:focus-visible {
  background: #1e6d9d;
  outline: 3px solid rgb(67 169 228 / 20%);
  transform: translateY(-1px);
}

@media (max-width: 560px) {
  .unit-toggler {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
    padding: 8px 5px 2px;
    border-top: 1px solid #dce9f3;
    border-left: 0;
  }

  .current-unit {
    text-align: left;
  }
}
</style>
