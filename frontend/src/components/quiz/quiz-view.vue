<script setup lang="ts">

import { onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import HttpClient from "../../helpers/httpClient.ts";
import QCardContainer from "../base/q-card-container.vue";
import QLoader from "../base/q-loader.vue";
import QInfoView from "./quiz-info-view.vue";
import QuizItem from "./quiz-question-view.vue";
import { Quiz } from "./types/quiz.ts";
import QuizTimer from "./quiz-timer-view.vue";
import { inject } from "vue";
import { accountKey } from "../../inject-keys";
import { ComputedRef } from "vue";

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const failed = ref(false);
const quiz = reactive({} as Quiz);
const allSelected = ref(false);


const { isTeacher } = inject(accountKey) as { isTeacher: ComputedRef<boolean> }

let answers = ref(new Map<string, string[]>())
let attempt = ref<{
  id: string,
  startedAt: Date,
}>({ id: "", startedAt: new Date() })

onMounted(() => {
  getQuiz();
});


function getQuiz() {
  HttpClient.get<Quiz>(`/api/quiz/${route.params.id}`)
    .then((response) => {
      quiz.id = response.data.id;
      quiz.info = response.data.info;
      quiz.questions = response.data.questions;
    })
    .catch((error) => {
      console.log(error);
      failed.value = true;
    })
    .finally(() => {
      loading.value = false;
    });
}


const getAttempt = async () => {
  const { data } = await HttpClient.post(`/api/attempt/create`, JSON.stringify({ quizId: quiz.id }));
  attempt.value = {
    id: data.id,
    startedAt: new Date(data.startedAt),
  }
}

const createAttempt = () => {
  if (isTeacher && quiz.id)
    getAttempt()
}

watch(quiz, () => {
  createAttempt()
}, { immediate: true })

watch(isTeacher, () => {
  createAttempt()
}, { immediate: true })

watch(answers, () => {
  allSelected.value = validate();
}, { deep: true });

const validate = (): boolean => {
  return quiz.questions.every((item) => {
    return (answers.value.get(item.id)?.length ?? 0) > 0;
  });
}

const submit = (): void => {
  allSelected.value = validate();
  const answersRequest = [];
  for (const [key, value] of answers.value) {
    answersRequest.push({
      questionId: key,
      options: value,
    });
  }
  const payload = {
    attemptId: attempt.value.id,
    answers: answersRequest,
  };
  HttpClient.post(`/api/attempt/submit`, JSON.stringify(payload));
  router.back();
}

</script>

<template>
  <q-loader :loading="loading" :failed="failed">
    <q-card-container>
      <q-info-view class="mb-2" :quizInfo="quiz.info"></q-info-view>
      <quiz-timer v-if="!isTeacher && (!!quiz.info.timeLimitMinutes || !!quiz.info.timeLimitHours)"
        :start-time="attempt.startedAt" :time-limit-hours="quiz.info.timeLimitHours"
        :time-limit-minutes="quiz.info.timeLimitMinutes"></quiz-timer>
      <quiz-item :quiz-item="q" v-model:value="answers" v-for="q in quiz.questions"></quiz-item>
      <v-btn v-if="!isTeacher" :disabled="!allSelected" @click="submit" :color="allSelected ? 'primary' : 'error'"
        class="quiz-btn ma-5 pa-3">
        {{ allSelected ? 'Завершити' : 'Не всі відповіді' }}
      </v-btn>
      <v-btn v-else class="quiz-btn ma-5 pa-3" @click="router.back()">
        Назад
      </v-btn>
    </q-card-container>
  </q-loader>

</template>

<style scoped></style>