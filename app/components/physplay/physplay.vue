<template>
    <section class="handle">
        <div class="handle-image" ref="gravgunimage"></div>
        <div
            class="destructor-mobile-message text-secondary-foreground text-xs"
            ref="mobilemessage"
        >
            <span class="use-mouse">Perhaps with a mouse?</span>
            <span class="use-desktop">Perhaps on a desktop browser?</span>
        </div>
    </section>
    <Teleport to="body">
        <div class="physics-container" ref="physContainer"></div>
    </Teleport>
</template>

<script lang="ts" setup>
import { PhysicsSimulation } from "@cypher/destructor";
import "@cypher/destructor/styles.css";

const gravgunimage = useTemplateRef<HTMLDivElement>("gravgunimage");
const mobilemessage = useTemplateRef<HTMLDivElement>("mobilemessage");
const physContainer = useTemplateRef<HTMLDivElement>("physContainer");

onMounted(() => {
    if (!(gravgunimage.value && mobilemessage.value && physContainer.value)) {
        return;
    }

    new PhysicsSimulation({
        elements: {
            gravGunImage: gravgunimage.value,
            mobileMessage: mobilemessage.value,
            physContainer: physContainer.value,
            footer: document.querySelector("footer") as HTMLElement,
        },
    });
});
</script>
