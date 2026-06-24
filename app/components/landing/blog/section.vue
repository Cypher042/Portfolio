<script setup lang="ts">
import Container from "~/components/containers/big.vue";
import Card from "./card.vue";

const { data: posts } = await useAsyncData(() =>
    queryCollection("content").all(),
);

const isCypher = useCypher();
</script>

<template>
    <section>
        <Container>
            <h2
                class="text-center mx-auto text-3xl font-bold tracking-tight sm:text-4xl"
            >
                Blog articles
            </h2>
            <div
                v-if="posts && posts.length > 0"
                class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
            >
                <Card
                    v-for="post in posts"
                    :key="post.title"
                    :post="post"
                    :class="post.private && !isCypher && 'hidden'"
                />
            </div>
            <div v-else class="mx-auto mt-16 text-center">
                <p class="text-secondary-foreground">No posts yet.</p>
            </div>
        </Container>
    </section>
</template>
