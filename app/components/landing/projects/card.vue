<template>
    <Card as="li" class="gap-4">
        <CardHeader>
            <nuxt-img
                class="aspect-3/2 w-full rounded object-cover border"
                :src="image"
                width="400"
                alt=""
                format="webp"
            />
        </CardHeader>
        <CardContent class="gap-4 flex flex-col h-full">
            <CardTitle>{{ name }}</CardTitle>
            <CardDescription>{{ description }}</CardDescription>
            <ul class="flex gap-4 list-none flex-wrap mt-auto">
                <li v-for="link in links" :key="link.name">
                    <a
                        :href="link.href"
                        target="_blank"
                        rel="noreferrer"
                        :title="link.name"
                    >
                        <LinkIcon class="size-6" />
                    </a>
                </li>
            </ul>
        </CardContent>
    </Card>
</template>

<script lang="ts" setup>
import { LinkIcon } from "@lucide/vue";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "~/components/ui/card";

defineProps<{
    name: string;
    description: string;
    image: string;
    featured?: boolean;
    links: {
        name: string;
        icon: string;
        href: string;
    }[];
}>();
</script>
