<script setup lang="ts">
import QCardTitle from "../base/q-card-title.vue";
import QCard from "../base/q-card.vue";
import QCardText from "../base/q-card-text.vue";
import HttpClient from "../../helpers/httpClient";
import { ref, watch } from "vue";

const props = defineProps<{
    groupId: string
}>()

const requests = ref<{
    id: string,
    userLogin: string,
}[]>()

const getRequests = async () => {
    const { data } = await HttpClient.get(`/api/group/${props.groupId}/requests`)
    requests.value = data as {
        id: string,
        userLogin: string,
    }[]
}

const copyText = () => {
    navigator.clipboard.writeText(`https://quizaruis.pp.ua/invite/${props.groupId}`)
}

const acceptRequest = async (id: string) => {
    await HttpClient.post(`/api/group/requests/accept/${id}`)
    getRequests()
}

const rejectRequest = async (id: string) => {
    await HttpClient.post(`/api/group/requests/reject/${id}`)
    getRequests()
}

getRequests()
watch(() => props.groupId, () => {
    getRequests()
})
</script>

<template>
    <q-card>
        <q-card-title>
            Зала очікування
        </q-card-title>
        <q-card-text class="text-center">
            <v-label>Посилання для запрошення</v-label>
            <v-text-field prepend-inner-icon="$clipboard" @click="copyText" variant="solo-filled" readonly
                density="compact">https://quizaruis.pp.ua/invite/{{ groupId }}</v-text-field>
            <v-label v-if="!requests?.length">Наразі ніхто не очікує на підтвердження запиту</v-label>
            <div>
                <div v-for="request in requests" :key="request.id">
                    <v-label>{{ request.userLogin }}</v-label>
                    <v-btn class="ml-2 mb-1" variant="tonal" color="secondary" icon="$check" elevation="2"
                        density="compact" @click="acceptRequest(request.id)"></v-btn>
                    <v-btn class="ml-2 mb-1" variant="tonal" color="error" icon="$close" elevation="2"
                        density="compact" @click="rejectRequest(request.id)"></v-btn>
                </div>
            </div>
        </q-card-text>
    </q-card>
</template>

<style scoped></style>