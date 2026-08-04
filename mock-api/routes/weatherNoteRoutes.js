import {
  createWeatherNote,
  deleteWeatherNote,
  findWeatherNote,
  listWeatherNotes,
  updateWeatherNote,
} from '../data/weatherNoteStore.js'
import { authenticateRequest } from './authRoutes.js'
import {
  createHttpError,
  readJsonBody,
  sendJson,
} from '../utils/httpUtils.js'

const allowedCities = [
  '서울',
  '수원',
  '부산',
  '인천',
  '대전',
  '대구',
  '광주',
  '제주',
]

function validateNote(input, partial = false) {
  const errors = []

  if (!partial || Object.hasOwn(input, 'cityName')) {
    if (!allowedCities.includes(input.cityName)) {
      errors.push('목록에 있는 도시를 선택해 주세요.')
    }
  }

  if (!partial || Object.hasOwn(input, 'memo')) {
    if (typeof input.memo !== 'string' || !input.memo.trim()) {
      errors.push('날씨 메모를 입력해 주세요.')
    } else if (input.memo.trim().length > 120) {
      errors.push('메모는 120자 이하여야 합니다.')
    }
  }

  if (
    Object.hasOwn(input, 'favorite') &&
    typeof input.favorite !== 'boolean'
  ) {
    errors.push('즐겨찾기 값은 Boolean이어야 합니다.')
  }

  return errors
}

function normalizeNote(input, partial = false) {
  const normalized = {}

  if (Object.hasOwn(input, 'cityName')) {
    normalized.cityName = input.cityName
  }
  if (Object.hasOwn(input, 'memo')) {
    normalized.memo = input.memo.trim()
  }
  if (Object.hasOwn(input, 'favorite')) {
    normalized.favorite = input.favorite
  } else if (!partial) {
    normalized.favorite = false
  }

  return normalized
}

export async function handleWeatherNoteRoutes(request, response, url) {
  const noteMatch = url.pathname.match(/^\/api\/weather-notes\/(\d+)$/)
  const isCollectionPath = url.pathname === '/api/weather-notes'

  if (!isCollectionPath && !noteMatch) return false

  const user = authenticateRequest(request)

  if (request.method === 'GET' && isCollectionPath) {
    const query = (url.searchParams.get('q') ?? '').trim().toLowerCase()
    const notes = listWeatherNotes(user.id).filter(
      (note) =>
        !query ||
        note.cityName.toLowerCase().includes(query) ||
        note.memo.toLowerCase().includes(query),
    )
    sendJson(response, 200, notes)
    return true
  }

  if (request.method === 'POST' && isCollectionPath) {
    const body = await readJsonBody(request)
    const errors = validateNote(body)

    if (errors.length > 0) {
      throw createHttpError(400, errors.join(' '))
    }

    sendJson(
      response,
      201,
      createWeatherNote(user.id, normalizeNote(body)),
    )
    return true
  }

  if (request.method === 'PATCH' && noteMatch) {
    const noteId = Number(noteMatch[1])
    if (!findWeatherNote(user.id, noteId)) {
      throw createHttpError(404, '수정할 날씨 메모를 찾을 수 없습니다.')
    }

    const body = await readJsonBody(request)
    const errors = validateNote(body, true)
    if (errors.length > 0) {
      throw createHttpError(400, errors.join(' '))
    }

    sendJson(
      response,
      200,
      updateWeatherNote(user.id, noteId, normalizeNote(body, true)),
    )
    return true
  }

  if (request.method === 'DELETE' && noteMatch) {
    const deletedNote = deleteWeatherNote(user.id, Number(noteMatch[1]))
    if (!deletedNote) {
      throw createHttpError(404, '삭제할 날씨 메모를 찾을 수 없습니다.')
    }

    sendJson(response, 200, deletedNote)
    return true
  }

  throw createHttpError(405, '지원하지 않는 HTTP 메서드입니다.')
}
