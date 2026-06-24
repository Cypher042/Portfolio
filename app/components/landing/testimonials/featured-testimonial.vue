<template>
    <Card as="figure" class="p-0">
        <blockquote class="p-12 text-xl font-semibold leading-8 tracking-tight">
            <p>“{{ testimonial.body }}”</p>
        </blockquote>
        <figcaption
            class="grid grid-cols-[auto_1fr_auto] gap-4 px-6 py-4 items-center"
        >
            <Avatar class="size-10">
                <AvatarImage :src="testimonial.author.imageUrl" alt="" />
            </Avatar>
            <div>
                <div class="font-semibold">{{ testimonial.author.name }}</div>
                <span class="text-secondary-foreground">
                    {{ testimonial.author.title }}
                </span>
            </div>
            <Avatar class="size-10">
                <AvatarImage :src="testimonial.author.logoUrl" alt="" />
            </Avatar>
        </figcaption>
    </Card>
</template>

<script lang="ts" setup>
import { Avatar, AvatarImage } from "~/components/ui/avatar";
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
