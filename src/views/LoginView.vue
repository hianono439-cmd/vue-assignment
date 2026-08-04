<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const credentials = reactive({
  email: 'student@skala.com',
  password: '1234',
})

const useAccount = (type) => {
  if (type === 'admin') {
    credentials.email = 'admin@skala.com'
    credentials.password = 'admin1234'
    return
  }

  credentials.email = 'student@skala.com'
  credentials.password = '1234'
}

const submitLogin = async () => {
  const succeeded = await authStore.login(
    credentials.email,
    credentials.password,
  )

  if (!succeeded) return

  const redirect =
    typeof route.query.redirect === 'string'
      ? route.query.redirect
      : '/lab'

  await router.replace(redirect)
}
</script>

<template>
  <section class="login-view" aria-labelledby="login-heading">
    <div class="login-intro">
      <span class="eyebrow">LOCAL AUTHENTICATION LAB</span>
      <h2 id="login-heading">Pinia와 JWT로<br />인증 흐름 연습하기</h2>
      <p>
        로컬 Mock API에 로그인 요청을 보내고, 발급받은 JWT를 Pinia와
        Session Storage에서 관리합니다.
      </p>

      <ol class="auth-flow" aria-label="로그인 처리 순서">
        <li><span>1</span><strong>POST 로그인</strong></li>
        <li><span>2</span><strong>JWT 발급</strong></li>
        <li><span>3</span><strong>Pinia 저장</strong></li>
        <li><span>4</span><strong>보호 API</strong></li>
      </ol>

      <div class="local-notice">
        <span aria-hidden="true">⌁</span>
        <p>
          <strong>로컬 실습 전용</strong>
          <small><code>npm run dev:all</code>로 Vue와 Mock API를 함께 실행하세요.</small>
        </p>
      </div>
    </div>

    <form class="login-card" @submit.prevent="submitLogin">
      <div class="login-card__heading">
        <span>POST</span>
        <div>
          <h3>Mock 로그인</h3>
          <code>/api/auth/login</code>
        </div>
      </div>

      <div class="quick-accounts">
        <button type="button" @click="useAccount('student')">수강생 계정</button>
        <button type="button" @click="useAccount('admin')">관리자 계정</button>
      </div>

      <label>
        <span>이메일</span>
        <input
          v-model.trim="credentials.email"
          type="email"
          autocomplete="username"
          required
        />
      </label>

      <label>
        <span>비밀번호</span>
        <input
          v-model="credentials.password"
          type="password"
          autocomplete="current-password"
          required
        />
      </label>

      <p v-if="authStore.errorMessage" class="login-error" role="alert">
        {{ authStore.errorMessage }}
      </p>

      <button
        class="login-button"
        :disabled="authStore.isLoading"
        type="submit"
      >
        {{ authStore.isLoading ? '인증 요청 중…' : '실습 계정으로 로그인' }}
      </button>

      <p class="test-account">
        테스트 계정 <code>student@skala.com / 1234</code>
      </p>
    </form>
  </section>
</template>

<style scoped>
.login-view {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 26px;
  padding-top: 26px;
}

.login-intro {
  padding: 30px 12px 20px 4px;
}

.eyebrow {
  color: #48a2cd;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.login-intro h2 {
  margin: 11px 0 13px;
  color: #25455f;
  font-size: clamp(1.65rem, 4vw, 2.25rem);
  line-height: 1.25;
  letter-spacing: -0.045em;
}

.login-intro > p {
  margin: 0;
  color: #71869a;
  font-size: 0.85rem;
  line-height: 1.75;
}

.auth-flow {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 7px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.auth-flow li {
  display: grid;
  justify-items: center;
  gap: 7px;
  padding: 12px 5px;
  border: 1px solid #dce9f2;
  border-radius: 13px;
  color: #61798d;
  background: rgb(255 255 255 / 75%);
  font-size: 0.65rem;
  text-align: center;
}

.auth-flow span {
  display: grid;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 999px;
  color: #ffffff;
  background: #45a8d6;
  font-size: 0.62rem;
}

.local-notice {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #f1d8ae;
  border-radius: 13px;
  color: #95612e;
  background: #fff8eb;
}

.local-notice > span {
  font-size: 1.25rem;
}

.local-notice p {
  display: grid;
  gap: 2px;
  margin: 0;
  font-size: 0.72rem;
}

.local-notice small {
  font-size: 0.65rem;
}

.login-card {
  align-self: center;
  padding: 25px;
  border: 1px solid #dce9f2;
  border-radius: 21px;
  background: linear-gradient(145deg, #fbfdff, #f4f9fd);
  box-shadow: 0 16px 38px rgb(47 92 128 / 11%);
}

.login-card__heading {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-bottom: 18px;
}

.login-card__heading > span {
  padding: 5px 8px;
  border-radius: 7px;
  color: #ffffff;
  background: #39ad7a;
  font-size: 0.62rem;
  font-weight: 900;
}

.login-card__heading h3 {
  margin: 0 0 3px;
  color: #294b65;
  font-size: 1rem;
}

.login-card code,
.test-account code,
.local-notice code {
  color: #47718d;
  font-size: 0.66rem;
}

.quick-accounts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 16px;
}

.quick-accounts button {
  min-height: 34px;
  border: 1px solid #c9dce9;
  border-radius: 9px;
  color: #4c718a;
  background: #ffffff;
  font-size: 0.69rem;
  font-weight: 750;
}

.login-card label {
  display: grid;
  gap: 6px;
  margin-top: 12px;
  color: #5e7488;
  font-size: 0.72rem;
  font-weight: 750;
}

.login-card input {
  width: 100%;
  height: 43px;
  padding: 0 12px;
  border: 1px solid #c9dce9;
  border-radius: 10px;
  color: #29445e;
  background: #ffffff;
  outline: none;
}

.login-card input:focus {
  border-color: #43a9e4;
  box-shadow: 0 0 0 4px rgb(67 169 228 / 12%);
}

.login-error {
  margin: 12px 0 0;
  padding: 9px 10px;
  border-radius: 9px;
  color: #b04c45;
  background: #fff0ee;
  font-size: 0.69rem;
  font-weight: 700;
}

.login-button {
  width: 100%;
  min-height: 43px;
  margin-top: 16px;
  border: 0;
  border-radius: 11px;
  color: #ffffff;
  background: linear-gradient(135deg, #43a9e4, #348fd0);
  box-shadow: 0 9px 19px rgb(52 143 208 / 20%);
  font-size: 0.78rem;
  font-weight: 850;
}

.login-button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.test-account {
  margin: 13px 0 0;
  color: #8597a7;
  font-size: 0.65rem;
  text-align: center;
}

@media (max-width: 780px) {
  .login-view {
    grid-template-columns: 1fr;
  }

  .login-intro {
    padding-bottom: 0;
  }
}

@media (max-width: 480px) {
  .auth-flow {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
