<script setup lang="ts">
import {computed} from "vue";

const props = defineProps<{
  minValue: number;
  maxValue: number;
  step?: number;
  suffix?: string;
  value: number
}>();

const emits = defineEmits<{
  (e: 'update:value', value: number): number
}>();

const counter = computed<number>(
    {
      get(): number {
        return props.value;
      },
      set(newValue: number): void {
        emits('update:value', newValue)
      }
    }
)


</script>

<template>
  <div class="d-flex flex-row align-center">
    <v-btn icon="$minus" class="" color="error" density="compact" variant="tonal" elevation="2"
           @click="counter-=(step ?? 1)"
           :disabled="counter <= minValue"></v-btn>
    <v-label class="mr-2 ml-2 text-h6"><b>{{ `${counter} ${suffix ?? ''}` }}</b></v-label>
    <v-btn icon="$plus" class="" color="secondary" density="compact" variant="tonal" elevation="2"
           @click="counter+=(step ?? 1)" :disabled="counter>=maxValue"></v-btn>
  </div>
</template>

<style scoped>

</style>