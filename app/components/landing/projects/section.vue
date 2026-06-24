<script setup lang="ts">
import Container from "~/components/containers/big.vue";
import Card from "./card.vue";

const cards = [
    {
        name: "Versia Protocol",
        description:
            "Fully documented protocol specification for Versia, a decentralized federation protocol that focuses on good experience.",
        image: "/images/assets/versia-pub-frontpage.png",
        featured: true,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/versia-pub/docs",
                icon: "tabler:brand-github",
            },
            {
                name: "Website",
                href: "https://versia.pub",
                icon: "tabler:link",
            },
            {
                name: "OpenCollective",
                href: "https://opencollective.com/lysand",
                icon: "tabler:coin-euro",
            },
        ],
    },
    {
        name: "Versia Server",
        description:
            "Reference implementation of the Versia protocol. High-quality, efficient and configurable server software.",
        image: "/images/assets/versia-readme.png",
        featured: true,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/versia-pub/server",
                icon: "tabler:brand-github",
            },
            {
                name: "Production Instance",
                href: "https://vs.cypher.com",
                icon: "tabler:server",
            },
            {
                name: "OpenCollective",
                href: "https://opencollective.com/lysand",
                icon: "tabler:coin-euro",
            },
        ],
    },
    {
        name: "Versia-FE",
        description:
            "Frontend for Versia Server, made with Vue 3 and Tailwind CSS. It's a modern, responsive and fast web application.",
        image: "/images/assets/versia-fe.png",
        featured: false,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/versia-pub/frontend",
                icon: "tabler:brand-github",
            },
            {
                name: "Production Instance",
                href: "https://vs.cypher.com",
                icon: "tabler:server",
            },
            {
                name: "OpenCollective",
                href: "https://opencollective.com/lysand",
                icon: "tabler:coin-euro",
            },
        ],
    },
    {
        name: "Versia APIs",
        description:
            "APIs for TypeScript Versia implementations, including federation and clients. Well-documented, small and efficient.",
        image: "/images/assets/lysand-apis.png",
        featured: false,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/versia-pub/api",
                icon: "tabler:brand-github",
            },
            {
                name: "NPM",
                href: "https://www.npmjs.com/package/@versia/federation",
                icon: "tabler:brand-npm",
            },
            {
                name: "JSR",
                href: "https://jsr.io/@versia/federation",
                icon: "tabler:package",
            },
            {
                name: "OpenCollective",
                href: "https://opencollective.com/lysand",
                icon: "tabler:coin-euro",
            },
        ],
    },
    {
        name: "Join Mastodon",
        description:
            "A landing page for mastodon.de, a social media with no ads, no tracking, and no algorithms. Made with Nuxt.js and Tailwind CSS.",
        image: "/images/assets/join-mastodon.de_en.webp",
        links: [
            {
                name: "GitHub",
                href: "https://github.com/Mastodon-DE/joinmastodon",
                icon: "tabler:brand-github",
            },
            {
                name: "Website",
                href: "https://join-mastodon.de",
                icon: "tabler:link",
            },
        ],
    },
    {
        name: "Flavi",
        description:
            "Flavi is an open-source client for the Matrix ecosystem with the goal of having a clean, familiar interface for users of Discord and the like.",
        image: "/images/assets/flavi-screenshot.png",
        abandoned: true,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/Cypher042/flavi",
                icon: "tabler:brand-github",
            },
        ],
    },
    {
        name: "KitsuLife",
        description:
            "Website for the Kitsu service suite, showcasing features and the community for Kitsu.",
        image: "/images/assets/kitsudotlife.png",
        links: [
            {
                name: "GitHub",
                href: "https://github.com/cypher/kitsu-landing",
                icon: "tabler:brand-github",
            },
            {
                name: "Website",
                href: "https://kitsu.life",
                icon: "tabler:link",
            },
        ],
    },
];
</script>

<template>
    <section>
        <Container class="grid grid-cols-1 gap-x-8 gap-y-20 xl:grid-cols-3">
            <ul
                class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-20 lg:grid-cols-3 lg:mx-0 lg:max-w-none lg:gap-x-8 xl:col-span-3"
            >
                <li class="mx-auto max-w-2xl lg:mx-0">
                    <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
                        Projects
                    </h2>
                    <p class="mt-6 text-secondary-foreground">
                        Here are some of the projects I have fully created
                        myself, all of them are open-source and free to use.
                    </p>
                    <p class="mt-6 text-secondary-foreground">
                        Some of them are still in development, while others are
                        already in production and used by many people.
                    </p>
                </li>
                <Card
                    v-for="card in cards"
                    :key="card.name"
                    :name="card.name"
                    :image="card.image"
                    :description="card.description"
                    :links="card.links ?? []"
                    :featured="card.featured"
                />
            </ul>
        </Container>
    </section>
</template>
