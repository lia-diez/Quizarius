<script setup lang="ts">

import QCard from "../base/q-card.vue";
import { reactive, watch } from "vue";
import { createQuizQuestion } from "./types.ts";
import { nanoid } from 'nanoid'

const props = defineProps<{
  value: createQuizQuestion
}>()

const emits = defineEmits<{
  (e: 'update:value', value: createQuizQuestion): void
  (e: 'del'): void
}>()

const question = reactive<createQuizQuestion>(props.value)
watch(question, (value) => emits('update:value', value))
const addOption = () => {
  question.options?.push({ correct: false, qid: nanoid() })
}
const deleteOption = (index: number) => {
  if (question.options)
    question.options.splice(index, 1)
}

const deleteQuestion = () => {
  emits('del')
}
</script>

<template>
  <q-card>
    <div class="d-flex mt-2 ml-2 mr-2">
      <v-text-field v-model="question.value" class="mr-4" variant="solo-filled" label="Нове питання"
        hide-details></v-text-field>
      <v-btn icon="$delete" color="error" variant="tonal" elevation="2" class="mt-1" @click="deleteQuestion"></v-btn>
    </div>
    <v-switch class="ml-2" v-model="question.isOpen" label="  Питання з відкритою відповіддю" color="secondary"
      hide-details></v-switch>
    <transition name="fade">
      <div v-if="!question.isOpen">
        <transition-group name="fade">
          <div class="d-flex mb-2" v-for="(opt, index) in question.options" :key="opt.qid">
            <v-checkbox v-model="opt.correct" hide-details>
            </v-checkbox>
            <v-text-field class="w-100 ml-2 mr-2" :label="`Варіант ${index + 1}`" v-model="opt.value" density="compact"
              variant="solo-filled" :bg-color="opt.correct ? 'secondary' : ''" clearable persistent-clear
              @click:clear="deleteOption(index)" hide-details>
            </v-text-field>
          </div>
          <div class="d-flex justify-center">
            <v-btn icon="$plus" class="" color="secondary" density="compact" v-if="!question.isOpen" @click="addOption"
              variant="tonal" elevation="2"></v-btn>
          </div>
        </transition-group>
      </div>
    </transition>
  </q-card>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  max-height: 100vh;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
  max-height: 0px;
}
</style>