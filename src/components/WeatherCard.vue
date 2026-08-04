<script setup>
import { computed } from 'vue'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'select-card': (city) => Boolean(city?.id),
  'click-detail': (city) => Boolean(city?.id),
})

const selectCard = () => {
  emit('select-card', props.city)
}

const clickDetail = () => {
  emit('click-detail', props.city)
}

const weatherIcon = computed(() => {
  const iconMap = {
    맑음: '☀️',
    비: '🌧️',
    구름: '☁️',
    흐림: '🌥️',
  }

  return iconMap[props.city.status] ?? '🌤️'
})
</script>

<template>
  <article
    class="weather-card"
    :class="{ 'weather-card--selected': selected }"
    tabindex="0"
    :aria-label="`${city.name} 날씨 카드`"
    @click="selectCard"
    @keydown.enter.self="selectCard"
    @keydown.space.self.prevent="selectCard"
  >
    <div class="weather-identity">
      <span class="condition-icon" aria-hidden="true">{{ weatherIcon }}</span>

      <div class="weather-summary">
        <span class="region-label">REGIONAL WEATHER</span>
        <h3>{{ city.name }} <small>({{ city.status }})</small></h3>
        <p>현재 기온: <strong>{{ city.temp }}°C</strong></p>
      </div>
    </div>

    <div class="weather-actions">
      <span
        v-if="city.temp >= 25"
        class="temperature-label temperature-label--hot"
      >
        🔥 더움 (25도 이상)
      </span>
      <span v-else class="temperature-label temperature-label--cool">
        ❄️ 선선함 (25도 미만)
      </span>

      <button type="button" @click.stop="clickDetail">
        상세보기 <span aria-hidden="true">→</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.weather-card {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  flex-direction: column;
  gap: 18px;
  min-height: 172px;
  padding: 18px 20px;
  border: 1px solid #dbe7f0;
  border-radius: 17px;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 6px 18px rgb(52 94 130 / 6%);
  outline: none;
  transition:
    transform 160ms ease,
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.weather-card:hover,
.weather-card:focus-visible {
  border-color: #8fc8ee;
  box-shadow: 0 12px 28px rgb(52 104 148 / 13%);
  transform: translateY(-2px);
}

.weather-card--selected {
  border-color: #62b7e8;
  background: linear-gradient(135deg, #ffffff, #f0f9ff);
  box-shadow:
    0 12px 28px rgb(52 104 148 / 13%),
    inset 4px 0 0 #3da8e7;
}

.weather-identity {
  display: flex;
  align-items: center;
  gap: 15px;
}

.condition-icon {
  display: grid;
  flex: 0 0 auto;
  width: 52px;
  height: 52px;
  place-items: center;
  border: 1px solid #e2edf5;
  border-radius: 16px;
  background: linear-gradient(145deg, #f1faff, #fffcef);
  font-size: 1.55rem;
  box-shadow: 0 7px 16px rgb(76 126 166 / 9%);
}

.region-label {
  display: block;
  margin-bottom: 4px;
  color: #8aa0b3;
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

h3 {
  margin: 0;
  color: #29445e;
  font-size: 1.03rem;
  font-weight: 750;
}

h3 small {
  color: #6d8296;
  font-size: 0.79rem;
  font-weight: 600;
}

p {
  margin: 5px 0 0;
  color: #66758a;
  font-size: 0.82rem;
}

p strong {
  color: #304f6b;
}

.weather-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  gap: 12px;
}

.temperature-label {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.temperature-label--hot {
  color: #d65647;
  background: #fff0ed;
}

.temperature-label--cool {
  color: #2683bf;
  background: #eaf7ff;
}

button {
  flex: none;
  min-width: 94px;
  min-height: 36px;
  padding: 7px 12px;
  border: 1px solid #c9dce9;
  border-radius: 10px;
  color: #3c7295;
  background: #f7fbfe;
  font-size: 0.78rem;
  font-weight: 700;
  transition:
    border-color 140ms ease,
    color 140ms ease,
    background 140ms ease;
}

button:hover,
button:focus-visible {
  border-color: #2e91dd;
  color: #176ea9;
  background: #eaf7ff;
  outline: none;
}

@media (max-width: 560px) {
  .weather-card {
    min-height: 160px;
    padding: 14px;
  }
}
</style>
