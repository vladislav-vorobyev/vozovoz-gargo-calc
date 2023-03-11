<script lang="ts" setup>
// props
const props = defineProps({
  modelValue: { type: String, required: true },
  disabled: { type: Boolean, default: false },
  min: { type: Number, default: 0.1 },
  max: { type: Number, default: 999 },
  topLabel: { type: String, default: '' },
})

// emits
const emit = defineEmits(['update:modelValue', 'change'])

// state
const mValue = useSyncProps<string>(props, 'modelValue', emit)
// const disabled = useSyncProps<string>(props, 'disabled', emit)
const focused = ref(false)

// input validation
const validateInput = () => {
  let value = parseFloat(mValue.value) || 0
  if (value < props.min) value = props.min
  if (value > props.max) value = props.max
  mValue.value = value.toString()
}
</script>

<template>
  <div class="calc-input">
    <div class="calc-input-label-top">{{ topLabel }}</div>
    <div class="calc-input-wrap" :class="{ focused: focused }">
      <input
        class="form-input form-control"
        type="text"
        ref="input-el"
        :disabled="disabled"
        v-model="mValue"
        @focus="focused = true; this.$refs['input-el'].select()"
        @blur="focused = false"
        @keyup="validateInput"
        @change="$emit('change')"
      />
      <div class="calc-input-label-right"><slot /></div>
    </div>
  </div>
</template>
