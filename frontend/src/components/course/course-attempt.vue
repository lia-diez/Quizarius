<script setup lang="ts">
import { computed, ref } from 'vue';
import HttpClient from '../../helpers/httpClient';
import { useDate } from 'vuetify';

const dateProvider = useDate()
dateProvider.locale = 'uk'
const props = defineProps<{
    groupId: string,
    studentId: string,
    result?: boolean
}>()

const type = props.result ? 'result' : 'attempt'

const attempts = ref<{
    id: string,
    quizName: string
    quizId: string
    finishedAt: Date
    grade: number
    maxGrade: number
}[]>()

const getAttempts = async () => {
    let url = `/api/attempt/group/${props.groupId}/student/${props.studentId}`
    if (props.result) {
        url += '?result=true'
    }
    let { data } = await HttpClient.get(url)
    attempts.value = data.map((x: any) => ({
        id: x.attempt.id,
        quizName: x.quiz.info.name,
        quizId: x.quiz.id,
        finishedAt: x.attempt.finishedAt,
        grade: x.grade,
        maxGrade: x.quiz.info.questionCount
    })) as {
        id: string,
        quizName: string
        quizId: string
        finishedAt: Date
        grade: number
        maxGrade: number
    }[]
}
getAttempts()

const attemptsByQuiz = computed(
    () => {
        const hashMap = new Map<string, {
            id: string,
            quizName: string,
            quizId: string,
            finishedAt: Date
            grade: number
            maxGrade: number
        }[]>()
        attempts.value?.forEach((x) => {
            if (!hashMap.has(x.quizId)) {
                hashMap.set(x.quizId, [])
            }
            hashMap.get(x.quizId)?.push(x)
        })
        const res = hashMap.values();
        return res;

    }
)
</script>

<template>
    <v-expansion-panels variant="popout">
        <v-expansion-panel v-for="quiz in attemptsByQuiz" :title="quiz[0]?.quizName">
            <v-expansion-panel-text>
                <v-card v-for="attempt in quiz" class="mb-2">
                    <v-card-text>
                        <div class="d-flex justify-space-between">
                            <v-label>Спроба за {{ dateProvider.format(attempt.finishedAt, 'fullDateWithWeekday')}}</v-label>
                            <router-link :to="`/${type}/${attempt.id}`">
                                <v-btn v-if="!result" color="warning" density="compact" variant="tonal" elevation="2">Перевірити</v-btn>
                                <v-btn v-else color="secondary" density="compact" variant="tonal" elevation="2">Результат : {{` ${attempt.grade}/${attempt.maxGrade}` }}</v-btn>
                            </router-link>
                        </div>
                    </v-card-text>
                </v-card>
            </v-expansion-panel-text>
        </v-expansion-panel>
        <v-label v-if="!attempts?.length">Немає спроб</v-label>
    </v-expansion-panels>
</template>