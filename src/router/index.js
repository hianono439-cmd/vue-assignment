import { createRouter, createWebHashHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

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
    path: '/weather/:cityId',
    name: 'weather-detail',
    component: () => import('../views/WeatherDetailView.vue'),
  },
  {
    path: '/login',
    name: 'practice-login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/lab',
    name: 'practice-lab',
    component: () => import('../views/PracticeLabView.vue'),
    meta: { requiresAuth: true },
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

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isLoggedIn) {
      return {
        name: 'practice-login',
        query: { redirect: to.fullPath },
      }
    }

    try {
      await authStore.fetchMyProfile()
    } catch {
      return {
        name: 'practice-login',
        query: { redirect: to.fullPath },
      }
    }
  }

  if (to.name === 'practice-login' && authStore.isLoggedIn) {
    return { name: 'practice-lab' }
  }
})

export default router
