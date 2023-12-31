<script setup lang="ts">
import QCardTitle from "../base/q-card-title.vue";
import QCard from "../base/q-card.vue";
import QCardText from "../base/q-card-text.vue";
import HttpClient from "../../helpers/httpClient";
import courseAttempt from "./course-attempt.vue";
import { ComputedRef, inject, ref, watch } from "vue";
import { accountKey } from "../../inject-keys";

const props = defineProps<{
    groupId: string
}>()

const { isTeacher } = inject(accountKey) as { isTeacher: ComputedRef<boolean> }
    
const members = ref<{
    id: string,
    login: string,
}[]>()

const getMembers = async () => {
    const { data } = await HttpClient.get(`/api/group/${props.groupId}/members`)
    members.value = data as {
        id: string,
        login: string,
    }[]
}
getMembers()
watch(() => props.groupId, () => {
    getMembers()
})
</script>

<template>
    <q-card>
        <q-card-title>
            Користувачі
        </q-card-title>
        <q-card-text>
            <v-label v-if="!members?.length">Наразі ніхто не входить до групи</v-label>
            <v-label v-if="isTeacher && members?.length"> Неперевірені спроби</v-label>
            <div v-if="isTeacher">
                <v-expansion-panels>
                    <v-expansion-panel  v-for="member in members" :title="member.login" icon="mdi-account">
                        <v-expansion-panel-text>
                            <course-attempt :groupId="props.groupId" :studentId="member.id"></course-attempt>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
            <v-label class="mt-3" v-if="members?.length">Результати проходження тестів</v-label>
            <v-expansion-panels>
                    <v-expansion-panel  v-for="member in members" :title="member.login" icon="mdi-account">
                        <v-expansion-panel-text>
                            <course-attempt :groupId="props.groupId" :studentId="member.id" result></course-attempt>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
        </q-card-text>
    </q-card>
</template>

<style scoped></style>