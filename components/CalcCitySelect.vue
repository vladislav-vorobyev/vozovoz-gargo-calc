<script lang="ts" setup>
import { PropType } from 'vue'
const { $api } = useNuxtApp()

// props
const props = defineProps({
  modelValue: { type: String, required: true },
  list: { type: Array as PropType<any>, required: true },
  location: { type: String, required: true },
  locationValues: { type: Array as PropType<any>, required: true },
  disabled: { type: Boolean, default: false },
})

// emits
const emit = defineEmits(['update:modelValue', 'update:location', 'change'])

// state
const mValue = useSyncProps<string>(props, 'modelValue', emit)
const mLocation = useSyncProps<string>(props, 'location', emit)

const loading = ref(false)
const customList = ref([])
const cities = computed({
  get() {
    if (customList.value.length) return customList.value
    else return props.list
  },
  set(value) {
    // emit(`update:list`, value)
  },
})

// terminal option behavior
let _termminalDisabled = ref(false)
const termminalDisabled = computed({
  get() {
    return props.disabled || _termminalDisabled.value
  },
  set(value) {
    _termminalDisabled.value = value
    if (value) {
      // reset option value
      mLocation.value = props.locationValues[0]?.sid
    }
  },
})

// get selected city item
const getCurrentCity = () => {
  for (let index = 0; index < cities.value.length; index++) {
    const item = cities.value[index]
    if (item.guid === mValue.value) return item
  }
  return null
}

// city on change
const cityOnChange = () => {
  // wait mValue update
  setTimeout(() => {
    const item = getCurrentCity()
    console.log('current city:', mValue.value, item)
    // disable teminal option if no terminals in selected city
    termminalDisabled.value = !(item.default_terminal?.length || item.default_terminal?.guid)
    // pass change event to parent
    emit('change')
  }, 0)
}

// city search
const _query = ref('')
const searchCity = async (query: string) => {
  if (query.length) {
    _query.value = query
    loading.value = true
    try {
      const { data } = await $api.getLocation(0, 100, query)
      if (_query.value == query) {
        console.log(data)
        if (data?.response?.data?.length) {
          customList.value = data.response.data
        }
      } else {
        console.log(data, 'skipped')
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }
}

// city description
const descriptionText = (item: any) => {
  return item.region_str ?? item.region_s
}
</script>

<template>
  <div class="calc-select-wrap">
    <el-select
      size="large"
      :teleported="false"
      v-model="mValue"
      filterable
      remote
      :remote-method="searchCity"
      :loading="loading"
      :disabled="disabled"
      @change="cityOnChange"
    >
      <el-option class="calc-select" v-for="item in cities" :key="item.guid" :label="item.name" :value="item.guid">
        <span class="calc-select-item-name">{{ item.name }} {{ item.type }}</span>
        <span class="calc-select-item-description">{{ descriptionText(item) }}</span>
      </el-option>
    </el-select>
  </div>
  <el-radio-group class="calc-location" v-model="mLocation" :disabled="termminalDisabled" @change="$emit('change')">
    <el-radio v-for="item in locationValues" :label="item.id" size="large">{{ item.name }}</el-radio>
  </el-radio-group>
</template>
