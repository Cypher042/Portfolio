<script setup lang="ts">
import Container from "~/components/containers/big.vue";
import FeaturedTestimonial from "./featured-testimonial.vue";
import LargeTestimonial from "./large-testimonial.vue";
import SmallTestimonial from "./small-testimonial.vue";

const featuredTestimonial = {
    body: "Cypher is very intelligent and resourceful when it comes to clear, on-point design. No matter what project he is tasked with, you'll get an honest answer, and a quicker turnaround.",
    author: {
        name: "Kio",
        title: "Systems Administrator, Hosting Provider",
        imageUrl: "https://cdn-web.cypher.com/kio_avatar.webp",
        logoUrl:
            "https://s3.kitsunes.club/storage/bf399313-959c-43e1-a225-0e8e6f71a852.png",
    },
};
const testimonials = [
    [
        [
            {
                body: "I got to be witness to Cypher's development of Fedibase, It really showed me how much he can accomplish when he sticks to a project. He was dedicated enough to make a fully featured Fediverse client that I'd argue is on par with other Fediverse clients, and he did it all on his own.",
                author: {
                    name: "Calciume",
                    title: "CS Student",
                    imageUrl:
                        "https://cdn-web.cypher.com/calciume_avatar.webp",
                },
            },
            {
                body: "All of Cypher's projects turn out looking stunning. They make any project look easy, yet you'd be hard-pressed to find someone who works as quick with nearly the same results.",
                author: {
                    name: "[REDACTED]",
                    title: "Developer",
                    imageUrl: "/images/assets/wheatley.jpg",
                },
            },
        ],
        [
            {
                body: "I'm impressed every time I see Cypher working on something. He is extremely dedicated, and always amazes me with the quality and speed of his work. His enthusiasm for his projects is clear every time I talk with him.",
                author: {
                    name: "Autumn",
                    title: "Engineering Student",
                    imageUrl:
                        "https://cdn-web.cypher.com/autumn_avatar.webp",
                },
            },
        ],
    ],
    [
        [
            {
                body: "Cypher is the most talented programmer I have had the pleasure of knowing. He can solve difficult problems using remarkable efficiency and is always happy to assist me with my own projects. Truly a person of all time.",
                author: {
                    name: "Nhat",
                    title: "Engineering Student",
                    imageUrl: "https://cdn-web.cypher.com/giggler.webp",
                },
            },
        ],
        [
            {
                body: "Cypher is one of the most skilled and knowledgeable developers I have ever worked with. He is able to take on any task and complete it with ease. He always maintains a positive attitude and a sense of humor, which makes him a joy to work with.",
                author: {
                    name: "Zemi",
                    title: "CS Student",
                    imageUrl: "https://cdn-web.cypher.com/hyper.webp",
                },
            },
        ],
    ],
];

const largeTestimonial = {
    body: "Developers that are fast, utilize the newest available technology with ease, swiftly understand what you asked for, and can immerse themselves into your project to make case-by-case decisions in a way you would've made them, are already impossible to find. What makes Cypher extraordinary is not just that, but is aided by the fact that Cypher completes such tasks in a speed you'd expect there to be a full-time paid development team on the other end rather than a singular person.",
    author: {
        name: "Erik Uden",
        title: "CEO, Uden AI",
        imageUrl: "/images/assets/erik-smiling.jpeg",
        logoUrl: "/images/logos/uden-ai.webp",
    },
};
</script>

<template>
    <Container class="px-0!">
        <div class="mx-auto max-w-xl text-center px-6 lg:px-8">
            <h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Reviews
            </h2>
        </div>

        <div class="sm:px-6 lg:px-8 mt-20">
            <LargeTestimonial :testimonial="largeTestimonial" />
        </div>

        <div
            class="mx-auto mt-16 sm:px-6 lg:px-8 grid max-w-2xl grid-cols-1 grid-rows-1 gap-6 text-sm leading-6 sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-4"
        >
            <FeaturedTestimonial
                :testimonial="featuredTestimonial"
                class="col-span-2 hidden sm:block xl:col-start-2 xl:row-end-1"
            />
            <div
                v-for="(columnGroup, columnGroupIdx) in testimonials"
                :key="columnGroupIdx"
                class="space-y-6 xl:contents xl:space-y-0"
            >
                <div
                    v-for="(column, columnIdx) in columnGroup"
                    :key="columnIdx"
                    :class="[
                    (columnGroupIdx === 0 && columnIdx === 0) ||
                        (columnGroupIdx === testimonials.length - 1 &&
                            columnIdx === columnGroup.length - 1)
                        ? 'xl:row-span-2'
                        : 'xl:row-start-1',
                    'space-y-6',
                ]"
                >
                    <SmallTestimonial
                        v-for="testimonial in column"
                        :key="testimonial.body"
                        :testimonial="testimonial"
                    />
                </div>
            </div>
        </div>
    </Container>
</template>
