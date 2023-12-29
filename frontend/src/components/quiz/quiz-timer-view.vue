<script setup lang="ts">
import { computed } from 'vue';
import { ref } from 'vue';
import QChip from '../base/q-chip.vue';

const props = defineProps<{
    startTime: Date
    timeLimitHours: number
    timeLimitMinutes: number
}>()

const currentTime = ref<Date>(new Date())

const updateTime = async () => {
    setInterval(() => {
        currentTime.value = new Date();
    }, 1000);
}

updateTime();

const timeLeft = computed<string>(() => {
    if (!props.startTime) return "00:00:00";
    const mils = props.startTime.getTime() + props.timeLimitHours * 60 * 60 * 1000 + props.timeLimitMinutes * 60 * 1000 - currentTime.value.getTime();
    let hours = Math.floor(mils / 1000 / 60 / 60);
    let minutes = Math.floor(mils / 1000 / 60) % 60;
    let seconds = Math.floor(mils / 1000) % 60;
    hours = Math.max(hours, 0);
    minutes = Math.max(minutes, 0);
    seconds = Math.max(seconds, 0);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

</script>

<template>
    <q-chip class="mt-2">
        <h2> {{ timeLeft }}</h2>
    </q-chip>
</template>