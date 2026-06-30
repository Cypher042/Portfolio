<template>
    <section>
        <Container>
            <div class="mx-auto max-w-2xl lg:mx-0">
                <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
                    I am a competent, experienced developer with professional
                    skills
                </h2>
                <p class="mt-6 text-base leading-7 text-secondary-foreground">
                    I am a student in computer engineering and a programmer by
                    passion, with several years of experience in many kinds of
                    fields.
                </p>
            </div>
            <div
                class="mx-auto mt-16 max-w-2xl grid grid-cols-1 gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:grid-cols-3"
            >
                <Card
                    class="flex-col-reverse justify-between gap-x-16 gap-y-8 p-8 sm:flex-row-reverse sm:items-end lg:flex-col lg:items-start"
                >
                    <p
                        class="flex-none text-3xl font-bold tracking-tight font-mono"
                    >
                        2,142+
                    </p>
                    <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                        <p class="text-lg font-semibold tracking-tight">
                            Commits
                        </p>
                        <p
                            class="mt-2 text-base leading-7 text-secondary-foreground"
                        >
                            Across all of my projects, I averaged more than
                            314 commits this year.
                        </p>
                    </div>
                </Card>
                <Card
                    class="flex-col-reverse justify-between gap-x-16 gap-y-8 p-8 sm:flex-row-reverse sm:items-end lg:flex-col lg:items-start"
                >
                    <p
                        class="flex-none text-3xl font-bold tracking-tight font-mono"
                    >
                        3 years
                    </p>
                    <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                        <p class="text-lg font-semibold tracking-tight">
                            I have more than 3 years of experience in
                            programming
                        </p>
                        <p
                            class="mt-2 text-base leading-7 text-secondary-foreground"
                        >
                            Development for Windows, Linux, Android
                            and the Web.
                        </p>
                    </div>
                </Card>
                <Card
                    class="flex-col-reverse justify-between gap-x-16 gap-y-8 p-8 sm:flex-row-reverse sm:items-end lg:flex-col lg:items-start"
                >
                    <p
                        class="flex-none text-3xl font-bold tracking-tight font-mono"
                    >
                        749,162+
                    </p>
                    <div class="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                        <p class="text-lg font-semibold tracking-tight">
                            Lines of code written
                        </p>
                        <p
                            class="mt-2 text-base leading-7 text-secondary-foreground"
                        >
                            <!-- Including
                            <strong class="font-semibold"
                                ></strong
                            >&nbsp;lines of TypeScript, totaled across every
                            project I've kept in source control. -->
                        </p>
                    </div>
                </Card>
            </div>
        </Container>
    </section>
</template>

<script lang="ts" setup>
import Container from "~/components/containers/big.vue";
import { Card } from "~/components/ui/card";
</script>
