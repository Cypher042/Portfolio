<template>
    <div
        :class="[
            'grid grid-rows-[1fr_auto] h-full overflow-hidden',
            $style.container,
        ]"
    >
        <!-- Scrollable output area -->
        <div
            ref="container"
            class="whitespace-pre-wrap overflow-x-hidden overflow-y-auto"
        >
            {{ cliStore.output }}
        </div>
        <!-- Sticky prompt at bottom -->
        <div
            v-show="!cliStore.isProcessing"
            class="whitespace-pre grid grid-cols-[auto_1fr] items-center"
        >
            <span class="font-bold text-green-500">{{ cliStore.prompt }}</span>
            <input
                ref="input"
                type="text"
                class="bg-transparent text-sm border-none outline-hidden ring-0! p-0"
                placeholder="Type here..."
                @keydown="handleKeydown"
            >
        </div>
    </div>
</template>

<style module>
.container {
    font-family: var(--font-mono), monospace;
    font-display: swap;
}

.container::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: repeating-linear-gradient(
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
    );
    pointer-events: none;
}
</style>

<script lang="ts" setup>
import { useCliStore } from "~/stores/cli";

const container = useTemplateRef("container");
const input = useTemplateRef("input");
const cliStore = useCliStore();

// Scroll helper for store to use
const scrollToBottom = (): void => {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
};

const handleKeydown = async (event: KeyboardEvent): Promise<void> => {
    const target = event.target as HTMLInputElement;

    if (!container.value || !input.value) {
        return;
    }

    switch (event.key) {
        case "Enter": {
            const value = target.value;
            target.value = "";
            await cliStore.parseAndExecuteCommand(value);
            scrollToBottom();
            target.focus();
            break;
        }
        case "ArrowUp": {
            event.preventDefault();
            target.value = cliStore.navigateHistory("up", () => target.value);
            // Move cursor to end
            target.setSelectionRange(target.value.length, target.value.length);
            break;
        }
        case "ArrowDown": {
            event.preventDefault();
            target.value = cliStore.navigateHistory("down", () => target.value);
            target.setSelectionRange(target.value.length, target.value.length);
            break;
        }
    }
};

onMounted(async () => {
    cliStore.setScrollToBottom(scrollToBottom);
    await cliStore.initialize();
    await cliStore.parseAndExecuteCommand("fastfetch");
    scrollToBottom();
});

onUnmounted(() => {
    cliStore.cleanup();
});

// Expose methods for parent components
defineExpose({
    focus: () => input.value?.focus(),
});
</script>
