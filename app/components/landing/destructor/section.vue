<template>
    <section>
        <Container>
            <h2 class="sr-only">Surprise game</h2>
            <Card
                data-phys="none"
                class="size-72 items-center justify-center outline-none! mx-auto"
            >
                <Button
                    v-if="!clicked"
                    @click="clicked = true"
                    size="lg"
                    variant="outline"
                >
                    Click me
                </Button>
                <Suspense v-else>
                    <LazyPhysplay />

                    <template #fallback>
                        <Loader2 class="size-12 animate-spin" />
                    </template>
                </Suspense>
            </Card>
        </Container>
    </section>
</template>

<script lang="ts" setup>
import { Loader2 } from "@lucide/vue";
import Container from "~/components/containers/big.vue";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const clicked = ref(false);
</script>
