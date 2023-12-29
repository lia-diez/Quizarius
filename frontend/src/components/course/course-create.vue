<script setup lang="ts">

import QCardContainer from "../base/q-card-container.vue";
import QCard from "../base/q-card.vue";
import QCardTitle from "../base/q-card-title.vue";
import QCardText from "../base/q-card-text.vue";
import HttpClient from "../../helpers/httpClient.ts";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const data = ref<{
  name: string,
  description: string,
}> ({name: "", description: ""})

const submit = async () => {
  const {data: res} = await HttpClient.post('api/group/create/', JSON.stringify(data.value));
  console.log(res)
  router.push(`/course/${res.id}`)
}
</script>

<template>
  <q-card-container>
    <q-card>
      <q-card-title>
        <h3>Новий курс</h3>
      </q-card-title>
      <q-card-text>
        <v-text-field variant="solo-filled" label="Назва" v-model="data.name"></v-text-field>
        <v-textarea variant="solo-filled" rows="3" label="Опис" v-model="data.description"></v-textarea>
      </q-card-text>
    </q-card>
    <v-btn class="mt-5" @click="submit">створити</v-btn>
  </q-card-container>
</template>

<style scoped>

</style>