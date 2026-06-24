<template>
    <div
        :class="cn('relative flex w-max max-w-3/4 flex-row justify-center gap-4 text-sm')"
    >
        <div class="flex text-muted-foreground">
            <NuxtTime :datetime="date" time-style="short" class="text-xs" />
        </div>
        <div
            class="whitespace-pre-wrap bg-primary text-primary-foreground px-3 py-2 rounded"
        >
            {{ content }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { cn } from "~/lib/utils";

const { content, date } = defineProps<{
    content: string;
    date: Date;
}>();
</script>
