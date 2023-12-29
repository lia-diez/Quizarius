<script setup lang="ts">
defineProps<{
    icon?: string,
    color?: string,
    variant?:  NonNullable<"flat" | "text" | "elevated" | "tonal" | "outlined" | "plain"> | undefined,
}>()
</script>

<template>
    <v-chip class="rounded-xl" elevation="1" :prepend-icon="icon" :color="color" :variant="variant">
        <slot></slot>
    </v-chip>
</template>

<style scoped>
</style>