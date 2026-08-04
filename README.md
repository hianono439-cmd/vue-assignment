# Vue 날씨 컴포넌트 과제

기존 날씨 Mockup의 기능을 유지하면서 Vue 컴포넌트로 분리한 프로젝트입니다.

## 실행

```bash
npm install
npm run dev
```

## 컴포넌트 구조

- `WeatherParent.vue`: 반응형 상태, `computed` 검색 필터링, `watch` 및 `watchEffect`, 이벤트 처리
- `BaseDashboardCard.vue`: 공통 패널 디자인과 기본 슬롯 제공
- `SearchBar.vue`: 검색어를 props로 받고 `update-query` 이벤트 전달
- `WeatherCard.vue`: 도시 객체를 props로 받고 `select-card`, `click-detail` 이벤트 전달
- 모든 컴포넌트 디자인은 각 파일의 `<style scoped>`로 분리

## Composition API 실습

- `searchQuery`, `selectedCityInfo`, `weatherList`를 `ref`로 관리
- `filteredWeatherList`를 `computed`로 계산
- `selectedCityInfo` 변경을 `watch`로 감시해 콘솔 기록
- 검색어와 검색 결과를 `watchEffect`로 자동 추적해 콘솔 기록
- 빈 검색어, 일치 결과, 검색 결과 없음의 세 가지 화면 상태 처리
- 전국 8개 도시의 날씨 데이터 제공
- 도시 이름의 받침 여부를 판별해 `이/가` 조사를 올바르게 표시
