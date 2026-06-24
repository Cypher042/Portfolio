<script setup lang="ts">
import { Toaster } from "./components/ui/sonner";

useHead({
    link: [
        {
            rel: "me",
            href: "https://mk.cypher.com/@cypher",
        },
    ],
});
</script>

<template>
    <NuxtLayout>
        <NuxtLoadingIndicator />
        <NuxtPage />
    </NuxtLayout>

    <ClientOnly> <Toaster position="top-right" /> </ClientOnly>
</template>

<style>
html {
    color-scheme: dark;
}
</style>
