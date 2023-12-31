<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import HttpClient from '../../helpers/httpClient';
import { Quiz } from './types/quiz';
import QuizItem from './quiz-question-view.vue';
import QCardContainer from '../base/q-card-container.vue';

const route = useRoute()
const attempt = ref<{
    id: string,
    answers: {
        questionId: string,
        options?: string[],
    }[],
}>()

const isResult = route.matched[0].path === '/result/:id'

let answers = ref(new Map<string, string[]>())
let quiz = ref<Quiz | null>(null);

const getAttempt = async () => {
    const { data } = await HttpClient.get(`/api/attempt/${route.params.id}`)
    attempt.value = data.attempt as {
        id: string,
        answers: {
            questionId: string,
            options?: string[],
        }[],
    }
    quiz.value = data.quiz as Quiz
    if (attempt.value.answers) {
        answers.value = new Map(attempt.value.answers.map(x => [x.questionId, x.options ?? []]))
    }
}

const verify = async (questionId: string) => {
    await HttpClient.post(`/api/attempt/${route.params.id}/question/${questionId}/verify`)
    await getAttempt()
}

const reject = async (questionId: string) => {
    await HttpClient.post(`/api/attempt/${route.params.id}/question/${questionId}/decline`)
    await getAttempt()
}

getAttempt()

</script>
<template>
    <q-card-container>
        <quiz-item :attempt="!isResult" readonly :quiz-item="q" v-model:value="answers" v-for="q in quiz?.questions"
            @verify="verify(q.id)"
            @reject="reject(q.id)"></quiz-item>
    </q-card-container>
</template>