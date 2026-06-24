<script setup lang="ts">
import type { NuxtError } from "nuxt/app";

const props = defineProps<{
    error: NuxtError;
}>();

console.log(props.error);
</script>

<template>
    <NuxtLayout name="navbar-and-footer">
        <Errors404 v-if="error.status === 404" />
    </NuxtLayout>
</template>
