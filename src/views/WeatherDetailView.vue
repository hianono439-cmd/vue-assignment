<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import { findWeatherCity } from '../data/weather'

const route = useRoute()
const router = useRouter()

const city = computed(() => findWeatherCity(String(route.params.cityId)))

const weatherIcon = computed(() => {
  const iconMap = {
    맑음: '☀️',
    비: '🌧️',
    구름: '☁️',
    흐림: '🌥️',
  }

  return iconMap[city.value?.status] ?? '🌤️'
})

const goHome = () => {
  router.push({ name: 'weather-home' })
}
</script>

<template>
  <section class="detail-view" aria-labelledby="detail-heading">
    <template v-if="city">
      <div class="view-heading">
        <span class="view-heading__icon" aria-hidden="true">{{ weatherIcon }}</span>
        <div>
          <p>WEATHER OBSERVATION</p>
          <h2 id="detail-heading">{{ city.name }} 상세 날씨</h2>
        </div>
      </div>

      <BaseDashboardCard
        title="지역별 상세 기상 관측 정보"
        icon="📊"
        heading-id="observation-heading"
      >
        <div class="weather-hero">
          <div>
            <span class="location-label">📍 {{ city.region }}</span>
            <p class="temperature">{{ city.temp }}<small>°C</small></p>
            <p class="condition">{{ city.status }} · 체감 {{ city.feelsLike }}°C</p>
          </div>
          <span class="weather-hero__icon" aria-hidden="true">{{ weatherIcon }}</span>
        </div>

        <dl class="detail-grid">
          <div>
            <dt>🌡️ 체감 온도</dt>
            <dd>{{ city.feelsLike }}°C</dd>
          </div>
          <div>
            <dt>💧 습도</dt>
            <dd>{{ city.humidity }}%</dd>
          </div>
          <div>
            <dt>🍃 풍속</dt>
            <dd>{{ city.windSpeed }}m/s</dd>
          </div>
          <div>
            <dt>☂️ 강수 확률</dt>
            <dd>{{ city.precipitation }}%</dd>
          </div>
          <div>
            <dt>🌿 대기질</dt>
            <dd>{{ city.airQuality }}</dd>
          </div>
        </dl>

        <p class="mock-notice">
          실습용 Mock Data를 사용한 기상 관측 정보입니다.
        </p>
      </BaseDashboardCard>
    </template>

    <div v-else class="unknown-city" role="alert">
      <span aria-hidden="true">🧭</span>
      <p>UNKNOWN CITY</p>
      <h2 id="detail-heading">도시 정보를 찾을 수 없습니다.</h2>
      <p>요청한 도시 코드와 일치하는 날씨 데이터가 없습니다.</p>
    </div>

    <button type="button" class="back-button" @click="goHome">
      <span aria-hidden="true">←</span> 메인 대시보드로 돌아가기
    </button>
  </section>
</template>

<style scoped>
.detail-view {
  padding-top: 24px;
}

.view-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 3px 0;
}

.view-heading__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 15px;
  background: linear-gradient(145deg, #e8f7ff, #fff8d8);
  box-shadow: 0 8px 20px rgb(52 104 148 / 10%);
  font-size: 1.45rem;
}

.view-heading p,
.unknown-city > p:first-of-type {
  margin: 0 0 3px;
  color: #79a3bd;
  font-size: 0.63rem;
  font-weight: 850;
  letter-spacing: 0.12em;
}

.view-heading h2 {
  margin: 0;
  color: #29445e;
  font-size: 1.25rem;
  letter-spacing: -0.03em;
}

.weather-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 24px;
  border-radius: 18px;
  color: #ffffff;
  background: linear-gradient(135deg, #43a9e4, #5bc5c1);
  box-shadow: 0 15px 32px rgb(55 151 197 / 18%);
}

.location-label {
  font-size: 0.82rem;
  font-weight: 700;
  opacity: 0.92;
}

.temperature {
  margin: 12px 0 0;
  font-size: clamp(2.8rem, 8vw, 4.3rem);
  font-weight: 850;
  line-height: 0.95;
  letter-spacing: -0.07em;
}

.temperature small {
  margin-left: 4px;
  font-size: 1.2rem;
  font-weight: 750;
  letter-spacing: 0;
}

.condition {
  margin: 10px 0 0;
  font-size: 0.88rem;
  font-weight: 700;
  opacity: 0.92;
}

.weather-hero__icon {
  display: grid;
  width: 110px;
  height: 110px;
  place-items: center;
  border: 1px solid rgb(255 255 255 / 38%);
  border-radius: 30px;
  background: rgb(255 255 255 / 18%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 30%);
  font-size: 3.5rem;
  backdrop-filter: blur(8px);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 14px 0 0;
}

.detail-grid div {
  padding: 15px 11px;
  border: 1px solid #dfebf3;
  border-radius: 14px;
  background: rgb(255 255 255 / 88%);
  text-align: center;
}

.detail-grid dt {
  color: #7890a4;
  font-size: 0.7rem;
  font-weight: 700;
}

.detail-grid dd {
  margin: 7px 0 0;
  color: #2c4c67;
  font-size: 1rem;
  font-weight: 850;
}

.mock-notice {
  margin: 13px 0 0;
  color: #8a9bad;
  font-size: 0.7rem;
  text-align: right;
}

.unknown-city {
  margin-top: 24px;
  padding: 56px 20px;
  border: 1px solid #e0ebf4;
  border-radius: 20px;
  background: #f7fbfe;
  text-align: center;
}

.unknown-city > span {
  display: block;
  margin-bottom: 12px;
  font-size: 3rem;
}

.unknown-city h2 {
  margin: 0;
  color: #29445e;
  font-size: 1.25rem;
}

.unknown-city > p:last-child {
  margin: 9px 0 0;
  color: #7a8da0;
  font-size: 0.84rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  margin-top: 16px;
  padding: 9px 15px;
  border: 0;
  border-radius: 11px;
  color: #ffffff;
  background: #294f6d;
  box-shadow: 0 8px 18px rgb(41 79 109 / 17%);
  font-size: 0.78rem;
  font-weight: 750;
}

.back-button:hover,
.back-button:focus-visible {
  background: #1f405a;
  outline: 3px solid rgb(65 169 228 / 23%);
}

@media (max-width: 760px) {
  .detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 520px) {
  .weather-hero {
    padding: 19px;
  }

  .weather-hero__icon {
    width: 76px;
    height: 76px;
    border-radius: 22px;
    font-size: 2.4rem;
  }

  .detail-grid div:last-child {
    grid-column: 1 / -1;
  }
}
</style>
