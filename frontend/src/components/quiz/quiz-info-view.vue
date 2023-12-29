<script setup lang="ts">
import {QuizInfo} from "./types/quiz.ts";
import qCardTitle from '../base/q-card-title.vue';
import qCard from '../base/q-card.vue';
import qCardText from '../base/q-card-text.vue';
import qChip from '../base/q-chip.vue';
import qChipContainer from '../base/q-chip-container.vue';
import {useDate} from "vuetify";
import { ref } from "vue";
import HttpClient from "../../helpers/httpClient";

const props = defineProps<{
  additionalInfo?: boolean,
  noCourse?: boolean,
  quizInfo: QuizInfo
}>()

const dateAdapter = useDate()
dateAdapter.locale = 'uk-ua'

const getRetryColor = (retries: number | null) => {
  if (retries === 0) {
    return "error"
  } else if (retries === 1) {
    return "warning"
  } else {
    return "primary"
  }
}

const group = ref<{
  name: string,
  ownerLogin: string,
}> ({name: "", ownerLogin: ""})

const getGroup = async () => {
  const {data} = await HttpClient.get(`api/group/${props.quizInfo.groupId}`)
  group.value = data as {
    name: string,
    ownerLogin: string,
  }
}

getGroup()

const getTimeLimit = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}
</script>

<template>
  <q-card>
    <q-card-title>
      {{ quizInfo.name }}
    </q-card-title>
    <v-divider/>
    <q-card-text>
      <router-link :to="`/course/${quizInfo.groupId}`">
        <v-label v-if="!noCourse">Курс: <u class="pointer">
          {{ group.name }}
        </u></v-label>
      </router-link>
      <q-chip-container>
        <v-label>Автор:
          {{ group.ownerLogin  }}
        </v-label>
      </q-chip-container>
      <q-chip-container v-if="additionalInfo">
        <q-chip class="ma-2" color="primary">
          Завдань: {{ quizInfo.questionCount }}
        </q-chip>
        <q-chip class="ma-2" v-if="quizInfo.deadLine" icon="$calendar" color="primary">
          {{ dateAdapter.format(quizInfo.deadLine, 'shortDate') }}
        </q-chip>
        <q-chip v-if="quizInfo.timeLimitHours || quizInfo.timeLimitMinutes" class="ma-2" icon="$timerSand" color="primary">
          {{ getTimeLimit(quizInfo.timeLimitHours, quizInfo.timeLimitMinutes) }}
        </q-chip>
        <q-chip class="ma-2" v-if="quizInfo.retries" icon="$refresh" :color="getRetryColor(quizInfo.retries)">
          {{quizInfo.retries}}
        </q-chip>
        <router-link class="ma-2" v-if="additionalInfo" :to="`/quiz/${quizInfo.id}`">
          <q-chip btn variant="flat" color="primary" class="pointer">
            Виконати
          </q-chip>
        </router-link>
      </q-chip-container>
    </q-card-text>
  </q-card>
</template>

<style scoped>

</style>