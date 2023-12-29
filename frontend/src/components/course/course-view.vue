<script setup lang="ts">
import { ComputedRef, inject, ref } from "vue";
import { useRoute } from "vue-router";
import HttpClient from "../../helpers/httpClient";
import qCardContainer from "../base/q-card-container.vue";
import qCardText from "../base/q-card-text.vue";
import qCardTitle from "../base/q-card-title.vue";
import qCard from "../base/q-card.vue";
import courseMembersView from "./course-members-view.vue";
import courseRequstView from "./course-request-view.vue";
import quizListView from "../quiz/quiz-list-view.vue";
import { accountKey } from "../../inject-keys";
import QLoader from "../base/q-loader.vue";

const loading = ref<boolean>(true)
const route = useRoute()
const group = ref<{
    id: string,
    name: string,
    description: string,
}>({ id: "", name: "", description: "" })
const { isTeacher } = inject(accountKey) as { isTeacher: ComputedRef<boolean> }
const getGroup = async () => {
    const { data } = await HttpClient.get(`/api/group/${route.params.id}`)
    group.value = data as {
        id: string,
        name: string,
        description: string,
    }

}

getGroup().finally(() => {
    loading.value = false
})

</script>

<template>
    <q-loader :loading="loading">
        <q-card-container>
            <q-card>
                <q-card-title>
                    <h3>Курс: {{ group.name }}</h3>
                </q-card-title>
                <q-card-text>
                    <p>{{ group.description }}</p>
                </q-card-text>
            </q-card>
            <course-requst-view v-if="isTeacher" :group-id="group.id"></course-requst-view>
            <course-members-view :group-id="group.id"></course-members-view>
            <q-card>
                <q-card-title class="d-flex justify-center">
                    <h3>Тести</h3>
                </q-card-title>
            </q-card>
        </q-card-container>
        <quiz-list-view :group-id="group.id" no-alert></quiz-list-view>
    </q-loader>
</template>

<style scoped></style>