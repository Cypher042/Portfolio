<script setup lang="ts">
import Language from "./language.vue";
import { languages } from "./languages";

const GROUP_COUNT = 3;

// Function to separate these languages into 3 equally sized groups, then return the nth group
const getGroup = (n: number) => {
    const groupSize = Math.ceil(languages.length / GROUP_COUNT);
    const start = groupSize * n;
    const end = start + groupSize;
    return languages.slice(start, end);
};
</script>

<template>
    <section
        class="flex flex-col items-center gap-2 py-4 overflow-hidden mask-linear-[to_left,transparent_0%,black_20%,black_80%,transparent_95%]"
    >
        <div
            v-for="group in GROUP_COUNT"
            :key="group"
            :class="[
            'group relative flex gap-4 p-1',
            group % 2 === 0 ? 'animate-logo-cloud-left' : 'animate-logo-cloud-right'
        ]"
        >
            <Language
                v-for="system in getGroup(group - 1)"
                :key="system.name"
                :system="system"
            />
        </div>
    </section>
</template>
