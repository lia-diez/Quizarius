<script setup lang="ts">
import { computed } from 'vue';
import { ref } from 'vue';

const start = new Date();
const current = ref<Date>( new Date());

const time = computed(() => {
    const mils = current.value.getTime() - start.getTime();
    const hours = Math.floor(mils / 1000 / 60 / 60);
    const minutes = Math.floor(mils / 1000 / 60) % 60;
    const seconds = Math.floor(mils / 1000) % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

const update = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    current.value = new Date();
    update();
}

update();
</script>

<template>
<v-label>{{ time}}</v-label>
</template>

<style scoped>

</style>