<script setup lang="ts">
import { NuxtLink } from "#components";
import { Button } from "../ui/button";

useHead({
    title: "404 Error",
});
</script>

<template>
    <div
        class="text-center grid place-items-center px-6 py-24 sm:py-32 lg:px-8"
    >
        <h1 class="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">404</h1>
        <p class="mt-6 text-base leading-7">This page doesn't exist.</p>
        <div class="mt-10 flex items-center justify-center gap-x-6">
            <Button to="/" :as="NuxtLink">Go back home</Button>
        </div>
    </div>
</template>
