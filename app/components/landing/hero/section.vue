<script setup lang="ts">
import WidgetClient from "~/components/cli/widget.client.vue";
import { Card } from "~/components/ui/card";
import HeroContent from "./content.vue";

const showTerminal = ref(false);
</script>

<template>
    <section
        class="relative h-dvh flex items-center justify-center overflow-hidden"
    >
        <Card
            v-if="showTerminal"
            class="mx-auto w-full max-w-5xl font-mono min-h-96 max-h-[70vh]"
        >
            <WidgetClient />
        </Card>
        <HeroContent v-else @switch="showTerminal = true" />
    </section>
</template>
