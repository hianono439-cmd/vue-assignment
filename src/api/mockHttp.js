import axios from 'axios'

export const accessTokenKey = 'weather-lab-access-token'

export const mockHttp = axios.create({
  baseURL:
    import.meta.env.VITE_MOCK_API_BASE_URL ||
    'http://localhost:3001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Lab-Client': 'weather-dashboard-practice',
  },
})

mockHttp.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem(accessTokenKey)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

mockHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      (error.code === 'ECONNABORTED'
        ? 'Mock API 응답 시간이 초과되었습니다.'
        : '로컬 Mock API에 연결할 수 없습니다. npm run dev:all을 실행해 주세요.')

    const normalizedError = new Error(message)
    normalizedError.status = error.response?.status
    return Promise.reject(normalizedError)
  },
)
