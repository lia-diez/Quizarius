<script setup lang="ts">
import qCardContainer from '../base/q-card-container.vue';
import qCard from '../base/q-card.vue';
import qCardTitle from '../base/q-card-title.vue';
import qCardText from '../base/q-card-text.vue';
import { ref } from 'vue';
import HttpClient from '../../helpers/httpClient';
import qLoader from '../base/q-loader.vue';

const loading = ref<boolean>(true)
const groups = ref<{
    id: string,
    name: string,
    description: string,
}[]>([])

const getGroups = async () => {
    const { data } = await HttpClient.get('/api/group');
    groups.value = data as {
        id: string,
        name: string,
        description: string,
    }[];
}
getGroups().finally(() => {
    loading.value = false
})
</script>

<template>
    <q-loader :loading="loading">
        <RouterLink v-if="groups?.length ?? 0 > 1" :to="`course/${group.id}`" v-for="group in groups">
            <q-card-container>
                <q-card>
                    <q-card-title>
                        <h3>Курс: {{ group.name }}</h3>
                    </q-card-title>
                    <q-card-text>
                        <p>{{ group.description }}</p>
                    </q-card-text>
                </q-card>
            </q-card-container>
        </RouterLink>
        <div v-else class="w-100 h-100 d-flex justify-center align-center">
            <q-card>
                <q-card-title>
                    <h2>Курсів немає</h2>
                </q-card-title>
                <v-divider></v-divider>
                <q-card-text>
                    <h3>Запитайте у вашого викладача посилання на курс</h3>
                    <v-label>... або відпочивайте</v-label>
                </q-card-text>
            </q-card>
        </div>
    </q-loader>
</template>

