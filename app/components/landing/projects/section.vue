<script setup lang="ts">
import Container from "~/components/containers/big.vue";
import Card from "./card.vue";

const cards = [
    {
        name: "Cloud Resume Challenge (Azure)",
        description:
            "Orchestrated a cloud resume on Azure using Blob Storage, Azure Functions, and Azure Cosmos DB. Configured Cloudflare routing with DNS, TLS termination, and reverse proxying. Built CI/CD automation with GitHub Actions.",
        image: "/images/assets/vscode.png",
        featured: true,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/Cypher042/crc-azure",
                icon: "tabler:brand-github",
            },
        ],
    },
    {
        name: "HectoClash",
        description:
            "Built a real-time multiplayer gaming platform with Go supporting 1,000+ users, live puzzles, and spectator mode. Reduced matchmaking time by 30% using Redis and WebSockets. Implemented distributed monolith architecture achieving 99.9% uptime.",
        image: "/images/assets/vscode.png",
        featured: true,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/Cypher042/HectoClash",
                icon: "tabler:brand-github",
            },
        ],
    },
    {
        name: "BArgus",
        description:
            "Engineered a real-time price tracking platform using WebScraping. Implemented AI/ML price prediction on time-series data with real-time alerts on 1M+ MongoDB records. Deployed with AWS Serverless Architecture, reducing infrastructure costs by 60%.",
        image: "/images/assets/vscode.png",
        featured: false,
        links: [
            {
                name: "GitHub",
                href: "https://github.com/Cypher042/BArgus",
                icon: "tabler:brand-github",
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
