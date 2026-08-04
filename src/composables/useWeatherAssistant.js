import { ref } from 'vue'
import { useConfigStore } from '../stores/configStore'
import { useWeatherStore } from '../stores/weatherStore'

const initialMessage = {
  id: 1,
  role: 'assistant',
  text: '안녕하세요! 실시간 날씨를 분석하는 도우미예요. 도시 날씨, 우산, 옷차림이나 가장 덥고 습한 도시를 물어보세요.',
}

const hasFinalConsonant = (word = '') => {
  const lastCode = word.charCodeAt(word.length - 1)
  return lastCode >= 0xac00 && lastCode <= 0xd7a3
    ? (lastCode - 0xac00) % 28 !== 0
    : false
}

const topic = (word) => `${word}${hasFinalConsonant(word) ? '은' : '는'}`
const subject = (word) => `${word}${hasFinalConsonant(word) ? '이' : '가'}`
const copula = (word) => `${word}${hasFinalConsonant(word) ? '이에요' : '예요'}`

const getOutfitAdvice = (temperature) => {
  if (temperature >= 28) return '민소매나 반팔처럼 가벼운 옷과 자외선 차단 용품이 좋아요.'
  if (temperature >= 23) return '반팔이나 얇은 셔츠가 잘 맞아요.'
  if (temperature >= 20) return '얇은 긴팔이나 가벼운 가디건을 챙겨 보세요.'
  if (temperature >= 17) return '맨투맨이나 얇은 재킷이 적당해요.'
  if (temperature >= 12) return '재킷이나 니트처럼 보온되는 겉옷이 필요해요.'
  if (temperature >= 5) return '코트와 따뜻한 니트를 추천해요.'
  return '두꺼운 외투와 목도리, 장갑으로 따뜻하게 입으세요.'
}

const needsUmbrella = (city) =>
  city.status?.includes('비') ||
  city.status?.includes('눈') ||
  Number(city.rainLastHour) > 0

export const useWeatherAssistant = () => {
  const weatherStore = useWeatherStore()
  const configStore = useConfigStore()
  const messages = ref([{ ...initialMessage }])
  const draft = ref('')
  const isThinking = ref(false)

  const suggestedQuestions = [
    '가장 더운 도시는?',
    '서울 옷차림 추천',
    '우산이 필요한 곳은?',
    '습도가 높은 도시는?',
  ]

  const formatTemperature = (temperature) => {
    if (!Number.isFinite(Number(temperature))) return '확인되지 않음'
    if (configStore.unit === 'fahrenheit') {
      return `${Math.round((temperature * 9) / 5 + 32)}°F`
    }
    return `${temperature}°C`
  }

  const findCity = (question, weatherList) =>
    weatherList.find((city) => question.includes(city.name))

  const buildCityAnswer = (question, city) => {
    if (question.includes('옷') || question.includes('입')) {
      return `${topic(city.name)} 현재 ${formatTemperature(city.temp)}예요. ${getOutfitAdvice(city.temp)}`
    }

    if (question.includes('우산') || question.includes('비')) {
      return needsUmbrella(city)
        ? `${topic(city.name)} ${city.status} 상태라 우산을 챙기는 편이 좋아요.`
        : `${topic(city.name)} 현재 ${city.status}이라 비 소식은 보이지 않아요. 그래도 장시간 외출이라면 최신 예보를 한 번 더 확인해 주세요.`
    }

    if (question.includes('습도')) {
      return `${city.name}의 현재 습도는 ${city.humidity ?? '확인되지 않음'}%예요.`
    }

    if (question.includes('바람') || question.includes('풍속')) {
      return `${city.name}의 현재 풍속은 ${city.windSpeed ?? '확인되지 않음'}m/s예요.`
    }

    return `${topic(city.name)} 현재 ${city.status}, 기온은 ${formatTemperature(city.temp)}예요. 체감온도는 ${formatTemperature(city.feelsLike)}, 습도는 ${city.humidity ?? '확인되지 않음'}%입니다.`
  }

  const buildAnswer = (question, weatherList) => {
    const normalizedQuestion = question.replaceAll(' ', '')
    const city = findCity(normalizedQuestion, weatherList)
    if (city) return buildCityAnswer(normalizedQuestion, city)

    if (
      normalizedQuestion.includes('더운') ||
      normalizedQuestion.includes('높은기온') ||
      normalizedQuestion.includes('최고기온')
    ) {
      const hottest = weatherList.reduce((current, item) =>
        item.temp > current.temp ? item : current,
      )
      return `지금 가장 더운 곳은 ${copula(hottest.name)}. 현재 기온은 ${formatTemperature(hottest.temp)}, 날씨는 ${hottest.status}입니다.`
    }

    if (
      normalizedQuestion.includes('추운') ||
      normalizedQuestion.includes('낮은기온') ||
      normalizedQuestion.includes('최저기온')
    ) {
      const coldest = weatherList.reduce((current, item) =>
        item.temp < current.temp ? item : current,
      )
      return `지금 기온이 가장 낮은 곳은 ${copula(coldest.name)}. 현재 ${formatTemperature(coldest.temp)}입니다.`
    }

    if (normalizedQuestion.includes('우산') || normalizedQuestion.includes('비오는')) {
      const rainyCities = weatherList.filter(needsUmbrella)
      return rainyCities.length > 0
        ? `${rainyCities.map((item) => item.name).join(', ')}에 비나 눈이 관측되고 있어요. 우산을 챙겨 주세요.`
        : '현재 확인된 도시 중 비나 눈이 관측되는 곳은 없어요.'
    }

    if (normalizedQuestion.includes('습도')) {
      const mostHumid = weatherList.reduce((current, item) =>
        item.humidity > current.humidity ? item : current,
      )
      return `${subject(mostHumid.name)} 습도 ${mostHumid.humidity}%로 현재 가장 습해요.`
    }

    if (normalizedQuestion.includes('바람') || normalizedQuestion.includes('풍속')) {
      const windiest = weatherList.reduce((current, item) =>
        item.windSpeed > current.windSpeed ? item : current,
      )
      return `${subject(windiest.name)} 풍속 ${windiest.windSpeed}m/s로 현재 바람이 가장 강해요.`
    }

    if (normalizedQuestion.includes('옷') || normalizedQuestion.includes('입')) {
      const averageTemperature =
        weatherList.reduce((sum, item) => sum + item.temp, 0) /
        weatherList.length
      return `주요 도시의 평균 기온은 약 ${formatTemperature(Math.round(averageTemperature))}예요. ${getOutfitAdvice(averageTemperature)} 도시 이름을 함께 말하면 더 정확히 알려드릴게요.`
    }

    if (normalizedQuestion.includes('도시') || normalizedQuestion.includes('전체')) {
      return `현재 ${weatherList.map((item) => item.name).join(', ')}의 날씨를 확인할 수 있어요. 궁금한 도시 이름을 말해 주세요.`
    }

    return '도시 이름과 함께 “날씨”, “옷차림”, “우산”을 물어보거나, “가장 더운 도시”, “습도가 높은 도시”처럼 질문해 보세요.'
  }

  const ensureWeatherData = async () => {
    if (weatherStore.weatherList.length === 0) {
      await weatherStore.loadAll()
    }
    return weatherStore.weatherList
  }

  const sendMessage = async (messageText = draft.value) => {
    const question = messageText.trim()
    if (!question || isThinking.value) return

    messages.value.push({
      id: Date.now(),
      role: 'user',
      text: question,
    })
    draft.value = ''
    isThinking.value = true

    try {
      const weatherList = await ensureWeatherData()
      await new Promise((resolve) => setTimeout(resolve, 380))

      const answer = weatherList.length
        ? buildAnswer(question, weatherList)
        : '날씨 데이터를 불러오지 못했어요. API 설정과 네트워크 연결을 확인한 뒤 다시 질문해 주세요.'

      messages.value.push({
        id: Date.now() + 1,
        role: 'assistant',
        text: answer,
      })
    } catch {
      messages.value.push({
        id: Date.now() + 1,
        role: 'assistant',
        text: '날씨 데이터를 불러오는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
      })
    } finally {
      isThinking.value = false
    }
  }

  const clearConversation = () => {
    messages.value = [{ ...initialMessage, id: Date.now() }]
  }

  return {
    messages,
    draft,
    isThinking,
    suggestedQuestions,
    sendMessage,
    clearConversation,
  }
}
