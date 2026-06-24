<script setup lang="ts">
import { Primitive, type PrimitiveProps } from "reka-ui";
import type { HTMLAttributes } from "vue";
import { cn } from "~/lib/utils";

interface Props extends PrimitiveProps {
    class?: HTMLAttributes["class"];
}

const { as = "div", class: className } = defineProps<Props>();
</script>

<template>
    <Primitive
        data-slot="card"
        :as="as"
        :as-child="asChild"
        :class="
      cn(
        'bg-card text-sm text-card-foreground flex flex-col gap-6 rounded-lg border p-6 shadow-sm duration-100 ease-in-out hover:shadow-xl',
        className,
      )
    "
    >
        <slot />
    </Primitive>
</template>
