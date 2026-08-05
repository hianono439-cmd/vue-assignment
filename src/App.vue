<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { motion, MotionConfig, useScroll, useTransform } from 'motion-v'
import UnitToggler from './components/exercise/UnitToggler.vue'
import WeatherAssistant from './components/exercise/WeatherAssistant.vue'

const { scrollYProgress } = useScroll()
const upperOrbY = useTransform(scrollYProgress, [0, 1], [0, 170])
const lowerOrbY = useTransform(scrollYProgress, [0, 1], [0, -130])
</script>

<template>
  <MotionConfig reduced-motion="user">
    <motion.div
      class="scroll-progress"
      :style="{ scaleX: scrollYProgress }"
      aria-hidden="true"
    />

    <main class="page-shell">
      <motion.div
        class="sky-orb sky-orb--one"
        :style="{ y: upperOrbY }"
        aria-hidden="true"
      />
      <motion.div
        class="sky-orb sky-orb--two"
        :style="{ y: lowerOrbY }"
        aria-hidden="true"
      />

      <section class="weather-app" aria-labelledby="page-title">
        <motion.header
          class="app-header"
          :initial="{ opacity: 0, y: -18 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }"
        >
          <div class="title-group">
            <motion.span
              class="title-icon"
              :while-hover="{ rotate: 8, scale: 1.08 }"
              :while-press="{ scale: 0.94 }"
              :transition="{ type: 'spring', stiffness: 340, damping: 18 }"
              aria-hidden="true"
            >🌤️</motion.span>
            <div>
              <h1 id="page-title">날씨 대시보드</h1>
              <p class="subtitle">국내외 주요 도시의 현재 날씨를 확인해 보세요.</p>
            </div>
          </div>

          <nav class="navigation" aria-label="주요 메뉴">
            <div class="navigation-links">
              <RouterLink to="/">
                <span aria-hidden="true">⌂</span>
                국내 날씨
              </RouterLink>
              <RouterLink to="/world">
                <span aria-hidden="true">🌍</span>
                세계 날씨
              </RouterLink>
              <RouterLink to="/game">
                <span aria-hidden="true">🎮</span>
                날씨 게임
              </RouterLink>
              <RouterLink to="/outings">
                <span aria-hidden="true">🚗</span>
                나들이 추천
              </RouterLink>
              <RouterLink to="/about">
                <span aria-hidden="true">ⓘ</span>
                서비스 소개
              </RouterLink>
              <RouterLink to="/signup">
                <span aria-hidden="true">♙</span>
                회원가입
              </RouterLink>
            </div>

            <UnitToggler />
          </nav>
        </motion.header>

        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.fullPath" />
          </Transition>
        </RouterView>
      </section>
    </main>

    <WeatherAssistant />
  </MotionConfig>
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

.scroll-progress {
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(90deg, #3da8e7, #45c6a1, #ffd777);
  box-shadow: 0 2px 10px rgb(61 168 231 / 32%);
  transform-origin: 0 50%;
  pointer-events: none;
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
  flex-wrap: wrap;
  gap: 8px;
}

.navigation-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 40px;
  padding: 8px 10px;
  border-radius: 10px;
  color: #6c8297;
  font-size: 0.72rem;
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
    display: grid;
    width: 100%;
    gap: 3px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .navigation-links a {
    flex: 1;
    padding-inline: 8px;
    font-size: 0.7rem;
  }
}
</style>
