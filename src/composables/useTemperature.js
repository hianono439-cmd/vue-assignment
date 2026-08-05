import { computed, toValue } from 'vue'
import { useConfigStore } from '../stores/configStore'

export const useTemperature = (temperatureSource) => {
  const configStore = useConfigStore()

  // 화면마다 반복되는 섭씨·화씨 변환을 하나의 computed 값으로 관리한다.
  const displayTemp = computed(() => {
    const rawTemp = Number(toValue(temperatureSource))

    if (!Number.isFinite(rawTemp)) {
      return '—'
    }

    if (configStore.unit === 'fahrenheit') {
      return Math.round((rawTemp * 9) / 5 + 32)
    }

    return rawTemp
  })

  const unitSymbol = computed(() => configStore.unitSymbol)

  return {
    displayTemp,
    unitSymbol,
  }
}
