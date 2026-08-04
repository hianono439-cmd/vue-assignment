const initialNotes = [
  {
    id: 1,
    ownerId: 1,
    cityName: '서울',
    memo: '외출 전 체감온도와 강수 여부 확인하기',
    favorite: true,
    createdAt: '2026-08-04T07:00:00.000Z',
  },
  {
    id: 2,
    ownerId: 1,
    cityName: '제주',
    memo: '주말 여행 전에 풍속 확인하기',
    favorite: false,
    createdAt: '2026-08-04T07:10:00.000Z',
  },
]

let weatherNotes = []
let nextNoteId = 1

export function resetWeatherNotes() {
  weatherNotes = structuredClone(initialNotes)
  nextNoteId = Math.max(...weatherNotes.map((note) => note.id)) + 1
  return weatherNotes
}

export function getWeatherNoteCount() {
  return weatherNotes.length
}

export function listWeatherNotes(ownerId) {
  return weatherNotes.filter((note) => note.ownerId === ownerId)
}

export function findWeatherNote(ownerId, noteId) {
  return weatherNotes.find(
    (note) => note.ownerId === ownerId && note.id === noteId,
  )
}

export function createWeatherNote(ownerId, noteInput) {
  const note = {
    id: nextNoteId++,
    ownerId,
    ...noteInput,
    createdAt: new Date().toISOString(),
  }

  weatherNotes.push(note)
  return note
}

export function updateWeatherNote(ownerId, noteId, patch) {
  const note = findWeatherNote(ownerId, noteId)
  if (!note) return undefined

  Object.assign(note, patch)
  return note
}

export function deleteWeatherNote(ownerId, noteId) {
  const index = weatherNotes.findIndex(
    (note) => note.ownerId === ownerId && note.id === noteId,
  )

  if (index === -1) return undefined

  const [deletedNote] = weatherNotes.splice(index, 1)
  return deletedNote
}

resetWeatherNotes()
