<script setup lang="ts">
definePageMeta({
    layout: "navbar-and-footer",
});

const filePath = (useRoute().params.path as string[]).join("/");

const { data: post } = await useAsyncData(() =>
    queryCollection("content").path(`/${filePath}`).first(),
);

if (!post.value) {
    throw createError({
        statusCode: 404,
        message: "Post not found",
    });
}

useSchemaOrg([
    defineArticle({
        author: {
            image: "/images/avatars/cypher.png",
        },
        datePublished: post.value.created_at,
        image: post.value.image,
        description: post.value.description,
        inLanguage: "en-US",
        thumbnailUrl: post.value.image,
    }),
]);

useSeoMeta({
    title: post.value.title,
    description: post.value.description,
    ogImage: post.value.image,
    twitterCard: "summary_large_image",
});
</script>

<template>
    <div v-if="post" class="mx-auto max-w-7xl pb-24 sm:pb-32 px-6 lg:px-8 pt-1">
        <div class="mx-auto max-w-2xl text-center mt-40 flex flex-col gap-8">
            <h1
                v-if="post.title"
                class="text-4xl font-bold tracking-tight sm:text-5xl"
            >
                {{ post.title }}
            </h1>

            <NuxtTime
                v-if="post.created_at"
                :datetime="new Date(Number(post.created_at))"
                date-style="long"
                time-style="short"
                class="text-muted-foreground"
                locale="en-GB"
            />
        </div>
        <nuxt-img
            v-if="post.image"
            :src="post.image"
            width="800"
            alt=""
            format="webp"
            class="aspect-video drop-shadow-2xl my-20 w-full max-w-3xl mx-auto rounded-sm bg-muted object-cover sm:aspect-2/1 lg:aspect-3/2"
        />
        <ContentRenderer
            class="mx-auto max-w-3xl prose prose-invert prose-code:before:content-none prose-code:after:content-none prose-headings:scroll-mt-20 prose-img:rounded prose-img:ring-1 prose-img:ring-white/5"
            tag="article"
            :value="post"
        />
    </div>
</template>
