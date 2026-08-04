import 'dotenv/config'
import http from 'node:http'
import { getWeatherNoteCount } from './mock-api/data/weatherNoteStore.js'
import { handleAuthRoutes } from './mock-api/routes/authRoutes.js'
import { handleWeatherNoteRoutes } from './mock-api/routes/weatherNoteRoutes.js'
import {
  sendError,
  sendJson,
  waitForRequestedDelay,
} from './mock-api/utils/httpUtils.js'

const port = Number(process.env.API_PORT ?? 3001)

const server = http.createServer(async (request, response) => {
  if (request.method === 'OPTIONS') {
    sendJson(response, 204)
    return
  }

  const host = request.headers.host ?? `localhost:${port}`
  const url = new URL(request.url ?? '/', `http://${host}`)

  try {
    await waitForRequestedDelay(url)

    if (request.method === 'GET' && url.pathname === '/api/health') {
      sendJson(response, 200, {
        status: 'ok',
        service: '날씨 대시보드 JWT·CRUD Mock API',
        weatherNoteCount: getWeatherNoteCount(),
      })
      return
    }

    if (await handleAuthRoutes(request, response, url)) return
    if (await handleWeatherNoteRoutes(request, response, url)) return

    sendJson(response, 404, {
      message: '존재하지 않는 API 경로입니다.',
    })
  } catch (error) {
    sendError(response, error)
  }
})

server.listen(port, () => {
  console.log(`Mock API: http://localhost:${port}/api`)
  console.log('수강생 계정: student@skala.com / 1234')
})

export { server }
