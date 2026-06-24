<template>
    <Card as="article">
        <NuxtLink class="flex flex-col gap-4" :href="`/blog${post.path}`">
            <CardHeader v-if="post.image" class="w-full">
                <nuxt-img
                    width="500"
                    :src="post.image"
                    alt=""
                    format="webp"
                    class="aspect-video w-full rounded-sm object-cover sm:aspect-2/1 lg:aspect-3/2"
                />
            </CardHeader>
            <CardContent class="flex flex-col gap-3">
                <NuxtTime
                    v-if="post.created_at"
                    date-style="long"
                    :datetime="new Date(Number(post.created_at))"
                    class="text-muted-foreground text-xs"
                    locale="en-GB"
                />
                <CardTitle>{{ post.title }}</CardTitle>
                <CardDescription class="line-clamp-3">
                    {{ post.description }}
                </CardDescription>
            </CardContent>
        </NuxtLink>
    </Card>
</template>

<script lang="ts" setup>
import type { ContentCollectionItem } from "@nuxt/content";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

const { post } = defineProps<{
    post: ContentCollectionItem;
}>();
</script>
