<script lang="ts" setup>
import { PropType } from 'vue'
const { $api } = useNuxtApp()

// props
const props = defineProps({
  modelValue: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  list: { type: Array as PropType<any>, required: true },
})

// emits
const emit = defineEmits(['update:modelValue', 'change'])

// state
const modelValue = useSyncProps<string>(props, 'modelValue', emit)

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

// city search
const searchCity = async (query: string) => {
  loading.value = true
  try {
    const { data } = await $api.getLocation(0, 100, query)
    console.log(data)
    if (data?.response?.data?.length) {
      customList.value = data.response.data
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
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
      v-model="modelValue"
      filterable
      remote
      :remote-method="searchCity"
      :loading="loading"
      :disabled="disabled"
      @change="$emit('change')"
    >
      <el-option class="calc-select" v-for="item in cities" :key="item.guid" :label="item.name" :value="item.guid">
        <span class="calc-select-item-name">{{ item.name }} {{ item.type }}</span>
        <span class="calc-select-item-description">{{ descriptionText(item) }}</span>
      </el-option>
    </el-select>
  </div>
</template>
