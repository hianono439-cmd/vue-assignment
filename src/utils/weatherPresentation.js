export const getWeatherStatus = (weatherMain, cloudiness = 0) => {
  // OpenWeatherMap의 영문 상태를 사용자가 익숙한 한국어 표현으로 바꾼다.
  const statusMap = {
    Clear: '맑음',
    Rain: '비',
    Drizzle: '약한 비',
    Thunderstorm: '천둥번개',
    Snow: '눈',
    Mist: '안개',
    Smoke: '흐림',
    Haze: '흐림',
    Dust: '흐림',
    Fog: '안개',
    Sand: '흐림',
    Ash: '흐림',
    Squall: '강한 바람',
    Tornado: '돌풍',
  }

  if (weatherMain === 'Clouds') {
    // 같은 구름 상태라도 운량에 따라 세 단계로 나눠 보여준다.
    if (cloudiness <= 25) return '구름 조금'
    if (cloudiness <= 75) return '구름 많음'
    return '흐림'
  }

  return statusMap[weatherMain] ?? '날씨 변화'
}

// 카드와 상세 화면이 같은 날씨 아이콘을 사용하도록 한곳에서 결정한다.
export const getWeatherEmoji = (status = '') => {
  if (status === '맑음') return '☀️'
  if (status.includes('천둥')) return '⛈️'
  if (status.includes('비')) return '🌧️'
  if (status.includes('눈')) return '🌨️'
  if (status.includes('안개')) return '🌫️'
  if (status.includes('구름')) return '☁️'
  if (status === '흐림') return '🌥️'
  if (status.includes('바람') || status.includes('돌풍')) return '💨'
  return '🌤️'
}
