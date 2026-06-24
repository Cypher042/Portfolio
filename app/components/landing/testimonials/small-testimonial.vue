<template>
    <Card as="figure">
        <blockquote>
            <p>“{{ testimonial.body }}”</p>
        </blockquote>
        <figcaption class="flex items-center gap-x-4">
            <Avatar class="size-10">
                <AvatarImage :src="testimonial.author.imageUrl" alt="" />
            </Avatar>
            <div>
                <div class="font-semibold">{{ testimonial.author.name }}</div>
                <div class="text-secondary-foreground">
                    {{ testimonial.author.title }}
                </div>
            </div>
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
        };
    };
}>();
</script>
