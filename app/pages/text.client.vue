<template>
    <div class="flex relative items-center justify-center h-dvh gap-4">
        <div
            class="flex items-center gap-1 absolute top-4 bg-background rounded-md"
        >
            <Button
                variant="ghost"
                size="icon-lg"
                :disabled="currentSlide <= 0"
                @click="currentSlide--"
            >
                <ChevronLeft />
            </Button>
            <span class="mx-4 text-lg md:text-xl lg:text-2xl">
                {{ currentSlide + 1 }}
            </span>
            <Button variant="ghost" size="icon-lg" @click="currentSlide++">
                <ChevronRight />
            </Button>
        </div>
        <textarea
            ref="textarea"
            v-model="input"
            class="w-full max-w-7xl max-h-full bg-transparent border-0! focus:border-0! focus:ring-0! text-center text-2xl md:text-4xl lg:text-6xl leading-tight resize-none"
            placeholder="What's on your mind?"
        ></textarea>
    </div>
</template>

<script lang="ts" setup>
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { Button } from "~/components/ui/button";

const slides = useLocalStorage<string[]>("slides", []);
const currentSlide = useLocalStorage<number>("currentSlide", 0);
const { ArrowRight, ArrowLeft } = useMagicKeys();

const text = computed({
    get: () => slides.value[currentSlide.value] || "",
    set: (val: string) => {
        slides.value[currentSlide.value] = val;
    },
});

const { textarea, input } = useTextareaAutosize({
    input: text,
});
const { focused } = useFocus(textarea);

watchEffect(() => {
    if (ArrowRight?.value && !focused.value) {
        currentSlide.value++;
    }
});

watchEffect(() => {
    if (ArrowLeft?.value && currentSlide.value > 0 && !focused.value) {
        currentSlide.value--;
    }
});
</script>
