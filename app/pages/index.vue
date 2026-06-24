<script setup lang="ts">
import Destructor from "~/components/landing/destructor/section.vue";
import Hero from "~/components/landing/hero/section.vue";
import Languages from "~/components/landing/languages/section.vue";
import Projects from "~/components/landing/projects/section.vue";
import Stats from "~/components/landing/stats/section.vue";
import Testimonials from "~/components/landing/testimonials/section.vue";
import SquarePattern from "~/components/patterns/square-pattern.vue";
import Audio from "~/components/widgets/audio.vue";

useSeoMeta({
    title: "Homepage",
    ogImage: "/images/assets/banner-2.webp",
    ogImageAlt: "A screenshot of VSCode open",
    description:
        "I make apps, websites and servers through FOSS and open standards. I am a student in computer engineering and a programmer by passion, with several years of experience in many kinds of fields",
    ogLocale: "en-US",
});

definePageMeta({
    layout: "navbar-and-footer",
});
</script>

<template>
    <div class="flex flex-col gap-48 pb-48 relative">
        <SquarePattern />

        <Hero />

        <Stats />

        <Languages />

        <Testimonials />

        <Projects />

        <Destructor />

        <Audio />
    </div>
</template>
