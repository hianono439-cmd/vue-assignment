# Vue 날씨 대시보드 과제

Composition API, 컴포넌트 분리, Vue Router, Pinia 전역 상태 관리와 Axios 기반 OpenWeatherMap 실시간 날씨 연동을 적용한 프로젝트입니다. 교수님 실습 샘플의 Mock REST API와 Pinia·JWT 인증 흐름은 기존 날씨 기능을 유지한 채 별도의 `API·JWT 실습실`로 통합했습니다.

## 실행

```bash
npm install
cp .env.example .env.local
# .env.local의 VITE_OPENWEATHER_API_KEY에 본인의 키 입력
npm run dev
```

`.env.local`은 Git에서 제외되며 API 키를 소스코드에 직접 작성하지 않습니다.

### Mock API·JWT 실습 실행

```bash
npm install
npm run dev:all
```

`dev:all`은 Vue 개발 서버와 Node Mock API(`http://localhost:3001/api`)를 함께 실행합니다. 이후 상단의 **API·JWT 실습** 메뉴에서 로그인합니다.

| 계정 | 이메일 | 비밀번호 |
| --- | --- | --- |
| 수강생 | `student@skala.com` | `1234` |
| 관리자 | `admin@skala.com` | `admin1234` |

Mock API의 데이터는 메모리에 저장되므로 API 서버를 재시작하면 초기 상태로 돌아갑니다. 이 로그인은 인증 구조를 이해하기 위한 로컬 실습용이며 실제 서비스용 인증 구현이 아닙니다.

## 페이지 경로

- `/#/`: 메인 날씨 대시보드
- `/#/about`: 서비스 소개
- `/#/weather/:cityId`: 도시별 상세 기상 정보
- `/#/login`: Mock API 로그인
- `/#/lab`: JWT 인증이 필요한 날씨 메모 API 실습실
- 그 외 주소: 404 페이지

GitHub Pages에서 새로고침해도 경로를 찾을 수 있도록 Hash Router를 사용합니다.

## 프로젝트 구조

- `views/WeatherHomeView.vue`: 반응형 상태, 검색 필터링, 감시 및 라우터 이동 처리
- `views/WeatherDetailView.vue`: 동적 도시 ID로 상세 실시간 관측 정보 조회
- `views/WeatherAboutView.vue`: 서비스 소개 화면
- `views/NotFoundView.vue`: Catch-all 404 화면
- `views/LoginView.vue`: Mock 로그인 및 JWT 발급 화면
- `views/PracticeLabView.vue`: 보호 API 호출과 날씨 메모 CRUD 화면
- `components/exercise/`: 공통 카드, 검색창, 날씨 카드 컴포넌트
- `router/index.js`: 지연 로딩 라우트, Hash Router, 인증 가드 설정
- `services/weatherApi.js`: Axios 인스턴스, OpenWeatherMap 요청 및 응답 변환
- `stores/weatherStore.js`: 홈과 상세 페이지가 공유하는 실시간 날씨 상태
- `stores/authStore.js`: 로그인 사용자와 Access Token을 관리하는 Pinia Store
- `api/mockHttp.js`: Bearer Token을 자동 첨부하는 Axios 인터셉터
- `mock-api/`: Node 내장 HTTP 모듈 기반 로그인·날씨 메모 REST API
- `server.js`: 로컬 Mock API 진입점

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

## Mock API·Pinia·JWT 실습

- `POST /api/auth/login`으로 실습 계정 확인 및 HMAC SHA-256 서명의 JWT 발급
- Pinia Setup Store와 `storeToRefs()`로 사용자·토큰·요청 상태 공유
- Access Token을 Session Storage에 보관하고 Axios 요청 인터셉터에서 `Authorization: Bearer ...` 자동 첨부
- Vue Router 전역 가드로 `/lab` 접근 전 로그인 여부와 `GET /api/auth/me` 검증
- 보호 API를 호출해 정상 토큰과 사용자 권한 확인
- 사용자별 날씨 메모 `GET`, `POST`, `PATCH`, `DELETE` 실습
- 로딩·오류·빈 목록 상태 및 검색 쿼리 처리

### Mock API 경로

| 메서드 | 경로 | 설명 | 인증 |
| --- | --- | --- | --- |
| `GET` | `/api/health` | 서버 상태 확인 | 불필요 |
| `POST` | `/api/auth/login` | 로그인 및 JWT 발급 | 불필요 |
| `GET` | `/api/auth/me` | 로그인 사용자 조회 | Bearer |
| `GET` | `/api/auth/protected-message` | 보호 API 호출 확인 | Bearer |
| `GET` | `/api/weather-notes?q=` | 내 날씨 메모 조회·검색 | Bearer |
| `POST` | `/api/weather-notes` | 날씨 메모 생성 | Bearer |
| `PATCH` | `/api/weather-notes/:id` | 메모 또는 즐겨찾기 수정 | Bearer |
| `DELETE` | `/api/weather-notes/:id` | 날씨 메모 삭제 | Bearer |

## GitHub Pages 환경변수

저장소의 **Settings → Secrets and variables → Actions**에서 다음 Secret을 추가해야 배포 화면에서도 날씨를 불러올 수 있습니다.

```text
이름: OPENWEATHER_API_KEY
값: 본인의 OpenWeatherMap API 키
```

GitHub Actions가 이 값을 빌드 시 `VITE_OPENWEATHER_API_KEY`로 전달합니다.

GitHub Pages는 정적 프런트엔드이므로 빌드된 JavaScript에서 API 키를 완전히 숨길 수는 없습니다. 저장소에 원문 키를 커밋하지 않기 위한 설정이며, 제출 후에는 키를 재발급하고 OpenWeatherMap에서 가능한 사용 제한을 설정하는 것을 권장합니다.

또한 GitHub Pages에서는 Node Mock API 서버를 실행할 수 없습니다. 공개 배포 링크의 실시간 날씨 대시보드는 정상 동작하지만, `API·JWT 실습실`은 `npm run dev:all`로 실행한 로컬 환경에서 사용하는 실습 기능입니다. 온라인에서도 실습실을 사용하려면 Mock API를 별도의 서버 호스팅 서비스에 배포하고 `VITE_MOCK_API_BASE_URL`을 해당 주소로 설정해야 합니다.
