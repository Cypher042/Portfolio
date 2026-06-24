<template>
    <Card
        class="overflow-hidden backdrop-blur-lg px-6 py-20 shadow-xl sm:px-10 sm:py-24 md:px-12 lg:px-20"
    >
        <nuxt-img
            class="absolute inset-0 size-full object-cover brightness-150 saturate-0"
            :src="testimonial.author.imageUrl"
            sizes="sm:80vw"
            quality="40"
            format="webp"
            alt=""
        />
        <div class="absolute inset-0 bg-background/90 mix-blend-multiply" />
        <div
            class="absolute -left-80 -top-56 transform-gpu blur-3xl"
            aria-hidden="true"
        >
            <div
                class="aspect-1097/845 w-274.25 bg-linear-to-r from-primary to-secondary opacity-[0.45]"
                style="
                clip-path: polygon(
                    74.1% 44.1%,
                    100% 61.6%,
                    97.5% 26.9%,
                    85.5% 0.1%,
                    80.7% 2%,
                    72.5% 32.5%,
                    60.2% 62.4%,
                    52.4% 68.1%,
                    47.5% 58.3%,
                    45.2% 34.5%,
                    27.5% 76.7%,
                    0.1% 64.9%,
                    17.9% 100%,
                    27.6% 76.8%,
                    76.1% 97.7%,
                    74.1% 44.1%
                );
            "
            />
        </div>
        <div
            class="hidden md:absolute md:bottom-16 md:left-200 md:block md:transform-gpu md:blur-3xl"
            aria-hidden="true"
        >
            <div
                class="aspect-1097/845 w-274.25 bg-linear-to-r from-primary to-secondary opacity-25"
                style="
                clip-path: polygon(
                    74.1% 44.1%,
                    100% 61.6%,
                    97.5% 26.9%,
                    85.5% 0.1%,
                    80.7% 2%,
                    72.5% 32.5%,
                    60.2% 62.4%,
                    52.4% 68.1%,
                    47.5% 58.3%,
                    45.2% 34.5%,
                    27.5% 76.7%,
                    0.1% 64.9%,
                    17.9% 100%,
                    27.6% 76.8%,
                    76.1% 97.7%,
                    74.1% 44.1%
                );
            "
            />
        </div>
        <div class="relative mx-auto max-w-none lg:mx-0">
            <nuxt-img
                class="h-12 w-auto"
                format="webp"
                sizes="sm:50vw"
                width="320"
                height="81"
                :src="testimonial.author.logoUrl"
                alt=""
            />
            <figure>
                <blockquote
                    class="mt-6 text-lg font-semibold sm:text-xl sm:leading-8"
                >
                    <p>“{{ testimonial.body }}”</p>
                </blockquote>
                <figcaption class="mt-6">
                    <div class="font-semibold">
                        {{ testimonial.author.name }}
                    </div>
                    <div class="mt-1">{{ testimonial.author.title }}</div>
                </figcaption>
            </figure>
        </div>
    </Card>
</template>

<script lang="ts" setup>
import { Card } from "~/components/ui/card";

defineProps<{
    testimonial: {
        body: string;
        author: {
            name: string;
            title: string;
            imageUrl: string;
            logoUrl: string;
        };
    };
}>();
</script>
