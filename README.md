# Vue 날씨 대시보드 과제

Composition API, 컴포넌트 분리, Vue Router, Pinia 전역 상태 관리, Axios 기반 OpenWeatherMap 실시간 날씨 연동과 Motion for Vue 애니메이션을 적용한 프로젝트입니다.

## 실행

```bash
npm install
cp .env.example .env.local
# .env.local의 VITE_OPENWEATHER_API_KEY에 본인의 키 입력
npm run dev
```

`.env.local`은 Git에서 제외되며 API 키를 소스코드에 직접 작성하지 않습니다.

## 페이지 경로

- `/#/`: 메인 날씨 대시보드
- `/#/about`: 서비스 소개
- `/#/weather/:cityId`: 도시별 상세 기상 정보
- 그 외 주소: 404 페이지

GitHub Pages에서 새로고침해도 경로를 찾을 수 있도록 Hash Router를 사용합니다.

## 프로젝트 구조

- `views/WeatherHomeView.vue`: 반응형 상태, 검색 필터링, 감시 및 라우터 이동 처리
- `views/WeatherDetailView.vue`: 동적 도시 ID로 상세 실시간 관측 정보 조회
- `views/WeatherAboutView.vue`: 서비스 소개 화면
- `views/NotFoundView.vue`: Catch-all 404 화면
- `components/exercise/`: 공통 카드, 검색창, 날씨 카드 컴포넌트
- `router/index.js`: 지연 로딩 라우트와 Hash Router 설정
- `services/weatherApi.js`: Axios 인스턴스, OpenWeatherMap 요청 및 응답 변환
- `stores/weatherStore.js`: 홈과 상세 페이지가 공유하는 실시간 날씨 상태

## Composition API 실습

- `searchQuery`, `selectedCityInfo`를 `ref`로 관리
- `filteredWeatherList`를 `computed`로 계산
- `selectedCityInfo` 변경을 `watch`로 감시해 콘솔 기록
- 검색어와 검색 결과를 `watchEffect`로 자동 추적해 콘솔 기록
- 빈 검색어, 일치 결과, 검색 결과 없음의 세 가지 화면 상태 처리
- 전국 8개 도시의 위도·경도를 이용해 실시간 데이터 조회
- 도시 이름의 받침 여부를 판별해 `이/가` 조사를 올바르게 표시

## Pinia Store 실습

- `stores/configStore.js`에서 온도 단위 상태를 전역 관리
- `unit` state의 초깃값은 `celsius`
- `unitSymbol` getter로 현재 단위의 `°C` 또는 `°F` 기호 제공
- `toggleUnit` action으로 섭씨와 화씨 전환
- 상단 `UnitToggler.vue`에서 단위를 변경하면 홈 카드와 상세 화면에 동시에 반영
- `useTemperature` composable에서 중복되는 온도 변환 로직 관리

## Axios 날씨 데이터 연동

- `axios.create()`로 OpenWeatherMap 전용 API 클라이언트 구성
- `/data/2.5/weather`에 도시별 위도·경도, `metric`, `kr` 옵션 전달
- API 응답을 카드와 상세 화면에서 사용하는 공통 데이터 구조로 변환
- 초기 로딩, 일부 도시 실패, 전체 실패, 요청 지연 및 재시도 UI 제공
- 상세 페이지에서 습도, 풍속, 기압, 가시거리, 구름량, 일출·일몰 표시

## 마이크로 인터랙션 및 스크롤 애니메이션

- Motion for Vue의 `useScroll`, `useTransform`으로 스크롤 진행 바와 배경 패럴랙스 구현
- 검색·날씨 영역이 화면에 들어올 때 한 번만 자연스럽게 나타나는 스크롤 진입 효과
- 도시 카드의 순차 등장, 검색 결과 재배치 애니메이션과 호버·클릭 반응
- 실시간 상태 표시와 새로고침 아이콘의 상태 기반 애니메이션
- `prefers-reduced-motion` 설정을 존중해 움직임에 민감한 사용자의 애니메이션 최소화
- 넓은 카드와 기본 카드를 섞은 반응형 Bento Grid 레이아웃
- 버튼으로 카드를 3D 플립해 체감온도·습도·풍속·가시거리 빠른 정보 표시

## GitHub Pages 환경변수

저장소의 **Settings → Secrets and variables → Actions**에서 다음 Secret을 추가해야 배포 화면에서도 날씨를 불러올 수 있습니다.

```text
이름: OPENWEATHER_API_KEY
값: 본인의 OpenWeatherMap API 키
```

GitHub Actions가 이 값을 빌드 시 `VITE_OPENWEATHER_API_KEY`로 전달합니다.

GitHub Pages는 정적 프런트엔드이므로 빌드된 JavaScript에서 API 키를 완전히 숨길 수는 없습니다. 저장소에 원문 키를 커밋하지 않기 위한 설정이며, 제출 후에는 키를 재발급하고 OpenWeatherMap에서 가능한 사용 제한을 설정하는 것을 권장합니다.
