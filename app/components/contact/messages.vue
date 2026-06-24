<template>
    <div
        ref="scrollContainer"
        v-if="messages.length > 0"
        class="flex flex-col gap-2 max-h-96 overflow-y-auto overflow-x-hidden"
    >
        <TransitionGroup
            enter-active-class="duration-300 ease-out transform"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in transform"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <Message
                v-for="message in messages"
                :key="message.id"
                :content="message.message"
                :date="new Date(message.time * 1000)"
            />
        </TransitionGroup>
    </div>
    <slot v-else />
</template>

<script lang="ts" setup>
import Message from "./message.vue";

const { ntfyId } = defineProps<{
    ntfyId: string;
}>();

const scrollContainer = useTemplateRef<HTMLDivElement | null>(
    "scrollContainer",
);
const messages = ref<NtfyMessage[]>([]);

interface NtfyMessage {
    id: string;
    time: number;
    expires: number;
    event: "message";
    topic: string;
    message: string;
}

// Subscribe to SSE stream for new messages
const { data } = useEventSource(`https://ntfy.sh/${ntfyId}/sse`, ["message"], {
    autoReconnect: true,
    serializer: {
        read: (rawData) => (rawData ? JSON.parse(rawData) : null),
    },
});

watch(data, async (newData) => {
    if (
        newData &&
        newData.event === "message" &&
        !messages.value.find((msg) => msg.id === newData.id)
    ) {
        messages.value.push(newData as NtfyMessage);

        await nextTick();
        if (scrollContainer?.value) {
            await scrollContainer.value.scrollTo({
                top: scrollContainer.value.scrollHeight,
                behavior: "smooth",
            });
        }
    }
});
</script>
