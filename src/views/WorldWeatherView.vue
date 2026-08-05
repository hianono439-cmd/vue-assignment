<script setup>
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { useConfigStore } from '../stores/configStore'
import { useWorldWeatherStore } from '../stores/worldWeatherStore'
import { worldContinentOptions } from '../data/worldCities'
import { getWeatherEmoji } from '../utils/weatherPresentation'

const worldWeatherStore = useWorldWeatherStore()
const configStore = useConfigStore()
const selectedContinent = ref('전체')

const weatherList = computed(() => worldWeatherStore.weatherList)
const filteredWeatherList = computed(() => {
  if (selectedContinent.value === '전체') return weatherList.value
  return weatherList.value.filter(
    (city) => city.continent === selectedContinent.value,
  )
})

const hottestCity = computed(() => {
  if (!filteredWeatherList.value.length) return null
  return filteredWeatherList.value.reduce((current, city) =>
    city.temp > current.temp ? city : current,
  )
})

const coldestCity = computed(() => {
  if (!filteredWeatherList.value.length) return null
  return filteredWeatherList.value.reduce((current, city) =>
    city.temp < current.temp ? city : current,
  )
})

const averageTemperature = computed(() => {
  if (!filteredWeatherList.value.length) return null
  const total = filteredWeatherList.value.reduce(
    (sum, city) => sum + city.temp,
    0,
  )
  return Math.round((total / filteredWeatherList.value.length) * 10) / 10
})

const rainyCityCount = computed(
  () =>
    filteredWeatherList.value.filter(
      (city) =>
        city.status.includes('비') ||
        city.status.includes('눈') ||
        Number(city.rainLastHour) > 0,
    ).length,
)

const formattedLastUpdated = computed(() => {
  if (!worldWeatherStore.lastUpdated) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(worldWeatherStore.lastUpdated))
})

const formatTemperature = (temperature) => {
  if (!Number.isFinite(Number(temperature))) return '—'
  if (configStore.unit === 'fahrenheit') {
    return `${Math.round((temperature * 9) / 5 + 32)}°F`
  }
  return `${temperature}°C`
}

const formatLocalTime = (timezoneOffset) => {
  const localTime = new Date(Date.now() + timezoneOffset * 1000)

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC',
  }).format(localTime)
}

const getHumidityStatus = (humidity) => {
  if (humidity >= 70) return '습함'
  if (humidity <= 35) return '건조'
  return '보통'
}

const loadWorldWeather = (force = false) =>
  worldWeatherStore.loadAll({ force })

onMounted(() => loadWorldWeather())
</script>

<template>
  <section class="world-view" aria-labelledby="world-heading">
    <motion.div
      class="world-heading"
      :initial="{ opacity: 0, y: 18 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }"
    >
      <div>
        <p>세계 주요 도시 현재 날씨</p>
        <h2 id="world-heading">세계 주요 도시 날씨</h2>
        <span>6개 대륙 12개 도시의 현재 날씨를 비교할 수 있습니다.</span>
      </div>
      <el-button
        type="primary"
        plain
        :loading="worldWeatherStore.isLoading"
        @click="loadWorldWeather(true)"
      >
        새로고침
      </el-button>
    </motion.div>

    <el-card class="filter-card" shadow="never">
      <div class="filter-content">
        <div>
          <strong>대륙 선택</strong>
          <small v-if="formattedLastUpdated">마지막 갱신 {{ formattedLastUpdated }}</small>
        </div>
        <el-radio-group v-model="selectedContinent" size="small">
          <el-radio-button
            v-for="continent in worldContinentOptions"
            :key="continent"
            :value="continent"
          >
            {{ continent }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </el-card>

    <el-alert
      v-if="worldWeatherStore.errorMessage"
      class="world-alert"
      type="warning"
      show-icon
      :closable="false"
      :title="worldWeatherStore.errorMessage"
    />

    <div
      v-if="weatherList.length"
      v-loading="worldWeatherStore.isLoading"
      element-loading-text="세계 날씨를 갱신하고 있습니다."
      class="world-content"
    >
      <div v-if="filteredWeatherList.length" class="summary-grid">
        <el-card shadow="never">
          <small>가장 더운 도시</small>
          <strong>{{ hottestCity?.name }}</strong>
          <span>{{ formatTemperature(hottestCity?.temp) }}</span>
        </el-card>
        <el-card shadow="never">
          <small>가장 선선한 도시</small>
          <strong>{{ coldestCity?.name }}</strong>
          <span>{{ formatTemperature(coldestCity?.temp) }}</span>
        </el-card>
        <el-card shadow="never">
          <small>평균 기온</small>
          <strong>{{ formatTemperature(averageTemperature) }}</strong>
          <span>{{ selectedContinent }} 기준</span>
        </el-card>
        <el-card shadow="never">
          <small>비 또는 눈</small>
          <strong>{{ rainyCityCount }}곳</strong>
          <span>{{ filteredWeatherList.length }}개 도시 중</span>
        </el-card>
      </div>

      <el-row v-if="filteredWeatherList.length" :gutter="12" class="city-grid">
        <el-col
          v-for="(city, index) in filteredWeatherList"
          :key="city.id"
          :xs="24"
          :sm="12"
          :lg="8"
        >
          <motion.div
            :initial="{ opacity: 0, y: 16 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.35, delay: Math.min(index * 0.04, 0.25) }"
            :while-hover="{ y: -3 }"
          >
            <el-card class="world-city-card" shadow="hover">
              <template #header>
                <div class="city-card-heading">
                  <div>
                    <strong>{{ city.name }}</strong>
                    <small>{{ city.country }} · {{ city.continent }}</small>
                  </div>
                  <el-tag type="info" effect="plain" size="small">
                    현지 {{ formatLocalTime(city.timezone) }}
                  </el-tag>
                </div>
              </template>

              <div class="city-weather-main">
                <span aria-hidden="true">{{ getWeatherEmoji(city.status) }}</span>
                <div>
                  <strong>{{ formatTemperature(city.temp) }}</strong>
                  <p>{{ city.status }} · 체감 {{ formatTemperature(city.feelsLike) }}</p>
                </div>
              </div>

              <div class="weather-measures">
                <div>
                  <span>습도 {{ city.humidity }}%</span>
                  <el-tag
                    :type="city.humidity >= 70 ? 'warning' : 'success'"
                    size="small"
                    effect="light"
                  >
                    {{ getHumidityStatus(city.humidity) }}
                  </el-tag>
                </div>
                <el-progress
                  :percentage="city.humidity"
                  :stroke-width="6"
                  :show-text="false"
                  color="#49a9d8"
                />
                <p>
                  <span>풍속 {{ city.windSpeed }}m/s</span>
                  <span>가시거리 {{ city.visibilityKm }}km</span>
                </p>
              </div>
            </el-card>
          </motion.div>
        </el-col>
      </el-row>

      <el-empty
        v-else
        description="선택한 대륙의 날씨 정보가 없습니다."
      />
    </div>

    <el-card v-else-if="worldWeatherStore.isLoading" class="world-loading" shadow="never">
      <el-skeleton :rows="8" animated />
    </el-card>

    <el-card v-else class="world-loading" shadow="never">
      <el-empty description="세계 날씨 정보를 표시할 수 없습니다.">
        <el-button type="primary" @click="loadWorldWeather(true)">다시 시도</el-button>
      </el-empty>
    </el-card>
  </section>
</template>

<style scoped>
.world-view {
  padding-top: 24px;
}

.world-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px;
  border-radius: 19px;
  color: #ffffff;
  background:
    radial-gradient(circle at 88% 8%, rgb(118 222 203 / 30%), transparent 34%),
    linear-gradient(135deg, #2a536f, #2c8290);
  box-shadow: 0 14px 30px rgb(40 95 118 / 17%);
}

.world-heading p {
  margin: 0 0 4px;
  color: #a7dfdb;
  font-size: 0.6rem;
  font-weight: 850;
}

.world-heading h2 {
  margin: 0;
  font-size: 1.35rem;
  letter-spacing: -0.035em;
}

.world-heading span {
  display: block;
  margin-top: 6px;
  color: #c5dee3;
  font-size: 0.72rem;
}

.world-heading :deep(.el-button) {
  border-color: rgb(255 255 255 / 35%);
  color: #ffffff;
  background: rgb(255 255 255 / 10%);
}

.filter-card,
.world-alert,
.world-loading {
  margin-top: 14px;
}

.filter-card :deep(.el-card__body) {
  padding: 14px 16px;
}

.filter-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.filter-content > div:first-child {
  display: grid;
  flex: 0 0 auto;
  gap: 3px;
}

.filter-content strong {
  color: #3b5d75;
  font-size: 0.76rem;
}

.filter-content small {
  color: #8ba0b0;
  font-size: 0.58rem;
}

.filter-content :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.world-content {
  min-height: 340px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 9px;
  margin-top: 12px;
}

.summary-grid :deep(.el-card__body) {
  display: grid;
  min-height: 108px;
  align-content: center;
  padding: 14px;
}

.summary-grid small {
  color: #8499aa;
  font-size: 0.6rem;
}

.summary-grid strong {
  margin-top: 4px;
  color: #2f556f;
  font-size: 1rem;
}

.summary-grid span {
  margin-top: 2px;
  color: #5596b5;
  font-size: 0.67rem;
  font-weight: 750;
}

.city-grid {
  margin-top: 3px;
}

.city-grid :deep(.el-col) {
  margin-top: 12px;
}

.world-city-card {
  height: 100%;
  border-color: #dce9f2;
}

.world-city-card :deep(.el-card__header) {
  padding: 12px 14px;
  border-bottom-color: #e6eef4;
}

.world-city-card :deep(.el-card__body) {
  padding: 14px;
}

.city-card-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.city-card-heading > div {
  display: grid;
  min-width: 0;
  gap: 2px;
}

.city-card-heading strong {
  color: #31536d;
  font-size: 0.84rem;
}

.city-card-heading small {
  overflow: hidden;
  color: #899baa;
  font-size: 0.57rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.city-weather-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.city-weather-main > span {
  display: grid;
  width: 49px;
  height: 49px;
  place-items: center;
  border: 1px solid #e1ebf2;
  border-radius: 14px;
  background: linear-gradient(145deg, #edf8fe, #fffbea);
  font-size: 1.55rem;
}

.city-weather-main strong {
  color: #2d536d;
  font-size: 1.17rem;
}

.city-weather-main p {
  margin: 3px 0 0;
  color: #74899a;
  font-size: 0.63rem;
}

.weather-measures {
  margin-top: 14px;
}

.weather-measures > div:first-child,
.weather-measures > p {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.weather-measures > div:first-child {
  margin-bottom: 7px;
  color: #57758a;
  font-size: 0.63rem;
  font-weight: 750;
}

.weather-measures > p {
  margin: 9px 0 0;
  color: #8294a3;
  font-size: 0.59rem;
}

@media (max-width: 760px) {
  .filter-content {
    align-items: flex-start;
    flex-direction: column;
  }

  .filter-content :deep(.el-radio-group) {
    justify-content: flex-start;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .world-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .world-heading :deep(.el-button) {
    width: 100%;
  }

  .filter-content :deep(.el-radio-button__inner) {
    padding-inline: 9px;
  }
}
</style>
