<script setup lang="tsx">
import { Loader2 } from "@lucide/vue";
import Inbox from "~/components/contact/inbox.vue";
import Messages from "~/components/contact/messages.vue";
import Container from "~/components/containers/big.vue";
import { Card, CardTitle } from "~/components/ui/card";

useSeoMeta({
    title: "Contact",
    ogImage: "/images/assets/banner-2.webp",
    ogImageAlt: "A screenshot of VSCode open",
    description:
        "I make apps, websites and servers through FOSS and open standards. I am a student in computer engineering and a programmer by passion, with several years of experience in many kinds of fields",
    ogLocale: "en-US",
});

const contactMethods = [
    {
        name: "Signal",
        href: "https://signal.me/#eu/29gu1hAuAfCAifqIvTWNB2u4hmlVvk9VnCEP15r25Hix_8nBBEBEx7OHuTsuemPX",
        icon: (
            <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m3 20l1.3-3.9C1.976 12.663 2.874 8.228 6.4 5.726c3.526-2.501 8.59-2.296 11.845.48c3.255 2.777 3.695 7.266 1.029 10.501S11.659 20.922 7.7 19z"
                />
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/in/cypher042/",
        icon: (
            <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="currentColor"
                    d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-1.42 0-2.09.78-2.45 1.35v-1.15h-2.73v8.36h2.73v-4.57c0-1.2.23-2.36 1.73-2.36c1.47 0 1.5 1.36 1.5 2.44v4.52h2.73M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.36H5.5v8.36h2.77Z"
                />
            </svg>
        ),
    },
    {
        name: "Email",
        href: "mailto:cypher042@gmail.com",
        icon: (
            <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <g
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                >
                    <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="m3 7l9 6l9-6" />
                </g>
            </svg>
        ),
    },
    {
        name: "GitHub",
        href: "https://github.com/Cypher042",
        icon: (
            <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2c2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2a4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6c-.6.6-.6 1.2-.5 2V21"
                />
            </svg>
        ),
    },
];

definePageMeta({
    layout: "navbar-and-footer",
});
</script>

<template>
    <Container class="py-40 flex flex-col gap-20">
        <Inbox />
        <section>
            <Card class="max-w-2xl">
                <Messages ntfy-id="3MFIHQw4F23Gs7dz">
                    <div class="flex flex-row gap-4 items-center">
                        <Loader2 class="animate-spin" />
                        <CardTitle class="text-center">
                            Listening for new messages...
                        </CardTitle>
                    </div>
                </Messages>
            </Card>
        </section>
        <section>
            <div class="mx-auto">
                <h2
                    class="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
                >
                    How to contact me
                </h2>
                <p
                    class="mt-6 text-lg leading-8 text-secondary-foreground max-w-xl"
                >
                    You can contact me through various means, such as LinkedIn,
                    Email or Signal.
                </p>
            </div>
            <div
                class="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-8 lg:mx-0 lg:max-w-none lg:grid-cols-2"
            >
                <Card
                    as="a"
                    v-for="method in contactMethods"
                    :key="method.name"
                    :href="method.href"
                    target="_blank"
                    referrerpolicy="no-referrer"
                    class="space-y-4 items-center gap-1"
                >
                    <component
                        :is="method.icon"
                        class="size-12 text-primary-foreground"
                    />
                    <span class="text-primary-foreground font-semibold">
                        {{ method.name }}
                    </span>
                </Card>
            </div>
        </section>
    </Container>
</template>
