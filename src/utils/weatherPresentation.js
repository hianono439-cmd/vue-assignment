export const getWeatherStatus = (weatherMain, cloudiness = 0) => {
  const statusMap = {
    Clear: '맑음',
    Rain: '비',
    Drizzle: '비',
    Thunderstorm: '비',
    Snow: '눈',
    Mist: '흐림',
    Smoke: '흐림',
    Haze: '흐림',
    Dust: '흐림',
    Fog: '흐림',
    Sand: '흐림',
    Ash: '흐림',
    Squall: '흐림',
    Tornado: '흐림',
  }

  if (weatherMain === 'Clouds') {
    return cloudiness >= 75 ? '흐림' : '구름'
  }

  return statusMap[weatherMain] ?? '변화'
}

export const getWeatherEmoji = (status) => {
  const iconMap = {
    맑음: '☀️',
    비: '🌧️',
    구름: '☁️',
    흐림: '🌥️',
    눈: '🌨️',
    변화: '🌤️',
  }

  return iconMap[status] ?? '🌤️'
}
