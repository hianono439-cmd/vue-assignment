import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'weather-home',
    component: () => import('../views/WeatherHomeView.vue'),
  },
  {
    path: '/about',
    name: 'weather-about',
    component: () => import('../views/WeatherAboutView.vue'),
  },
  {
    path: '/world',
    name: 'world-weather',
    component: () => import('../views/WorldWeatherView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignUpView.vue'),
  },
  {
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/game',
    name: 'weather-game',
    component: () => import('../views/WeatherGameView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
