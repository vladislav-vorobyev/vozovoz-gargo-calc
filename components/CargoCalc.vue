<script lang="ts" setup>
const { $api } = useNuxtApp()

// load cities
const getData = async () => {
  disabled.value = true
  try {
    const { data } = await $api.getLocation(0, 200)
    console.log(data)
    if (data?.response?.data?.length) {
      cities.value = data.response.data
      cityFrom.value = cities.value[0]?.guid
      cityTo.value = cities.value[1]?.guid
    }
  } catch (e) {
    console.log(e)
  } finally {
    disabled.value = false
  }
}

// calculate the price
const getPrice = async () => {
  disabled.value = true
  try {
    const volume = parseFloat(calcVolume.value)
    const weight = parseFloat(calcWeight.value)
    const fromTerminal = locationFrom.value === 'terminal'
    const toTerminal = locationTo.value === 'terminal'
    const { data } = await $api.getPrice(volume, weight, cityFrom.value, fromTerminal, cityTo.value, toTerminal)
    console.log(data)
    if (data?.response?.price) {
      price.value = data.response.price
      basePrice.value = data.response.basePrice
    }
  } catch (e) {
    console.log(e)
  } finally {
    disabled.value = false
  }
}

// swap locations
const doSwap = () => {
  ;[cityFrom.value, cityTo.value, locationFrom.value, locationTo.value] =
    // eslint-disable-next-line prettier/prettier
    [cityTo.value, cityFrom.value, locationTo.value, locationFrom.value]
  // update price
  getPrice()
}

// form fields
const cityFrom = ref('-1')
const locationFrom = ref('terminal')
const cityTo = ref('-1')
const locationTo = ref('terminal')
const calcWeight = ref('0.1')
const calcVolume = ref('0.1')

// state
const disabled = ref(false)
const cities = ref([{ guid: '-1', name: 'загрузка...' }])
const price = ref(0)
const basePrice = ref(0)

onMounted(async () => {
  /* const { data } = await $api.getVersion()
  console.log('version', data) */
  await getData()
  await getPrice()
})
</script>

<template>
  <div class="content">
    <div class="info">
      <slot />
    </div>
    <div class="cargo">
      <div class="cargo-calc">
        <div class="calc-title">Рассчитать</div>
        <div class="calc-body">
          <div class="calc-road">
            <div class="calc-road-from calc-road-col">
              <ClientOnly>
                <CalcCitySelect v-model="cityFrom" :disabled="disabled" :list="cities" @change="getPrice" />
              </ClientOnly>
              <el-radio-group v-model="locationFrom" :disabled="disabled" class="calc-location" @change="getPrice">
                <el-radio label="address" size="large">От адреса</el-radio>
                <el-radio label="terminal" size="large">От терминала</el-radio>
              </el-radio-group>
            </div>
            <div class="calc-city-swap">
              <el-button text :disabled="disabled" @click="doSwap"
                ><img src="@/assets/images/swap_horiz.svg"
              /></el-button>
            </div>
            <div class="calc-road-to calc-road-col">
              <ClientOnly>
                <CalcCitySelect v-model="cityTo" :disabled="disabled" :list="cities" @change="getPrice" />
              </ClientOnly>
              <el-radio-group v-model="locationTo" :disabled="disabled" class="calc-location" @change="getPrice">
                <el-radio label="address" size="large">До адреса</el-radio>
                <el-radio label="terminal" size="large">До терминала</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="calc-stats">
            <div class="calc-road-col">
              <CalcInput
                v-model="calcWeight"
                :disabled="disabled"
                :min="0.1"
                :max="19999"
                top-label="Вес"
                @change="getPrice"
                >кг</CalcInput
              >
            </div>
            <div class="calc-road-col">
              <CalcInput
                v-model="calcVolume"
                :disabled="disabled"
                :min="0.01"
                :max="74"
                top-label="Объем"
                @change="getPrice"
              >
                м<sup>3</sup>
              </CalcInput>
            </div>
          </div>
        </div>
      </div>
      <div class="calc-result-block" v-loading="disabled">
        <div class="calc-result-block--total-cost">
          <span>{{ price }}</span>
          <span> ₽</span>
        </div>
        <div class="calc-result-block--base-cost">
          <span>{{ basePrice }}</span>
          <span> ₽</span>
        </div>
      </div>
    </div>
  </div>
</template>
