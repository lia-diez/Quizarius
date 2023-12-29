<script setup lang="ts">
</script>

<template>
    <v-card class="quiz-card mt-5 mb-0 pa-3" color="surface">
        <slot></slot>
    </v-card>
</template>

<style scoped>
.quiz-card {
    width: min(100%, 700px);
}
</style>