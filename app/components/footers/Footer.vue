<script setup lang="tsx">
const footerNavigation = {
    // solutions: [{ name: "Versia", href: "https://versia.pub" }],
    social: [
        {
            name: "GitHub",
            href: "https://github.com/Cypher042/",
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
    ],
};

const friends88x31: {
    name: string;
    link: string;
    src: string;
}[] = [
    {
        name: "Alex",
        link: "https://gra.phite.ro",
        src: "/images/88x31s/alex.png",
    },
    {
        name: "Astrid Yu",
        link: "https://astrid.tech",
        src: "/images/88x31s/astrid.png",
    },
    {
        name: "Lily",
        link: "https://lunahd.neocities.org/",
        src: "/images/88x31s/lunahd.png",
    },
    {
        name: "Sophari",
        link: "https://sophari.org",
        src: "/images/88x31s/sophari.gif",
    },
    {
        name: "Yassie",
        link: "https://labyrinth.zone/@yassie_j",
        src: "/images/88x31s/yassie.gif",
    },
    {
        name: "Lexi",
        // link: "https://softkittypa.ws",
        src: "/images/88x31s/lexi.png",
    },
    {
        name: "Ari",
        link: "https://ari.lt",
        src: "/images/88x31s/ari.png",
    },
    {
        name: "Nexy",
        link: "https://nexy7574.co.uk",
        src: "/images/88x31s/nexy.gif",
    },
    {
        name: "June",
        link: "https://f.dog",
        src: "/images/88x31s/june.png",
    },
    {
        name: "Noohance",
        link: "https://example.com",
        src: "/images/88x31s/nhat.jpg",
    },
    {
        name: "Austin Huang",
        link: "https://austinhuang.me",
        src: "/images/88x31s/austin.svg",
    },
    {
        name: "Virkunnen",
        link: "https://vrkknn.net",
        src: "/images/88x31s/virkunnen.png",
    },
    {
        name: "Nelson",
        link: "https://n.cyrneko.eu",
        src: "/images/88x31s/nelson.png",
    },
    {
        name: "Abigail",
        link: "https://thegail.site",
        src: "/images/88x31s/gail.gif",
    },
];
</script>

<template>
    <footer class="bg-card z-1">
        <div
            class="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32"
        >
            <div class="xl:grid xl:grid-cols-3 xl:gap-8">
                <div class="space-y-8">
                    <nuxt-img
                        class="h-7 w-auto"
                        width="229"
                        height="229"
                        src="/images/icons/logo.svg"
                        alt="Cypher"
                    />
                    <p class="text-sm leading-6 text-primary-foreground">
                        This was a triumph
                        <br>
                        I'm making a note here
                        <br>
                        Huge success
                    </p>
                    <div class="flex space-x-6">
                        <a
                            v-for="item in footerNavigation.social"
                            :key="item.name"
                            :href="item.href"
                            :title="item.name"
                            target="_blank"
                            class="text-muted-foreground hover:text-primary-foreground"
                        >
                            <span class="sr-only">{{ item.name }}</span>
                            <component :is="item.icon" class="size-5" />
                        </a>
                    </div>
                </div>
                <div
                    class="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 xl:col-span-2 xl:mt-0"
                >
                    <div>
                        <h3
                            class="text-sm font-semibold leading-6 text-primary-foreground"
                        >
                            Projects
                        </h3>
                        <ul class="mt-6 space-y-4">
                            <li
                                v-for="item in footerNavigation.solutions"
                                :key="item.name"
                            >
                                <a
                                    target="_blank"
                                    :href="item.href"
                                    class="text-sm leading-6 text-secondary-foreground hover:underline"
                                    >{{ item.name }}</a
                                >
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>
