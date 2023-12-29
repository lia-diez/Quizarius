<script setup lang="ts">
import { QuizQuestion } from "./types/quiz.ts";
import { computed } from "vue";
import qCard from "../base/q-card.vue";
import qCardTitle from "../base/q-card-title.vue";
import qCardText from "../base/q-card-text.vue";

const props = defineProps<{
  quizItem: QuizQuestion,
  value: Map<string, string[]>,
  attempt?: boolean
  readonly?: boolean
}>()
const emits = defineEmits<{
  (e: 'update:value', value: Map<string, string[]>): void
}>()

const singleValue = computed<string>({
  get(): string {
    return props.value?.get(props.quizItem.id)?.[0] ?? ""
  },
  set(value: string) {
    let map = props.value;
    map.set(props.quizItem.id, [value])
    emits('update:value', map)
  },
})

const multiValue = computed<string[]>({
  get(): string[] {
    return props.value?.get(props.quizItem.id) ?? []
  },
  set(value: string[]) {
    let map = props.value;
    map.set(props.quizItem.id, value)
    emits('update:value', map)
  },
})

</script>

<template>
  <q-card>
    <q-card-title>
      {{ quizItem.value }}
    </q-card-title>
    <v-divider />
    <q-card-text>
      <div v-if="quizItem.isOpen">
        <v-textarea variant="solo-filled" label="Відповідь" :readonly="readonly" hide-details
          v-model="singleValue" :prepend-icon="(quizItem.options?.[0]?.isCorrect ? '$check' : '')"></v-textarea>
        <div v-if="attempt">
          <v-btn class="mt-2 mr-3" variant="tonal" elevation="2" color="secondary" prepend-icon="$check">Правильно</v-btn>
          <v-btn class="mt-2 mr-3" variant="tonal" elevation="2" color="error" prepend-icon="$close">неправильно</v-btn>
        </div>

      </div>
      <div v-else>
        <div v-if="quizItem.isMultiChoice">
          <v-checkbox v-model="multiValue" :readonly="readonly" :class="`mb-n9 ${(q.isCorrect ? 'correct' : '')}`"
            :append-icon="(q.isCorrect ? '$check' : '')" :label="`${index + 1}. ${q.value}`" :value="q.id" color="primary"
            v-for="(q, index) in quizItem.options" />
        </div>
        <v-radio-group v-else v-model="singleValue" class="mb-n7">
          <v-radio color="primary" :label="`${index + 1}. ${q.value}`" :value="q.id" :readonly="readonly"
             :class="`${(q.isCorrect ? 'correct' : '')}`"
            v-for="(q, index) in quizItem.options"></v-radio>
        </v-radio-group>
      </div>
    </q-card-text>
  </q-card>
</template>

<style>
p {
  white-space: break-spaces;
}

.correct {
  color: #56876d !important;
}
</style>