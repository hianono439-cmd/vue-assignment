<script setup>
import { RouterLink } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
</script>

<template>
  <section class="about-view" aria-labelledby="about-heading">
    <div class="view-heading">
      <span aria-hidden="true">ⓘ</span>
      <div>
        <p>서비스 안내</p>
        <h2 id="about-heading">날씨 대시보드 소개</h2>
      </div>
    </div>

    <BaseDashboardCard
      title="주요 기능"
      icon="🌤️"
      heading-id="about-service-heading"
    >
      <p class="intro">
        OpenWeatherMap 관측 정보를 불러와 국내 주요 도시의 현재 날씨와 상세
        정보를 보여줍니다.
      </p>

      <ul class="feature-list">
        <li>
          <span aria-hidden="true">🔎</span>
          <div>
            <strong>도시 검색</strong>
            <p>도시 이름으로 원하는 날씨 카드를 찾을 수 있습니다.</p>
          </div>
        </li>
        <li>
          <span aria-hidden="true">🌐</span>
          <div>
            <strong>현재 날씨</strong>
            <p>각 도시의 기온과 습도, 바람 정보를 표시합니다.</p>
          </div>
        </li>
        <li>
          <span aria-hidden="true">🧭</span>
          <div>
            <strong>페이지 이동</strong>
            <p>날씨 카드에서 도시별 상세 화면으로 이동할 수 있습니다.</p>
          </div>
        </li>
      </ul>
    </BaseDashboardCard>

    <RouterLink class="home-link" to="/">
      <span aria-hidden="true">←</span> 메인 대시보드로 돌아가기
    </RouterLink>
  </section>
</template>

<style scoped>
.about-view {
  padding-top: 24px;
}

.view-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 4px 3px 0;
}

.view-heading > span {
  display: grid;
  width: 45px;
  height: 45px;
  place-items: center;
  border-radius: 14px;
  color: #ffffff;
  background: linear-gradient(135deg, #43a9e4, #57c4bb);
  font-size: 1.25rem;
  font-weight: 850;
  box-shadow: 0 8px 18px rgb(52 143 208 / 18%);
}

.view-heading p {
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

.intro {
  margin: 0;
  color: #60758a;
  font-size: 0.9rem;
  line-height: 1.75;
}

.feature-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 20px 0 0;
  padding: 0;
  list-style: none;
}

.feature-list li {
  padding: 18px;
  border: 1px solid #deebf4;
  border-radius: 16px;
  background: rgb(255 255 255 / 86%);
}

.feature-list li > span {
  display: block;
  margin-bottom: 10px;
  font-size: 1.45rem;
}

.feature-list strong {
  color: #31536d;
  font-size: 0.87rem;
}

.feature-list p {
  margin: 7px 0 0;
  color: #71869a;
  font-size: 0.74rem;
  line-height: 1.6;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  margin-top: 16px;
  padding: 9px 15px;
  border-radius: 11px;
  color: #ffffff;
  background: #294f6d;
  box-shadow: 0 8px 18px rgb(41 79 109 / 17%);
  font-size: 0.78rem;
  font-weight: 750;
  text-decoration: none;
}

.home-link:hover,
.home-link:focus-visible {
  background: #1f405a;
  outline: 3px solid rgb(65 169 228 / 23%);
}

@media (max-width: 720px) {
  .feature-list {
    grid-template-columns: 1fr;
  }
}
</style>
