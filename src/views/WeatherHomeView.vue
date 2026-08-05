<script setup>
import { computed, onMounted, ref, watch, watchEffect } from 'vue'
import { motion } from 'motion-v'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useWeatherStore } from '../stores/weatherStore'

const router = useRouter()
const weatherStore = useWeatherStore()
const searchQuery = ref('')
const selectedCityInfo = ref(null)

const weatherList = computed(() => weatherStore.weatherList)
const isInitialLoading = computed(
  () => weatherStore.isLoadingAll && weatherList.value.length === 0,
)
const loadError = computed(() => weatherStore.errorMessage)
const formattedLastUpdated = computed(() => {
  if (!weatherStore.lastUpdated) return ''

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(weatherStore.lastUpdated))
})

const getSubjectParticle = (word) => {
  const normalizedWord = word?.trim()
  if (!normalizedWord) return ''

  const lastCharacterCode = normalizedWord.charCodeAt(normalizedWord.length - 1)
  const isHangulSyllable =
    lastCharacterCode >= 0xac00 && lastCharacterCode <= 0xd7a3

  if (!isHangulSyllable) return '이(가)'

  const hasFinalConsonant = (lastCharacterCode - 0xac00) % 28 !== 0
  return hasFinalConsonant ? '이' : '가'
}

const trimmedSearchQuery = computed(() => searchQuery.value.trim())
const filteredWeatherList = computed(() => {
  if (!trimmedSearchQuery.value) {
    return weatherList.value
  }

  return weatherList.value.filter((city) =>
    city.name.includes(trimmedSearchQuery.value),
  )
})

const selectedCityParticle = computed(() =>
  getSubjectParticle(selectedCityInfo.value?.name),
)

const loadWeather = async (force = false) => {
  await weatherStore.loadAll({ force })

  if (selectedCityInfo.value) {
    selectedCityInfo.value =
      weatherStore.getWeatherById(selectedCityInfo.value.id) ?? null
  }
}

onMounted(() => {
  loadWeather()
})

watch(selectedCityInfo, (newCityInfo, oldCityInfo) => {
  if (!newCityInfo) return

  const oldCityName = oldCityInfo?.name ?? '선택 없음'
  const statusMessage = `${newCityInfo.name}${getSubjectParticle(newCityInfo.name)} 선택되었습니다.`

  console.log(
    `[watch] 선택 도시: ${oldCityName} → ${newCityInfo.name}`,
  )
  console.log(
    `[watch] 안내 문구: ${statusMessage}`,
  )
})

watchEffect(() => {
  const query = trimmedSearchQuery.value
  const matchedCities = filteredWeatherList.value.map((city) => city.name)

  if (!query) {
    console.log(
      `[watchEffect] 전체 ${matchedCities.length}개 도시 표시`,
    )
    return
  }

  if (matchedCities.length > 0) {
    console.log(
      `[watchEffect] '${query}' 검색 결과: ${matchedCities.join(', ')}`,
    )
    return
  }

  console.log(
    `[watchEffect] '${query}' 검색 결과 없음`,
  )
})

const updateQuery = (query) => {
  searchQuery.value = query
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

const openDetail = (city) => {
  router.push({ name: 'weather-detail', params: { cityId: city.id } })
}
</script>

<template>
  <section class="home-view" aria-labelledby="home-heading">
    <h2 id="home-heading" class="sr-only">지역별 날씨 대시보드</h2>

    <BaseDashboardCard
      title="도시 검색"
      icon="🔍"
      heading-id="search-heading"
    >
      <SearchBar :query="searchQuery" @update-query="updateQuery" />
    </BaseDashboardCard>

    <BaseDashboardCard
      title="지역별 날씨 현황"
      icon="🏙️"
      heading-id="weather-heading"
    >
      <div class="data-source-bar" aria-live="polite">
        <div class="data-source-copy">
          <motion.span
            class="live-indicator"
            :animate="{ scale: [1, 1.42, 1], opacity: [1, 0.7, 1] }"
            :transition="{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }"
            aria-hidden="true"
          />
          <div>
            <strong>
              {{ weatherStore.isLoadingAll ? '실시간 날씨를 갱신하는 중' : 'OpenWeather 실시간 데이터' }}
            </strong>
            <small v-if="formattedLastUpdated">
              마지막 갱신 {{ formattedLastUpdated }}
            </small>
            <small v-else>전국 8개 도시의 현재 관측 정보</small>
          </div>
        </div>

        <button
          type="button"
          class="refresh-button"
          :disabled="weatherStore.isLoadingAll"
          @click="loadWeather(true)"
        >
          <motion.span
            :animate="weatherStore.isLoadingAll ? { rotate: 360 } : { rotate: 0 }"
            :transition="weatherStore.isLoadingAll
              ? { duration: 0.85, repeat: Infinity, ease: 'linear' }
              : { duration: 0.2 }"
            aria-hidden="true"
          >↻</motion.span>
          {{ weatherStore.isLoadingAll ? '갱신 중' : '새로고침' }}
        </button>
      </div>

      <p v-if="loadError" class="api-warning" role="alert">
        <span aria-hidden="true">!</span>
        {{ loadError }}
      </p>

      <div v-if="isInitialLoading" class="loading-grid" aria-busy="true">
        <div
          v-for="index in 4"
          :key="index"
          class="weather-skeleton"
          :class="{ 'weather-skeleton--featured': index === 1 }"
        >
          <span></span>
          <div>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
      </div>

      <div class="weather-list">
        <WeatherCard
          v-for="(city, index) in filteredWeatherList"
          :key="city.id"
          :city="city"
          :selected="selectedCityInfo?.id === city.id"
          :reveal-delay="Math.min(index * 0.055, 0.28)"
          :featured="!trimmedSearchQuery && (index === 0 || index === 5)"
          @select-card="selectCity"
          @click-detail="openDetail"
        />

        <div
          v-if="!isInitialLoading && weatherList.length === 0"
          class="api-empty"
          role="status"
        >
          <span aria-hidden="true">🌦️</span>
          <strong>실시간 날씨를 표시할 수 없습니다.</strong>
          <p>API 설정과 네트워크 연결을 확인한 후 다시 시도해 주세요.</p>
          <button type="button" @click="loadWeather(true)">다시 시도</button>
        </div>

        <p
          v-else-if="!isInitialLoading && filteredWeatherList.length === 0"
          class="empty-result"
          role="status"
        >
          “{{ trimmedSearchQuery }}”에 해당하는 도시가 없습니다.
        </p>
      </div>
    </BaseDashboardCard>

    <motion.p
      :key="selectedCityInfo?.id ?? 'empty'"
      class="selection-status"
      :initial="{ opacity: 0, y: 8, scale: 0.99 }"
      :animate="{ opacity: 1, y: 0, scale: 1 }"
      :transition="{ type: 'spring', stiffness: 330, damping: 25 }"
      aria-live="polite"
    >
      <span class="selection-status__icon" aria-hidden="true">
        {{ selectedCityInfo ? '✓' : '✦' }}
      </span>
      <template v-if="selectedCityInfo">
        <span>
          <strong>{{ selectedCityInfo.name }}</strong>{{ selectedCityParticle }} 선택되었습니다.
        </span>
      </template>
      <template v-else-if="isInitialLoading">실시간 날씨를 불러오고 있습니다.</template>
      <template v-else>카드를 클릭하거나 검색해 보세요.</template>
    </motion.p>
  </section>
</template>

<style scoped>
.data-source-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
  padding: 12px 14px;
  border: 1px solid #dceaf3;
  border-radius: 14px;
  background: rgb(255 255 255 / 82%);
}

.data-source-copy {
  display: flex;
  align-items: center;
  gap: 10px;
}

.data-source-copy div {
  display: grid;
  gap: 2px;
}

.data-source-copy strong {
  color: #31536d;
  font-size: 0.78rem;
}

.data-source-copy small {
  color: #8699aa;
  font-size: 0.65rem;
}

.live-indicator {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #36bd80;
  box-shadow: 0 0 0 5px rgb(54 189 128 / 13%);
}

.refresh-button,
.api-empty button {
  display: inline-flex;
  flex: none;
  min-height: 35px;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 11px;
  border: 1px solid #c8dce9;
  border-radius: 10px;
  color: #397392;
  background: #f6fbfe;
  font-size: 0.7rem;
  font-weight: 800;
}

.refresh-button:hover,
.refresh-button:focus-visible,
.api-empty button:hover,
.api-empty button:focus-visible {
  border-color: #4aa8dd;
  color: #176d9f;
  background: #eaf7ff;
  outline: none;
}

.refresh-button:disabled {
  cursor: wait;
  opacity: 0.58;
}

.api-warning {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 13px;
  padding: 10px 12px;
  border: 1px solid #f4d7b3;
  border-radius: 12px;
  color: #9a612d;
  background: #fff8ed;
  font-size: 0.72rem;
  font-weight: 700;
}

.api-warning span {
  display: grid;
  width: 19px;
  height: 19px;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: #e8a351;
  font-size: 0.66rem;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.weather-skeleton {
  display: flex;
  align-items: center;
  gap: 15px;
  min-height: 172px;
  padding: 20px;
  border: 1px solid #e0ebf3;
  border-radius: 17px;
  background: rgb(255 255 255 / 82%);
}

.weather-skeleton--featured {
  grid-column: span 2;
  min-height: 210px;
}

.weather-skeleton > span {
  width: 52px;
  height: 52px;
  border-radius: 16px;
}

.weather-skeleton div {
  display: grid;
  flex: 1;
  gap: 9px;
}

.weather-skeleton i,
.weather-skeleton > span {
  display: block;
  background: linear-gradient(90deg, #edf3f7, #f8fbfd, #edf3f7);
  background-size: 200% 100%;
  animation: loading 1.3s ease-in-out infinite;
}

.weather-skeleton i {
  width: 78%;
  height: 10px;
  border-radius: 999px;
}

.weather-skeleton i:nth-child(2) {
  width: 55%;
  height: 15px;
}

.weather-skeleton i:nth-child(3) {
  width: 64%;
}

@keyframes loading {
  to {
    background-position: -200% 0;
  }
}

.weather-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-flow: dense;
  gap: 12px;
}

.api-empty {
  grid-column: 1 / -1;
  display: grid;
  justify-items: center;
  padding: 36px 18px;
  border: 1px dashed #b9d2e5;
  border-radius: 16px;
  color: #6d7b8d;
  background: rgb(255 255 255 / 82%);
  text-align: center;
}

.api-empty > span {
  margin-bottom: 8px;
  font-size: 2rem;
}

.api-empty strong {
  color: #3e5c73;
  font-size: 0.9rem;
}

.api-empty p {
  margin: 7px 0 14px;
  font-size: 0.75rem;
}

.empty-result {
  grid-column: 1 / -1;
  margin: 0;
  padding: 34px 16px;
  border: 1px dashed #b9d2e5;
  border-radius: 16px;
  color: #6d7b8d;
  background: rgb(255 255 255 / 82%);
  text-align: center;
}

.selection-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  margin: 18px 0 0;
  padding: 14px 16px;
  border: 1px solid #c9ebdb;
  border-radius: 14px;
  color: #23825b;
  background: linear-gradient(135deg, #ebfaf3, #e7f8ef);
  font-size: 0.9rem;
  font-weight: 700;
  text-align: center;
}

.selection-status__icon {
  display: grid;
  flex: 0 0 auto;
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: #3dbb82;
  font-size: 0.72rem;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 720px) {
  .weather-list,
  .loading-grid {
    grid-template-columns: 1fr;
  }

  .weather-skeleton--featured {
    grid-column: auto;
  }
}

@media (max-width: 480px) {
  .data-source-bar {
    align-items: stretch;
    flex-direction: column;
  }

  .refresh-button {
    width: 100%;
  }
}
</style>
