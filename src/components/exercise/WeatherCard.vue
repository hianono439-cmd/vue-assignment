<script setup>
import { computed, nextTick, ref } from 'vue'
import { motion } from 'motion-v'
import { useTemperature } from '../../composables/useTemperature'
import { getWeatherEmoji } from '../../utils/weatherPresentation'

const props = defineProps({
  city: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    default: false,
  },
  revealDelay: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits({
  'select-card': (city) => Boolean(city?.id),
  'click-detail': (city) => Boolean(city?.id),
})

const rawTemperature = computed(() => props.city.temp)
const { displayTemp, unitSymbol } = useTemperature(rawTemperature)
const rawFeelsLike = computed(() => props.city.feelsLike)
const { displayTemp: displayFeelsLike } = useTemperature(rawFeelsLike)
const isFlipped = ref(false)

const selectCard = () => {
  emit('select-card', props.city)
}

const clickDetail = () => {
  emit('click-detail', props.city)
}

const getFlipButtonId = (side) =>
  `weather-card-${props.city.id}-${side}-flip`

const toggleFlip = async (event) => {
  const isKeyboardActivation = event?.detail === 0

  if (event?.currentTarget instanceof HTMLElement) {
    event.currentTarget.blur()
  }

  const nextIsFlipped = !isFlipped.value
  isFlipped.value = nextIsFlipped

  if (!isKeyboardActivation) return

  await nextTick()
  const nextButtonSide = nextIsFlipped ? 'back' : 'front'
  document
    .getElementById(getFlipButtonId(nextButtonSide))
    ?.focus({ preventScroll: true })
}

const weatherIcon = computed(() => getWeatherEmoji(props.city.status))
</script>

<template>
  <motion.article
    layout
    class="weather-card"
    :class="{
      'weather-card--selected': selected,
      'weather-card--featured': featured,
      'weather-card--flipped': isFlipped,
    }"
    :initial="{ opacity: 0, y: 24, scale: 0.975 }"
    :while-in-view="{ opacity: 1, y: 0, scale: 1 }"
    :while-hover="{ y: -4, scale: 1.01 }"
    :while-press="{ scale: 0.985 }"
    :in-view-options="{ once: true, amount: 0.14 }"
    :transition="{
      duration: 0.46,
      delay: revealDelay,
      ease: [0.22, 1, 0.36, 1],
      layout: { type: 'spring', stiffness: 360, damping: 31 },
    }"
    tabindex="0"
    :aria-label="`${city.name} 날씨 카드${isFlipped ? ', 빠른 정보 표시 중' : ''}`"
    @click="selectCard"
    @keydown.enter.self="selectCard"
    @keydown.space.self.prevent="selectCard"
  >
    <motion.div
      class="weather-card__stage"
      :animate="{ rotateY: isFlipped ? 180 : 0 }"
      :transition="{ type: 'spring', stiffness: 240, damping: 25 }"
    >
      <div
        class="weather-card__face weather-card__face--front"
        :inert="isFlipped"
        :aria-hidden="isFlipped"
      >
        <div class="weather-identity">
          <span class="condition-icon" aria-hidden="true">{{ weatherIcon }}</span>

          <div class="weather-summary">
            <span class="region-label">
              <i aria-hidden="true"></i> 실시간 관측
            </span>
            <h3>{{ city.name }} <small>({{ city.description }})</small></h3>
            <p>현재 기온: <strong>{{ displayTemp }}{{ unitSymbol }}</strong></p>
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

          <div class="weather-buttons">
            <motion.button
              :id="getFlipButtonId('front')"
              type="button"
              class="quick-button"
              :while-hover="{ y: -2 }"
              :while-press="{ scale: 0.94 }"
              :transition="{ type: 'spring', stiffness: 430, damping: 23 }"
              :aria-label="`${city.name} 빠른 기상 정보 보기`"
              @click.stop="toggleFlip"
            >
              빠른 정보 <span aria-hidden="true">↻</span>
            </motion.button>

            <motion.button
              type="button"
              :while-hover="{ x: 3 }"
              :while-press="{ scale: 0.94 }"
              :transition="{ type: 'spring', stiffness: 430, damping: 23 }"
              @click.stop="clickDetail"
            >
              상세보기 <span aria-hidden="true">→</span>
            </motion.button>
          </div>
        </div>
      </div>

      <div
        class="weather-card__face weather-card__face--back"
        :inert="!isFlipped"
        :aria-hidden="!isFlipped"
      >
        <div class="back-heading">
          <span aria-hidden="true">{{ weatherIcon }}</span>
          <div>
            <small>빠른 기상 정보</small>
            <h3>{{ city.name }} 빠른 정보</h3>
          </div>
        </div>

        <dl class="quick-metrics">
          <div>
            <dt>체감온도</dt>
            <dd>{{ displayFeelsLike }}{{ unitSymbol }}</dd>
          </div>
          <div>
            <dt>습도</dt>
            <dd>{{ city.humidity ?? '—' }}%</dd>
          </div>
          <div>
            <dt>풍속</dt>
            <dd>{{ city.windSpeed ?? '—' }}m/s</dd>
          </div>
          <div>
            <dt>가시거리</dt>
            <dd>{{ city.visibilityKm ?? '—' }}km</dd>
          </div>
        </dl>

        <div class="back-actions">
          <motion.button
            :id="getFlipButtonId('back')"
            type="button"
            :while-press="{ scale: 0.94 }"
            @click.stop="toggleFlip"
          >
            <span aria-hidden="true">↶</span> 앞면 보기
          </motion.button>
          <motion.button
            type="button"
            :while-hover="{ x: 3 }"
            :while-press="{ scale: 0.94 }"
            @click.stop="clickDetail"
          >
            상세 페이지 <span aria-hidden="true">→</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  </motion.article>
</template>

<style scoped>
.weather-card {
  min-width: 0;
  min-height: 194px;
  border-radius: 17px;
  perspective: 1200px;
  outline: none;
  isolation: isolate;
}

.weather-card--featured {
  grid-column: span 2;
  min-height: 220px;
}

.weather-card__stage {
  display: grid;
  min-height: inherit;
  height: 100%;
  transform-style: preserve-3d;
}

.weather-card__face {
  grid-area: 1 / 1;
  display: flex;
  min-width: 0;
  min-height: inherit;
  height: 100%;
  justify-content: space-between;
  flex-direction: column;
  gap: 18px;
  padding: 18px 20px;
  overflow: hidden;
  border: 1px solid #dbe7f0;
  border-radius: 17px;
  backface-visibility: hidden;
  box-shadow: 0 6px 18px rgb(52 94 130 / 6%);
  transform-style: preserve-3d;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

.weather-card__face--front {
  background:
    radial-gradient(circle at 92% 8%, rgb(77 180 231 / 10%), transparent 34%),
    rgb(255 255 255 / 96%);
}

.weather-card__face--back {
  color: #ffffff;
  background:
    radial-gradient(circle at 94% 4%, rgb(117 230 206 / 25%), transparent 34%),
    linear-gradient(145deg, #24455f, #2b7589);
  transform: rotateY(180deg);
}

.weather-card:hover .weather-card__face,
.weather-card:focus-visible .weather-card__face,
.weather-card:focus-within .weather-card__face {
  border-color: #8fc8ee;
  box-shadow: 0 12px 28px rgb(52 104 148 / 13%);
}

.weather-card--selected .weather-card__face {
  border-color: #62b7e8;
  box-shadow:
    0 12px 28px rgb(52 104 148 / 13%),
    inset 4px 0 0 #3da8e7;
}

.weather-card--featured .weather-card__face {
  padding: 22px 24px;
}

.weather-card--featured .weather-card__face--front {
  background:
    radial-gradient(circle at 88% 12%, rgb(64 175 230 / 19%), transparent 36%),
    linear-gradient(135deg, #ffffff, #eef9ff);
}

.weather-card--featured .condition-icon {
  width: 66px;
  height: 66px;
  font-size: 2rem;
}

.weather-card--featured .weather-summary h3 {
  font-size: 1.24rem;
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
  align-items: center;
  display: flex;
  gap: 5px;
  display: block;
  margin-bottom: 4px;
  color: #8aa0b3;
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.region-label i {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #37bc80;
  box-shadow: 0 0 0 3px rgb(55 188 128 / 13%);
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
  flex-wrap: wrap;
  gap: 12px;
}

.weather-buttons,
.back-actions {
  display: flex;
  align-items: center;
  gap: 7px;
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

.quick-button {
  color: #55788f;
  background: #edf5f9;
}

button:hover,
button:focus-visible {
  border-color: #2e91dd;
  color: #176ea9;
  background: #eaf7ff;
  outline: none;
}

.back-heading {
  display: flex;
  align-items: center;
  gap: 11px;
}

.back-heading > span {
  display: grid;
  flex: 0 0 auto;
  width: 43px;
  height: 43px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 18%);
  border-radius: 13px;
  background: rgb(255 255 255 / 10%);
  font-size: 1.35rem;
}

.back-heading small {
  color: #9eddd9;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.back-heading h3 {
  margin-top: 3px;
  color: #ffffff;
}

.quick-metrics {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  margin: 0;
}

.quick-metrics div {
  min-width: 0;
  padding: 9px;
  border: 1px solid rgb(255 255 255 / 11%);
  border-radius: 10px;
  background: rgb(255 255 255 / 8%);
}

.quick-metrics dt {
  color: #b6d7df;
  font-size: 0.58rem;
  font-weight: 700;
}

.quick-metrics dd {
  overflow: hidden;
  margin: 4px 0 0;
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 850;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.back-actions {
  justify-content: flex-end;
}

.back-actions button {
  border-color: rgb(255 255 255 / 18%);
  color: #ffffff;
  background: rgb(255 255 255 / 10%);
}

.back-actions button:last-child {
  color: #285b70;
  background: #e8fbf7;
}

.back-actions button:hover,
.back-actions button:focus-visible {
  border-color: rgb(255 255 255 / 48%);
  color: #ffffff;
  background: rgb(255 255 255 / 18%);
}

.back-actions button:last-child:hover,
.back-actions button:last-child:focus-visible {
  color: #174c64;
  background: #ffffff;
}

@media (max-width: 560px) {
  .weather-card {
    min-height: 224px;
  }

  .weather-card--featured {
    grid-column: auto;
  }

  .weather-card__face,
  .weather-card--featured .weather-card__face {
    padding: 15px;
  }

  .weather-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .weather-buttons,
  .weather-buttons button {
    flex: 1;
  }

  .quick-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .back-actions {
    justify-content: stretch;
  }

  .back-actions button {
    flex: 1;
  }
}
</style>
