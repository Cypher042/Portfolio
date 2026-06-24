<script setup lang="ts">
import { Laptop } from "@lucide/vue";
import Jammin from "~/components/jammin/section.vue";

const { width } = useWindowSize();
</script>

<template>
    <Jammin v-if="width > 768" />
    <div
        v-else
        class="flex items-center justify-center p-10 inset-0 absolute size-full bg-black"
    >
        <div
            class="flex flex-col text-center items-center justify-center gap-5"
        >
            <Laptop class="text-white size-8" />
            <p class="text-white text-sm">
                Please visit this page on a desktop or tablet, otherwise it
                won't fit on your screen.
            </p>
        </div>
    </div>
</template>
