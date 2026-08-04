<script setup>
import { computed, ref, watch, watchEffect } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 23, status: '흐림' },
  { id: 'city_05', name: '대전', temp: 27, status: '맑음' },
  { id: 'city_06', name: '대구', temp: 30, status: '맑음' },
  { id: 'city_07', name: '광주', temp: 25, status: '구름' },
  { id: 'city_08', name: '제주', temp: 22, status: '비' },
])

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

const showDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}
</script>

<template>
  <main class="page-shell">
    <div class="sky-orb sky-orb--one" aria-hidden="true"></div>
    <div class="sky-orb sky-orb--two" aria-hidden="true"></div>

    <section class="weather-app" aria-labelledby="page-title">
      <header class="app-header">
        <div class="title-group">
          <span class="title-icon" aria-hidden="true">🌤️</span>
          <div>
            <h1 id="page-title">날씨 대시보드</h1>
            <p class="subtitle">
              전국 {{ weatherList.length }}개 도시의 날씨를 검색하고 선택해 보세요.
            </p>
          </div>
        </div>
      </header>

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
            @click-detail="showDetail"
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
  </main>
</template>

<style scoped>
.page-shell {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 48px 20px;
  background:
    linear-gradient(145deg, rgb(239 249 255 / 96%), rgb(223 239 255 / 92%)),
    #e5f2ff;
}

.page-shell::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  background-image:
    linear-gradient(rgb(56 137 212 / 5%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(56 137 212 / 5%) 1px, transparent 1px);
  background-size: 36px 36px;
  content: '';
  mask-image: linear-gradient(to bottom, black, transparent 80%);
}

.sky-orb {
  position: absolute;
  z-index: -1;
  border-radius: 999px;
  filter: blur(4px);
  pointer-events: none;
}

.sky-orb--one {
  top: -160px;
  right: -100px;
  width: 440px;
  height: 440px;
  background: rgb(109 192 255 / 28%);
}

.sky-orb--two {
  bottom: -220px;
  left: -140px;
  width: 520px;
  height: 520px;
  background: rgb(112 221 205 / 22%);
}

.weather-app {
  width: min(100%, 960px);
  padding: 38px;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 28px;
  background: rgb(255 255 255 / 88%);
  box-shadow:
    0 26px 70px rgb(36 91 138 / 17%),
    inset 0 1px 0 rgb(255 255 255 / 90%);
  backdrop-filter: blur(22px);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 0 2px 26px;
  border-bottom: 1px solid #e2edf7;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  display: grid;
  flex: 0 0 auto;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 80%);
  border-radius: 18px;
  background: linear-gradient(145deg, #dff3ff, #fff7cf);
  box-shadow: 0 10px 25px rgb(65 135 190 / 18%);
  font-size: 1.8rem;
}

h1 {
  margin: 0;
  color: #17324d;
  font-size: clamp(1.38rem, 4vw, 1.8rem);
  line-height: 1.25;
  letter-spacing: -0.035em;
}

.subtitle {
  margin: 6px 0 0;
  color: #71849a;
  font-size: 0.82rem;
}

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
  width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: #3dbb82;
  font-size: 0.72rem;
}

@media (max-width: 720px) {
  .weather-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .page-shell {
    padding: 0;
  }

  .weather-app {
    min-height: 100vh;
    padding: 24px 16px;
    border: 0;
    border-radius: 0;
  }

  .title-icon {
    width: 48px;
    height: 48px;
    border-radius: 15px;
    font-size: 1.5rem;
  }

  .title-group {
    gap: 12px;
  }

}
</style>
