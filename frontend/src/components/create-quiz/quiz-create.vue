<script setup lang="ts">
import { nanoid } from 'nanoid';
import { reactive } from "vue";
import { useRouter } from "vue-router";
import HttpClient from "../../helpers/httpClient";
import QCardContainer from "../base/q-card-container.vue";
import QuizCreateInfo from "./quiz-create-info.vue";
import QuizQuestionCreate from "./quiz-question-create.vue";
import { createQuiz } from "./types.ts";

const quiz = reactive<createQuiz>({
  info: {
    hasRetries: false,
    hasTimeLimit: false,
    deadLine: null,
    groupId: null,
    retries: 1,
    timeLimitHours: 0,
    timeLimitMinutes: 5,
    name: null
  },
  questions: []
})
const router = useRouter()
const deleteQuestion = (index: number) => {
  quiz.questions.splice(index, 1)
}

const addQuestion = () => {
  quiz.questions.splice(quiz.questions.length, 0, { value: { isOpen: false, options: [], qid: nanoid() } })
} 

const submit = async () => {
  const { data } = await HttpClient.post<{ id: string }>(`${import.meta.env.VITE_BACKEND_HOST}/api/quiz/create/`, JSON.stringify(quiz))
  const { id } = data as { id: string }
  await router.push(`/quiz/${id}`)
}
</script>

<template>
  <q-card-container>
    <quiz-create-info v-model:value="quiz.info">
    </quiz-create-info>
    <transition-group name="fade">
      <quiz-question-create  v-model:value="question.value" v-for="(question, index) in quiz.questions"
        :key="question.value.qid" @del="deleteQuestion(index)">
      </quiz-question-create>
      <v-btn prepend-icon="$plus"  class=" mt-3" color="secondary" variant="tonal" elevation="2" @click="addQuestion">Додати питання</v-btn>
    <v-btn class="quiz-btn mt-5" @click="submit">Опублікувати</v-btn>
    </transition-group>
    <!--    <p style="color: green">{{ JSON.stringify(quiz, null, 2) }}</p>-->
  </q-card-container>
</template>

<style scoped>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(30px, 0);
}

.fade-leave-active {
  position: absolute;
}
</style>