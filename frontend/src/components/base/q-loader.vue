<script setup lang="ts">
defineProps({
    loading: Boolean,
    failed: Boolean,
});
</script>

<template>
    <div v-if="loading" class="d-flex justify-center align-center h-100">
        <v-progress-circular indeterminate color="primary" size="64" width="4"></v-progress-circular>
    </div>
    <div v-else-if="failed">
        <slot name="failed"></slot>
    </div>
    <slot v-else></slot>
</template>