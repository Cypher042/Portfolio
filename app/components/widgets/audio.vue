<template>
    <Card
        :class="['fixed right-8 bottom-8 p-4', clicked && 'left-8 sm:left-auto']"
    >
        <button
            type="button"
            v-if="!clicked"
            @click="clicked = true"
            class="p-2 text-primary-foreground size-10"
            title="Play audio"
        >
            <Music class="size-6 hover:animate-spin" />
        </button>
        <audio
            v-else
            :controls="true"
            class="rounded-sm w-full"
            :autoplay="true"
        >
            <source src="/audio/want-you-gone.flac" type="audio/flac">
        </audio>
    </Card>
</template>

<script lang="ts" setup>
import { Music } from "@lucide/vue";
import { Card } from "../ui/card";

const clicked = ref(false);
</script>
