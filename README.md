# Vue 날씨 대시보드 과제

기존 날씨 Mockup과 Composition API 기능을 유지하면서 컴포넌트 분리 및 Vue Router를 적용한 프로젝트입니다.

## 실행

```bash
npm install
npm run dev
```

## 페이지 경로

- `/#/`: 메인 날씨 대시보드
- `/#/about`: 서비스 소개
- `/#/weather/:cityId`: 도시별 상세 기상 정보
- 그 외 주소: 404 페이지

GitHub Pages에서 새로고침해도 경로를 찾을 수 있도록 Hash Router를 사용합니다.

## 프로젝트 구조

- `views/WeatherHomeView.vue`: 반응형 상태, 검색 필터링, 감시 및 라우터 이동 처리
- `views/WeatherDetailView.vue`: 동적 도시 ID로 상세 Mock Data 조회
- `views/WeatherAboutView.vue`: 서비스 소개 화면
- `views/NotFoundView.vue`: Catch-all 404 화면
- `components/exercise/`: 공통 카드, 검색창, 날씨 카드 컴포넌트
- `router/index.js`: 지연 로딩 라우트와 Hash Router 설정

## Composition API 실습

- `searchQuery`, `selectedCityInfo`, `weatherList`를 `ref`로 관리
- `filteredWeatherList`를 `computed`로 계산
- `selectedCityInfo` 변경을 `watch`로 감시해 콘솔 기록
- 검색어와 검색 결과를 `watchEffect`로 자동 추적해 콘솔 기록
- 빈 검색어, 일치 결과, 검색 결과 없음의 세 가지 화면 상태 처리
- 전국 8개 도시의 날씨 데이터 제공
- 도시 이름의 받침 여부를 판별해 `이/가` 조사를 올바르게 표시
