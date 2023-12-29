<script setup lang="ts">
import { ref } from "vue";
import HttpClient from "../../helpers/httpClient.ts";
import qCardContainer from '../base/q-card-container.vue';
import qCard from '../base/q-card.vue';
import qCardTitle from '../base/q-card-title.vue';
import qCardText from '../base/q-card-text.vue';
import quizInfoView from './quiz-info-view.vue';
import { QuizInfo } from "./types/quiz.ts";
import QLoader from "../base/q-loader.vue";

const props = defineProps<{
  groupId?: string
  noAlert?: boolean
}>()

const loading = ref<boolean>(true)
const quizList = ref<QuizInfo[]>([]);

loadQuizzes().finally(() => {
  loading.value = false;
});
async function loadQuizzes() {
  const url = '/api/quiz' + (props.groupId ? `/group/${props.groupId}` : '');
  const { data } = await HttpClient.get<QuizInfo[]>(url);
  quizList.value = data as QuizInfo[];
  quizList.value = quizList.value.filter((x) => x.retries !== 0);
  quizList.value.sort((a, b) => {
    return new Date(b.deadLine).getTime() - new Date(a.deadLine).getTime();
  });
}
</script>

<template>
  <q-loader :loading="loading">
    <q-card-container v-if="quizList?.length ?? 0 < 1">
      <quiz-info-view additional-info :quizInfo="quiz" v-for="quiz in quizList" />
    </q-card-container>
    <div v-else-if="!noAlert" class="w-100 h-100 d-flex justify-center align-center">
      <q-card>
        <q-card-title>
          <h2>Тестів немає</h2>
        </q-card-title>
        <v-divider></v-divider>
        <q-card-text>
          <h3>Наразі у вас немає тестів.</h3>
          <v-label>Відпочивайте</v-label>
        </q-card-text>
      </q-card>
    </div>
  </q-loader>
</template>

<style scoped></style>