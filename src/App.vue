<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
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
            <p class="subtitle">전국 주요 도시의 날씨를 한눈에 확인해 보세요.</p>
          </div>
        </div>

        <nav class="navigation" aria-label="주요 메뉴">
          <div class="navigation-links">
            <RouterLink to="/">
              <span aria-hidden="true">⌂</span>
              날씨 대시보드
            </RouterLink>
            <RouterLink to="/about">
              <span aria-hidden="true">ⓘ</span>
              서비스 소개
            </RouterLink>
            <RouterLink to="/lab">
              <span aria-hidden="true">⚗</span>
              API·JWT 실습
            </RouterLink>
          </div>

          <UnitToggler />
        </nav>
      </header>

      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
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
  padding: 0 2px 22px;
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

.navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 22px;
  padding: 7px;
  border: 1px solid #e0ebf4;
  border-radius: 15px;
  background: #f5faff;
}

.navigation-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.navigation-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 8px 14px;
  border-radius: 10px;
  color: #6c8297;
  font-size: 0.82rem;
  font-weight: 750;
  text-decoration: none;
  transition:
    color 150ms ease,
    background 150ms ease,
    box-shadow 150ms ease;
}

.navigation-links a:hover,
.navigation-links a:focus-visible {
  color: #267cac;
  background: #e9f6ff;
  outline: none;
}

.navigation-links .router-link-exact-active {
  color: #ffffff;
  background: linear-gradient(135deg, #43a9e4, #348fd0);
  box-shadow: 0 7px 16px rgb(52 143 208 / 22%);
}

.page-enter-active,
.page-leave-active {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(5px);
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

  .navigation {
    align-items: stretch;
    flex-direction: column;
  }

  .navigation-links {
    width: 100%;
  }

  .navigation-links a {
    flex: 1;
    padding-inline: 8px;
  }
}
</style>
