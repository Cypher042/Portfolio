<template>
    <Container class="h-[80dvh] flex items-center justify-center">
        <Card class="max-w-lg w-full mx-auto">
            <CardTitle>Cookies and user-generated content</CardTitle>
            <CardContent class="space-y-4">
                <CardDescription>
                    This website uses cookies to offer you the most relevant
                    information and better understand how you use this website.
                    Please accept cookies for optimal performance.
                </CardDescription>
                <CardDescription>
                    User-generated content may not be suitable for visitors who
                    are at
                    <b>high risk of photosensitive epileptic seizures</b>.
                </CardDescription>
            </CardContent>
            <CardFooter class="gap-2">
                <Button @click="click">Accept</Button>
                <Button @click="click" variant="outline">Essential Only</Button>
            </CardFooter>
        </Card>

        <div
            :class="['fixed inset-0 z-50 flex items-center justify-center', !hasClicked && 'opacity-0 pointer-events-none']"
        >
            <video
                ref="scare"
                src="/videos/jumpscare.mp4"
                loop
                @click="videoClick"
                class="size-full object-cover"
            ></video>
        </div>
    </Container>
</template>

<script lang="ts" setup>
import Container from "~/components/containers/big.vue";
import { Button } from "~/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardTitle,
} from "~/components/ui/card";

definePageMeta({
    layout: "navbar-and-footer",
});

const scare = useTemplateRef<HTMLVideoElement>("scare");
const hasClicked = ref(false);

onMounted(() => {
    useEventListener("beforeunload", (event) => {
        if (hasClicked.value) {
            event.preventDefault();
        }
    });
});

const click = () => {
    if (!hasClicked.value) {
        hasClicked.value = true;
    }

    scare.value?.play();
    videoClick();
};

const videoClick = (event?: Event) => {
    event?.preventDefault();

    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
};
</script>

<style lang="css" module>
.video::-webkit-media-controls-enclosure {
    display: none !important;
}
</style>
