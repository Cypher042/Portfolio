<template>
    <div class="mx-auto max-w-7xl px-6 lg:px-8"><slot /></div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

interface Props extends /* @vue-ignore */ HTMLAttributes {}

defineProps<Props>();
</script>
