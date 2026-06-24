<template>
    <div v-show="started">
        <video
            ref="video"
            class="size-full pointer-events-none object-cover absolute inset-0"
            :playsinline="true"
        />
        <div
            class="flex items-center overflow-hidden justify-center z-10 absolute inset-0 p-10 text-white size-full"
        >
            <ul
                :style="{
					fontSize: `${fontSize}px`,
				}"
                ref="lines"
                class="flex flex-col items-center justify-center drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)] font-semibold"
            >
                <li v-for="line in text" :key="line" class="text-center">
                    {{ line }}
                </li>
            </ul>
        </div>
    </div>
    <div
        v-show="!started"
        class="flex items-center justify-center p-10 inset-0 absolute size-full bg-background"
    >
        <Card v-if="!loaded" class="items-center gap-4">
            <Loader class="animate-spin size-8" />
            <CardTitle>
                {{ loadProgress === 1
						? "Fetching..."
						: `${Math.round(loadProgress * 100)}%` }}
            </CardTitle>
        </Card>
        <Button v-else @click="startAnimation">Jam It!</Button>
    </div>
</template>

<script lang="ts" setup>
import { Loader } from "@lucide/vue";
import { BrowserDetector } from "browser-dtector";
import {
    dataToText,
    fetchIpData,
    getGpuData,
} from "~/components/jammin/fetchers";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";

const data = ref<string[]>([]);
const text = ref<string[]>([]);
const video = useTemplateRef<HTMLVideoElement>("video");
const lines = useTemplateRef<HTMLUListElement>("lines");
const fontSize = ref(36);
const started = ref(false);
const loadProgress = ref(0);
const loaded = ref(false);

const videoLoadHandler = async () => {
    const ipData = await fetchIpData();
    const detector = new BrowserDetector(
        window.navigator.userAgent,
    ).parseUserAgent();

    const gpuData = await getGpuData();

    data.value = dataToText(ipData, gpuData, detector);

    loaded.value = true;
};

const startAnimation = () => {
    if (!video.value) {
        throw new Error("Video element is null");
    }

    const START_TIME = 13.166;
    const STEP_DURATION = 0.5;

    started.value = true;
    video.value.play();

    let time = video.value.currentTime - START_TIME;
    let step = 0;

    // If the text is too big and overflows, we decrease the font size
    const interval = setInterval(() => {
        if (!video.value) {
            throw new Error("Video element is null");
        }

        if (!lines.value) {
            throw new Error("Lines element is null");
        }

        time = video.value.currentTime - START_TIME - step * STEP_DURATION;

        if (time > 0) {
            if (step === 0) {
                document.title = "You just got jammed!";
            }

            text.value.push(data.value[step] as string);
            const height = lines.value.getBoundingClientRect().height;

            if (height > window.innerHeight) {
                fontSize.value -= fontSize.value / 10;
            }

            step++;
        }
    }, 10);

    video.value.onended = () => {
        if (!video.value) {
            throw new Error("Video element is null");
        }

        video.value.style.display = "none";
        clearInterval(interval);
    };
};

onMounted(async () => {
    if (!video.value) {
        throw new Error("Video element is null");
    }

    video.value.addEventListener("canplaythrough", videoLoadHandler);

    const response = await fetch("/videos/jammin.mp4");

    if (!response.body) {
        throw new Error("Response body is null");
    }

    // Here, we are reading the video file in chunks and updating the load progress
    // using this technique that works for some reason
    const reader = response.body.getReader();
    const contentLength = Number(response.headers.get("Content-Length"));
    let receivedLength = 0;
    const chunks: Uint8Array<ArrayBuffer>[] = [];

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;
        loadProgress.value = receivedLength / contentLength;
    }

    video.value.src = URL.createObjectURL(
        new Blob(chunks, { type: "video/mp4" }),
    );
    video.value.load();
});

onUnmounted(() => {
    video.value?.removeEventListener("canplaythrough", videoLoadHandler);
});
</script>
