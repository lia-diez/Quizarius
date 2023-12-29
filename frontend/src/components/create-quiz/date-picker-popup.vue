<script setup lang="ts">
import {useDate} from 'vuetify'

import {computed, ref} from "vue";
import QChip from "../base/q-chip.vue";

const dialog = ref(false)
const adapter = useDate()
const props = defineProps<{
  value: Date | null
}>()
const emits = defineEmits<{
  (e: 'update:value', value: Date | null): void
}>()

const selectedDate = computed<Date | null>({
  get(): Date | null {
    return props.value
  },
  set(value: Date | null) {
    emits('update:value', value)
  },
});
</script>

<template>
  <q-chip
      class="pointer"
      color="secondary"
  >
    {{ (selectedDate === null ? 'Дедлайн' : adapter.toISO(selectedDate)) }}
    <v-dialog
        v-model="dialog"
        activator="parent"
        width="auto"
    >
      <v-date-picker v-model="selectedDate" color="primary" header="Дедлайн" >
      </v-date-picker>
    </v-dialog>
  </q-chip>
</template>

<style scoped>

</style>