<script setup>
import { computed } from 'vue'

const props = defineProps({
  query: {
    type: String,
    default: '',
  },
})

const emit = defineEmits({
  'update-query': (value) => typeof value === 'string',
})

const trimmedQuery = computed(() => props.query.trim())

const handleInput = (event) => {
  emit('update-query', event.target.value)
}
</script>

<template>
  <div class="search-bar">
    <label class="sr-only" for="city-search">검색할 도시 이름</label>
    <div class="input-shell">
      <span class="input-icon" aria-hidden="true">⌕</span>
      <input
        id="city-search"
        :value="query"
        type="text"
        autocomplete="off"
        placeholder="도시 이름을 검색해 보세요"
        @input="handleInput"
      />
      <span v-if="trimmedQuery" class="typing-dot" aria-hidden="true"></span>
    </div>

    <p class="search-status" aria-live="polite">
      <span class="status-dot" aria-hidden="true"></span>
      <template v-if="trimmedQuery">
        검색 중인 도시: <strong>{{ trimmedQuery }}</strong>
      </template>
      <template v-else>도시 이름을 입력하면 즉시 결과가 표시됩니다.</template>
    </p>
  </div>
</template>

<style scoped>
.input-shell {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 15px;
  color: #5293bf;
  font-size: 1.45rem;
  line-height: 1;
  transform: translateY(-54%);
  pointer-events: none;
}

input {
  width: 100%;
  height: 50px;
  padding: 0 46px 0 46px;
  border: 1px solid #c9dce9;
  border-radius: 14px;
  color: #25354b;
  background: #ffffff;
  outline: none;
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease;
}

input:focus {
  border-color: #2e91dd;
  box-shadow:
    0 0 0 4px rgb(46 145 221 / 12%),
    0 8px 22px rgb(46 145 221 / 9%);
}

input::placeholder {
  color: #98a3af;
}

.search-status {
  display: flex;
  align-items: center;
  gap: 7px;
  min-height: 24px;
  margin: 0;
  padding: 10px 3px 0;
  color: #617087;
  font-size: 0.82rem;
}

.search-status strong {
  color: #226ca5;
}

.status-dot,
.typing-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #42bd87;
  box-shadow: 0 0 0 4px rgb(66 189 135 / 12%);
}

.typing-dot {
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);
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
</style>
