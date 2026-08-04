<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { weatherData } from '../data/weather'

const router = useRouter()
const weatherList = ref(weatherData)
const searchQuery = ref('')
const selectedCityInfo = ref(null)

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

watch(selectedCityInfo, (newCityInfo, oldCityInfo) => {
  if (!newCityInfo) return

  const oldCityName = oldCityInfo?.name ?? '선택 없음'
  const statusMessage = `${newCityInfo.name}${getSubjectParticle(newCityInfo.name)} 선택되었습니다.`

  console.log(
    `👁️ [watch 감지] 선택 도시가 [${oldCityName}]에서 [${newCityInfo.name}]로 변경됨.`,
  )
  console.log(
    `🟢 [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${statusMessage}"`,
  )
})

watchEffect(() => {
  const query = trimmedSearchQuery.value
  const matchedCities = filteredWeatherList.value.map((city) => city.name)

  if (!query) {
    console.log(
      `🔎 [watchEffect 자동 호출] 검색어가 비어 있어 전체 ${matchedCities.length}개 도시를 표시합니다.`,
    )
    return
  }

  if (matchedCities.length > 0) {
    console.log(
      `🔎 [watchEffect 자동 호출] 현재 검색어 '${query}'에 매칭되는 API 데이터: ${matchedCities.join(', ')}`,
    )
    return
  }

  console.log(
    `🔎 [watchEffect 자동 호출] 현재 검색어 '${query}'에 매칭되는 도시가 없습니다.`,
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
      <div class="weather-list">
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          :selected="selectedCityInfo?.id === city.id"
          @select-card="selectCity"
          @click-detail="openDetail"
        />

        <p
          v-if="filteredWeatherList.length === 0"
          class="empty-result"
          role="status"
        >
          “{{ trimmedSearchQuery }}”에 해당하는 도시가 없습니다.
        </p>
      </div>
    </BaseDashboardCard>

    <p class="selection-status" aria-live="polite">
      <span class="selection-status__icon" aria-hidden="true">
        {{ selectedCityInfo ? '✓' : '✦' }}
      </span>
      <template v-if="selectedCityInfo">
        <span>
          <strong>{{ selectedCityInfo.name }}</strong>{{ selectedCityParticle }} 선택되었습니다.
        </span>
      </template>
      <template v-else>카드를 클릭하거나 검색해 보세요.</template>
    </p>
  </section>
</template>

<style scoped>
.weather-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
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
  .weather-list {
    grid-template-columns: 1fr;
  }
}
</style>

