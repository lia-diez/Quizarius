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

getAttempt()

</script>
<template>
    <q-card-container>
        <quiz-item attempt readonly :quiz-item="q" v-model:value="answers" v-for="q in quiz?.questions"></quiz-item>
    </q-card-container>
</template>