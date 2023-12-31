<script setup lang="ts">
import QCard from "../base/q-card.vue";
import QCardTitle from "../base/q-card-title.vue";
import QCardText from "../base/q-card-text.vue";
import DatePickerPopup from "./date-picker-popup.vue";
import { reactive, ref, watch } from "vue";
import QCounter from "../base/q-counter.vue";
import { createQuizInfo } from "./types.ts";
import { useRouter } from "vue-router";

import HttpClient from "../../helpers/httpClient";

const router = useRouter();

const props = defineProps<{
  value: createQuizInfo
}>();

const emits = defineEmits<
  {
    (e: 'update:value', value: createQuizInfo): createQuizInfo
  }>()

const cources = ref<{ name: string, id: string }[]>()



const getGroups = async () => {
  const { data } = await HttpClient.get('api/group/')
  cources.value = []
  const res = data as {
    id: string
    name: string
  }[]
  res.push({
    id: 'new',
    name: 'Створити новий'
  })
  res.forEach((item) => {
    cources.value?.push({
      name: item.name,
      id: item.id
    })
  })
}

getGroups()

const quizInfo = reactive<createQuizInfo>(props.value)
watch(quizInfo, (value) => {
  if (value.groupId === 'new') {
    router.push('/course/create')
  }
})
watch(quizInfo, (value) => { emits('update:value', value) })

</script>

<template>
  <q-card>
    <q-card-title>
      <h3>Новий тест</h3>
    </q-card-title>
    <q-card-text>
      <v-text-field label="Назва" variant="solo-filled" hide-details v-model="quizInfo.name"></v-text-field>
      <date-picker-popup class="mt-4" v-model:value="quizInfo.deadLine">
      </date-picker-popup>
      <v-select variant="solo-filled" class="mt-4" label="Курс" v-model="quizInfo.groupId" :items="cources"
        item-title="name" item-value="id">
        <template v-slot:item="{ props, item }">
          <v-list-item v-bind="props" :title="item.raw.name" :value="item.raw.id"></v-list-item>
        </template>
      </v-select>
      <div class="d-flex flex-row flex-wrap">
        <v-switch class="flex-row ml-2" label="  Обмеження по кількості спроб" color="secondary" density="compact"
          v-model="quizInfo.hasRetries" hide-details></v-switch>
        <transition name="fade">
          <q-counter v-if="quizInfo.hasRetries" :min-value="1" :max-value="99"
            v-model:value="quizInfo.retries"></q-counter>
        </transition>
      </div>
      <div class="d-flex flex-row flex-wrap ml-2">
        <v-switch class="flex-row" label="  Обмеження по часу" color="secondary" density="compact"
          v-model="quizInfo.hasTimeLimit" hide-details></v-switch>
        <transition-group name="fade">
          <q-counter class="mr-2" suffix="год." v-if="quizInfo.hasTimeLimit" :min-value="0" :max-value="23"
            v-model:value="quizInfo.timeLimitHours"></q-counter>
          <q-counter suffix="хв." v-if="quizInfo.hasTimeLimit" :min-value="0" :max-value="55"
            v-model:value="quizInfo.timeLimitMinutes" :step="5"></q-counter>
        </transition-group>
      </div>
      <div class="d-flex flex-row flex-wrap ml-2">
        <v-switch class="flex-row" label="Перегляд відповідей" color="secondary" density="compact"
          v-model="quizInfo.isViewAnswers" hide-details></v-switch>
      </div>
    </q-card-text>
  </q-card>
</template>

<style scoped>
.number {
  max-width: 75px;
}

.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-100px);
}
</style>