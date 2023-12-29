<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import QCardContainer from "../base/q-card-container.vue";
import QCard from "../base/q-card.vue";
import QCardTitle from "../base/q-card-title.vue";
import QCardText from "../base/q-card-text.vue";
import HttpClient from "../../helpers/httpClient.ts";
import { ref } from "vue";

const router = useRouter()
const route = useRoute()

const group = ref<{
  name: string,
  description: string,
}>({ name: "", description: "" })

const getGroup = async () => {
  const { data } = await HttpClient.get(`api/group/${route.params.id}`)
  group.value = data as {
    name: string,
    description: string,
  }
}

const submit = async () => {
  await HttpClient.post(`api/group/join/${route.params.id}`)
  router.back()
}

getGroup()
</script>

<template>
  <q-card-container>
    <q-card>
      <q-card-title>
        <h3>Курс: {{ group.name }}</h3>
      </q-card-title>
      <q-card-text>
        <p>{{ group.description }}</p>
        <v-btn class="mt-5" @click="submit">Відправити запит</v-btn>
      </q-card-text>
    </q-card>
  </q-card-container>
</template>

<style scoped></style>