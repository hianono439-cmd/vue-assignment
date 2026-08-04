<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import { weatherNoteApi } from '../api/weatherNoteApi'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()
const {
  user,
  tokenPayload,
  authorizationHeader,
  protectedMessage,
  isLoading,
  errorMessage,
} = storeToRefs(authStore)

const notes = ref([])
const isNotesLoading = ref(false)
const noteError = ref('')
const searchQuery = ref('')
const cities = ['서울', '수원', '부산', '인천', '대전', '대구', '광주', '제주']
const noteForm = reactive({
  cityName: '서울',
  memo: '',
  favorite: false,
})

const formattedPayload = computed(() =>
  tokenPayload.value ? JSON.stringify(tokenPayload.value, null, 2) : '',
)

const maskedAuthorizationHeader = computed(() => {
  const header = authorizationHeader.value
  return header ? `${header.slice(0, 32)}…` : ''
})

const loadNotes = async () => {
  isNotesLoading.value = true
  noteError.value = ''

  try {
    notes.value = await weatherNoteApi.getAll({ q: searchQuery.value })
  } catch (error) {
    noteError.value = error.message
  } finally {
    isNotesLoading.value = false
  }
}

const createNote = async () => {
  noteError.value = ''

  try {
    const createdNote = await weatherNoteApi.create(noteForm)
    notes.value = [createdNote, ...notes.value]
    noteForm.memo = ''
    noteForm.favorite = false
  } catch (error) {
    noteError.value = error.message
  }
}

const toggleFavorite = async (note) => {
  noteError.value = ''

  try {
    const updatedNote = await weatherNoteApi.update(note.id, {
      favorite: !note.favorite,
    })
    const index = notes.value.findIndex((item) => item.id === note.id)
    if (index !== -1) notes.value[index] = updatedNote
  } catch (error) {
    noteError.value = error.message
  }
}

const removeNote = async (noteId) => {
  noteError.value = ''

  try {
    await weatherNoteApi.remove(noteId)
    notes.value = notes.value.filter((note) => note.id !== noteId)
  } catch (error) {
    noteError.value = error.message
  }
}

const verifyProtectedApi = async () => {
  const succeeded = await authStore.fetchProtectedMessage()
  if (!succeeded && !authStore.isLoggedIn) {
    await router.replace('/login')
  }
}

const logout = async () => {
  authStore.logout()
  await router.replace('/login')
}

const formatDate = (dateText) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateText))

onMounted(loadNotes)
</script>

<template>
  <section class="lab-view" aria-labelledby="lab-heading">
    <div class="lab-hero">
      <div>
        <span class="success-badge">JWT 인증 성공</span>
        <h2 id="lab-heading">{{ user?.name }}님의 API 실습실</h2>
        <p>Bearer 인증과 REST CRUD 요청을 날씨 메모로 연습합니다.</p>
      </div>
      <button type="button" @click="logout">로그아웃</button>
    </div>

    <div class="auth-grid">
      <article class="lab-card">
        <div class="card-heading">
          <span class="method method--get">GET</span>
          <div>
            <h3>인증 사용자</h3>
            <code>/api/auth/me</code>
          </div>
        </div>
        <dl class="profile-list">
          <div><dt>이름</dt><dd>{{ user?.name }}</dd></div>
          <div><dt>이메일</dt><dd>{{ user?.email }}</dd></div>
          <div><dt>권한</dt><dd><strong>{{ user?.role }}</strong></dd></div>
          <div><dt>소속</dt><dd>{{ user?.department }}</dd></div>
        </dl>
      </article>

      <article class="lab-card">
        <div class="card-heading">
          <span class="jwt-chip">JWT</span>
          <div>
            <h3>Access Token Payload</h3>
            <code>header.payload.signature</code>
          </div>
        </div>
        <pre>{{ formattedPayload }}</pre>
        <p class="security-note">
          Payload는 암호화된 정보가 아니므로 비밀번호를 넣으면 안 됩니다.
        </p>
      </article>

      <article class="lab-card protected-card">
        <div class="card-heading">
          <span class="method method--get">GET</span>
          <div>
            <h3>보호 API 요청</h3>
            <code>/api/auth/protected-message</code>
          </div>
        </div>
        <p>Axios 요청 인터셉터가 저장된 토큰을 자동으로 첨부합니다.</p>
        <code class="header-preview">{{ maskedAuthorizationHeader }}</code>
        <button
          type="button"
          :disabled="isLoading"
          @click="verifyProtectedApi"
        >
          {{ isLoading ? '요청 중…' : '보호 API 호출하기' }}
        </button>
        <p v-if="errorMessage" class="error-message" role="alert">
          {{ errorMessage }}
        </p>
        <div v-if="protectedMessage" class="protected-result">
          <strong>{{ protectedMessage.message }}</strong>
          <small>요청 권한 {{ protectedMessage.role }}</small>
        </div>
      </article>
    </div>

    <BaseDashboardCard
      title="날씨 메모 REST API"
      icon="🧪"
      heading-id="weather-note-heading"
    >
      <div class="endpoint-guide">
        <span><b class="method method--get">GET</b> 목록 조회</span>
        <span><b class="method method--post">POST</b> 메모 등록</span>
        <span><b class="method method--patch">PATCH</b> 즐겨찾기 수정</span>
        <span><b class="method method--delete">DELETE</b> 메모 삭제</span>
      </div>

      <form class="note-form" @submit.prevent="createNote">
        <label>
          <span>도시</span>
          <select v-model="noteForm.cityName">
            <option v-for="city in cities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
        </label>
        <label class="memo-field">
          <span>날씨 메모</span>
          <input
            v-model.trim="noteForm.memo"
            type="text"
            maxlength="120"
            placeholder="예: 우산 챙기기"
            required
          />
        </label>
        <label class="favorite-field">
          <input v-model="noteForm.favorite" type="checkbox" />
          <span>즐겨찾기</span>
        </label>
        <button type="submit" class="create-button">POST 등록</button>
      </form>

      <div class="note-toolbar">
        <label>
          <span class="sr-only">날씨 메모 검색</span>
          <input
            v-model.trim="searchQuery"
            type="search"
            placeholder="도시 또는 메모 검색"
            @keyup.enter="loadNotes"
          />
        </label>
        <button type="button" @click="loadNotes">GET 조회</button>
      </div>

      <p v-if="noteError" class="error-message" role="alert">
        {{ noteError }}
      </p>

      <div v-if="isNotesLoading" class="notes-loading">메모를 조회하는 중…</div>
      <ul v-else class="note-list">
        <li v-for="note in notes" :key="note.id">
          <button
            type="button"
            class="favorite-button"
            :aria-label="`${note.cityName} 메모 즐겨찾기 변경`"
            @click="toggleFavorite(note)"
          >
            {{ note.favorite ? '★' : '☆' }}
          </button>
          <div>
            <strong>{{ note.cityName }}</strong>
            <p>{{ note.memo }}</p>
            <time :datetime="note.createdAt">{{ formatDate(note.createdAt) }}</time>
          </div>
          <button
            type="button"
            class="delete-button"
            @click="removeNote(note.id)"
          >
            DELETE
          </button>
        </li>
        <li v-if="notes.length === 0" class="empty-notes">
          조회된 날씨 메모가 없습니다.
        </li>
      </ul>
    </BaseDashboardCard>
  </section>
</template>

<style scoped>
.lab-view {
  padding-top: 24px;
}

.lab-hero {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 22px;
  border-radius: 18px;
  color: #ffffff;
  background: linear-gradient(135deg, #315b78, #318e9e);
  box-shadow: 0 13px 28px rgb(45 101 126 / 17%);
}

.success-badge {
  display: inline-flex;
  padding: 5px 8px;
  border-radius: 999px;
  color: #dffff2;
  background: rgb(255 255 255 / 15%);
  font-size: 0.62rem;
  font-weight: 850;
}

.lab-hero h2 {
  margin: 9px 0 4px;
  font-size: 1.3rem;
  letter-spacing: -0.03em;
}

.lab-hero p {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.82;
}

.lab-hero > button {
  min-height: 37px;
  padding: 8px 13px;
  border: 1px solid rgb(255 255 255 / 35%);
  border-radius: 10px;
  color: #ffffff;
  background: rgb(255 255 255 / 12%);
  font-size: 0.7rem;
  font-weight: 800;
}

.auth-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.lab-card {
  min-width: 0;
  padding: 17px;
  border: 1px solid #dce9f2;
  border-radius: 16px;
  background: #f8fbfd;
}

.card-heading {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 13px;
}

.card-heading h3 {
  margin: 0 0 3px;
  color: #31516a;
  font-size: 0.82rem;
}

.card-heading code,
.header-preview {
  color: #71899b;
  font-size: 0.59rem;
}

.method,
.jwt-chip {
  display: inline-flex;
  flex: none;
  padding: 4px 7px;
  border-radius: 6px;
  color: #ffffff;
  font-size: 0.55rem;
  font-weight: 900;
}

.method--get {
  background: #318bd0;
}

.method--post {
  background: #39aa75;
}

.method--patch {
  background: #d99a35;
}

.method--delete {
  background: #d65e58;
}

.jwt-chip {
  background: #7359bb;
}

.profile-list {
  display: grid;
  gap: 7px;
  margin: 0;
}

.profile-list div {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #e5edf3;
}

.profile-list dt {
  color: #8395a4;
  font-size: 0.64rem;
}

.profile-list dd {
  overflow: hidden;
  margin: 0;
  color: #46647a;
  font-size: 0.65rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.profile-list dd strong {
  color: #23805d;
}

pre {
  max-height: 145px;
  margin: 0;
  overflow: auto;
  padding: 11px;
  border-radius: 9px;
  color: #dcefff;
  background: #243b4d;
  font-size: 0.58rem;
  line-height: 1.55;
  white-space: pre-wrap;
}

.security-note,
.protected-card > p {
  margin: 9px 0 0;
  color: #718598;
  font-size: 0.63rem;
  line-height: 1.5;
}

.header-preview {
  display: block;
  margin-top: 10px;
  overflow: hidden;
  padding: 8px;
  border-radius: 8px;
  background: #edf4f8;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.protected-card > button,
.note-toolbar button,
.create-button {
  min-height: 34px;
  margin-top: 10px;
  padding: 7px 11px;
  border: 0;
  border-radius: 9px;
  color: #ffffff;
  background: #347eaa;
  font-size: 0.65rem;
  font-weight: 850;
}

.protected-result {
  display: grid;
  gap: 3px;
  margin-top: 9px;
  padding: 9px;
  border-radius: 9px;
  color: #287252;
  background: #eaf8f1;
  font-size: 0.62rem;
}

.endpoint-guide {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 15px;
}

.endpoint-guide span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 8px;
  border-radius: 9px;
  color: #6b8294;
  background: #ffffff;
  font-size: 0.63rem;
}

.note-form {
  display: grid;
  grid-template-columns: 130px minmax(0, 1fr) auto auto;
  align-items: end;
  gap: 9px;
  padding: 13px;
  border: 1px solid #dce9f2;
  border-radius: 13px;
  background: rgb(255 255 255 / 76%);
}

.note-form label {
  display: grid;
  gap: 5px;
  color: #657c8f;
  font-size: 0.64rem;
  font-weight: 750;
}

.note-form select,
.note-form input[type='text'],
.note-toolbar input {
  width: 100%;
  height: 37px;
  padding: 0 10px;
  border: 1px solid #c9dce9;
  border-radius: 9px;
  color: #31516a;
  background: #ffffff;
  outline: none;
}

.favorite-field {
  display: flex !important;
  min-height: 37px;
  align-items: center;
  grid-auto-flow: column;
  white-space: nowrap;
}

.favorite-field input {
  accent-color: #42a9dc;
}

.create-button {
  min-height: 37px;
  margin-top: 0;
  background: #39a875;
}

.note-toolbar {
  display: flex;
  gap: 8px;
  margin-top: 11px;
}

.note-toolbar label {
  flex: 1;
}

.note-toolbar button {
  min-height: 37px;
  margin-top: 0;
}

.error-message {
  margin: 10px 0 0;
  padding: 8px 10px;
  border-radius: 8px;
  color: #b04c45;
  background: #fff0ee;
  font-size: 0.64rem;
  font-weight: 700;
}

.notes-loading,
.empty-notes {
  padding: 24px !important;
  color: #788d9e;
  text-align: center;
}

.note-list {
  display: grid;
  gap: 8px;
  margin: 11px 0 0;
  padding: 0;
  list-style: none;
}

.note-list li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 11px;
  padding: 11px 12px;
  border: 1px solid #dfeaf2;
  border-radius: 12px;
  background: #ffffff;
}

.favorite-button,
.delete-button {
  border: 0;
  background: transparent;
}

.favorite-button {
  color: #e0a329;
  font-size: 1.25rem;
}

.note-list strong {
  color: #31536c;
  font-size: 0.76rem;
}

.note-list p {
  margin: 3px 0;
  color: #647b8e;
  font-size: 0.69rem;
}

.note-list time {
  color: #9aa8b4;
  font-size: 0.57rem;
}

.delete-button {
  color: #c65a55;
  font-size: 0.57rem;
  font-weight: 850;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 820px) {
  .auth-grid {
    grid-template-columns: 1fr;
  }

  .note-form {
    grid-template-columns: 1fr 1fr;
  }

  .memo-field {
    grid-column: 1 / -1;
    grid-row: 1;
  }
}

@media (max-width: 520px) {
  .lab-hero {
    align-items: flex-start;
    flex-direction: column;
  }

  .note-form {
    grid-template-columns: 1fr;
  }

  .memo-field {
    grid-column: auto;
    grid-row: auto;
  }
}
</style>
