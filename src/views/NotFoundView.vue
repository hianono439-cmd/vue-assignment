<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found" aria-labelledby="not-found-heading">
    <div class="error-card">
      <div class="error-illustration" aria-hidden="true">
        <span>☀️</span>
        <strong>?</strong>
      </div>
      <p class="error-code">404 · 페이지를 찾을 수 없음</p>
      <h2 id="not-found-heading">페이지를 찾을 수 없습니다.</h2>
      <p class="description">
        주소가 변경되었거나 존재하지 않는 페이지입니다.
      </p>
      <RouterLink to="/">날씨 메인으로 이동</RouterLink>
    </div>
  </section>
</template>

<style scoped>
.not-found {
  display: grid;
  min-height: 480px;
  padding-top: 24px;
  place-items: center;
}

.error-card {
  width: min(100%, 520px);
  padding: 52px 30px;
  border: 1px solid #dce9f3;
  border-radius: 24px;
  background: linear-gradient(145deg, #fbfdff, #f3f9fd);
  box-shadow: 0 18px 42px rgb(48 94 132 / 10%);
  text-align: center;
}

.error-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 13px;
  margin-bottom: 20px;
}

.error-illustration span {
  font-size: 3.4rem;
}

.error-illustration strong {
  color: #ef6f8b;
  font-size: 3.5rem;
  line-height: 1;
}

.error-code {
  margin: 0 0 8px;
  color: #65a2c4;
  font-size: 0.65rem;
  font-weight: 850;
  letter-spacing: 0.14em;
}

h2 {
  margin: 0;
  color: #29445e;
  font-size: 1.4rem;
  letter-spacing: -0.03em;
}

.description {
  margin: 11px 0 24px;
  color: #7a8da0;
  font-size: 0.82rem;
  line-height: 1.65;
}

a {
  display: inline-flex;
  min-height: 43px;
  align-items: center;
  justify-content: center;
  padding: 10px 18px;
  border-radius: 12px;
  color: #ffffff;
  background: linear-gradient(135deg, #43a9e4, #348fd0);
  box-shadow: 0 9px 20px rgb(52 143 208 / 22%);
  font-size: 0.79rem;
  font-weight: 800;
  text-decoration: none;
}

a:hover,
a:focus-visible {
  filter: brightness(0.96);
  outline: 3px solid rgb(65 169 228 / 23%);
}

@media (max-width: 560px) {
  .not-found {
    min-height: 400px;
  }

  .error-card {
    padding: 42px 20px;
  }
}
</style>
