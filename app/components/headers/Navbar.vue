<script setup lang="ts">
import {
    ChevronDown,
    ExternalLink,
    Globe,
    Menu,
    MessagesSquare,
    Network,
    Server,
    X,
} from "@lucide/vue";
import { NuxtLink } from "#components";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "../ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "../ui/collapsible";

const projects = [
    {
        name: "HectoClash",
        description:
            "Multiplayer Game written in Golang with websockets",
        icon: Network,
        href: "https://github.com/Cypher042/HectoClash",
    },
    {
        name: "Cloud Resume Challenge",
        description: "A multi-step portfolio project that proves practical cloud engineering skills by building, hosting, and automating a personalized digital resume on a major public cloud platform",
        icon: Globe,
        href: "https://github.com/Cypher042/crc-azure",
    },
    {
        name: "BArgus",
        description:
            "BArgus is a smart, no-nonsense price tracker that stalks your favorite products and notifies you when the price drops.",
        icon: MessagesSquare,
        href: "https://github.com/Cypher042/BArgus",
    },
];

const open = ref(false);
</script>
<template>
    <NavigationMenu
        as="header"
        data-phys="true"
        class="z-10 backdrop-blur-lg fixed top-0 inset-x-0 max-w-full *:w-full"
    >
        <Sheet>
            <NavigationMenuList
                as="nav"
                class="max-w-7xl mx-auto w-full grid grid-cols-[auto_auto] lg:grid-cols-[1fr_repeat(3,auto)_1fr] gap-6 items-center justify-between p-4 lg:px-8"
            >
                <NavigationMenuItem class="mr-auto">
                    <NuxtLink
                        v-slot="{ isActive, href, navigate }"
                        to="/"
                        custom
                    >
                        <NavigationMenuLink
                            :active="isActive"
                            :href="href"
                            @click="navigate"
                        >
                            <span class="sr-only">Cypher</span>
                            <nuxt-img
                                class="size-8"
                                src="/images/icons/logo.svg"
                                alt="Cypher Logo"
                            />
                        </NavigationMenuLink>
                    </NuxtLink>
                </NavigationMenuItem>

                <NavigationMenuItem class="hidden lg:block">
                    <NavigationMenuTrigger>Projects</NavigationMenuTrigger>

                    <NavigationMenuContent>
                        <ul
                            class="grid grid-cols-2 xl:grid-cols-4 gap-4 w-screen max-w-xl xl:max-w-7xl"
                        >
                            <NavigationMenuLink
                                as-child
                                v-for="item in projects"
                                :key="item.name"
                            >
                                <a
                                    :href="item.href"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="p-4 group flex flex-col gap-2 rounded-md hover:bg-accent/50 transition-colors"
                                >
                                    <div class="mb-2">
                                        <component
                                            :is="item.icon"
                                            class="size-6 text-secondary-foreground"
                                        />
                                    </div>
                                    <h2
                                        class="font-semibold text-secondary-foreground"
                                    >
                                        {{ item.name }}
                                    </h2>
                                    <p class="text-muted-foreground">
                                        {{ item.description }}
                                    </p>
                                </a>
                            </NavigationMenuLink>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem class="hidden lg:block">
                    <NuxtLink
                        v-slot="{ isActive, href, navigate }"
                        to="/blog"
                        custom
                    >
                        <NavigationMenuLink
                            :active="isActive"
                            :href="href"
                            :class="navigationMenuTriggerStyle()"
                            @click="navigate"
                        >
                            Blog
                        </NavigationMenuLink>
                    </NuxtLink>
                </NavigationMenuItem>

                <NavigationMenuItem class="hidden lg:block">
                    <NuxtLink
                        v-slot="{ isActive, href, navigate }"
                        to="/contact"
                        custom
                    >
                        <NavigationMenuLink
                            :active="isActive"
                            :href="href"
                            :class="navigationMenuTriggerStyle()"
                            @click="navigate"
                        >
                            Contact
                        </NavigationMenuLink>
                    </NuxtLink>
                </NavigationMenuItem>

                <NavigationMenuItem class="ml-auto hidden lg:block">
                    <NuxtLink
                        v-slot="{ isActive, href, navigate }"
                        to="https://github.com/cypher/web-landing"
                        external
                        custom
                    >
                        <NavigationMenuLink
                            :active="isActive"
                            :href="href"
                            :class="navigationMenuTriggerStyle()"
                            @click="navigate"
                        >
                            Source Code
                            <ExternalLink class="size-4" />
                        </NavigationMenuLink>
                    </NuxtLink>
                </NavigationMenuItem>

                <SheetTrigger as-child>
                    <Button
                        class="lg:hidden"
                        size="icon"
                        variant="ghost"
                        @click="open = true"
                        aria-label="Open main menu"
                    >
                        <Menu class="size-6" />
                    </Button>
                </SheetTrigger>
            </NavigationMenuList>

            <SheetContent class="px-2 py-6 w-full max-w-md">
                <NuxtLink href="/" class="mx-4">
                    <span class="sr-only">Cypher</span>
                    <nuxt-img
                        class="size-8"
                        src="/images/icons/logo.svg"
                        alt="Cypher Logo"
                    />
                </NuxtLink>
                <NavigationMenuList
                    as="nav"
                    class="flex-col items-start *:w-full *:*:w-full *:*:justify-start"
                >
                    <Collapsible v-slot="{ open }">
                        <CollapsibleTrigger
                            :class="navigationMenuTriggerStyle()"
                        >
                            Projects
                            <ChevronDown
                                :class="[
                                open ? '-rotate-180' : '',
                                'size-5 duration-200 ml-auto',
                            ]"
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <ul
                                class="flex flex-col ml-4 border-l border-border"
                            >
                                <NavigationMenuLink
                                    as-child
                                    v-for="item in projects"
                                    :key="item.name"
                                >
                                    <a
                                        :href="item.href"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="block py-2 px-3 text-sm rounded-md hover:bg-accent/50 transition-colors"
                                    >
                                        {{ item.name }}
                                    </a>
                                </NavigationMenuLink>
                            </ul>
                        </CollapsibleContent>
                    </Collapsible>

                    <NavigationMenuItem>
                        <NuxtLink
                            v-slot="{ isActive, href, navigate }"
                            to="/blog"
                            custom
                        >
                            <NavigationMenuLink
                                :active="isActive"
                                :href="href"
                                :class="navigationMenuTriggerStyle()"
                                @click="navigate"
                            >
                                Blog
                            </NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NuxtLink
                            v-slot="{ isActive, href, navigate }"
                            to="/contact"
                            custom
                        >
                            <NavigationMenuLink
                                :active="isActive"
                                :href="href"
                                :class="navigationMenuTriggerStyle()"
                                @click="navigate"
                            >
                                Contact
                            </NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NuxtLink
                            v-slot="{ isActive, href, navigate }"
                            to="https://github.com/cypher/web-landing"
                            external
                            custom
                        >
                            <NavigationMenuLink
                                :active="isActive"
                                :href="href"
                                :class="navigationMenuTriggerStyle()"
                                @click="navigate"
                            >
                                Source Code
                                <ExternalLink class="size-4" />
                            </NavigationMenuLink>
                        </NuxtLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </SheetContent>
        </Sheet>
    </NavigationMenu>
</template>
