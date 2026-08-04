import { mockHttp } from './mockHttp'

export const weatherNoteApi = {
  async getAll(params = {}) {
    const response = await mockHttp.get('/weather-notes', { params })
    return response.data
  },

  async create(note) {
    const response = await mockHttp.post('/weather-notes', note)
    return response.data
  },

  async update(noteId, patch) {
    const response = await mockHttp.patch(`/weather-notes/${noteId}`, patch)
    return response.data
  },

  async remove(noteId) {
    const response = await mockHttp.delete(`/weather-notes/${noteId}`)
    return response.data
  },
}
