<script setup lang="ts">
import qCardText from './base/q-card-text.vue';
import qCardTitle from './base/q-card-title.vue';
import qCard from './base/q-card.vue';

</script>

<template>
    <div class="w-100 h-100 d-flex justify-center align-center">
        <q-card>
            <q-card-title>
                <h2>Про сайт</h2>
            </q-card-title>
            <v-divider></v-divider>
            <q-card-text>
                <h3>Даний сайт є курсовою роботою студентки групи ІП-01 <b>Головач Варвари Олександрівни</b><br><a href="mailto:support@quizarius.pp.ua"><u>support@quizarius.pp.ua</u></a> </h3>
                
            </q-card-text>
        </q-card>
    </div>
</template>
