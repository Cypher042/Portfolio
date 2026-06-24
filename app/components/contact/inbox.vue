<template>
    <section class="flex flex-col gap-8">
        <div>
            <h2
                class="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl"
            >
                Inbox
            </h2>
            <p
                class="mt-6 text-lg leading-8 text-secondary-foreground max-w-xl"
            >
                Go ahead, send me an anonymous message, you coward. It'll pop up
                on my phone.
            </p>
        </div>
        <form action="#" @submit.prevent="submit">
            <Card class="max-w-2xl p-0 gap-0">
                <Label for="author" class="sr-only">Author</Label>
                <Input
                    type="text"
                    name="author"
                    id="author"
                    class="bg-transparent! border-0! ring-0! h-12 font-semibold"
                    placeholder="Author"
                />
                <Label for="messageBody" class="sr-only">Message body</Label>
                <Textarea
                    rows="3"
                    name="messageBody"
                    id="messageBody"
                    class="resize-none border-0! bg-transparent! ring-0!"
                    placeholder="I like your website, consider adding more Portal 2 songs."
                />
                <div class="flex items-center justify-end p-2">
                    <Button type="submit">Send</Button>
                </div>
            </Card>
        </form>
    </section>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const submit = async (event: Event) => {
    const form = event.target as HTMLFormElement;
    const authorElement = form.elements.namedItem("author") as HTMLInputElement;
    const messageBodyElement = form.elements.namedItem(
        "messageBody",
    ) as HTMLTextAreaElement;

    const author = authorElement.value;
    const messageBody = messageBodyElement.value;

    if (!messageBody) {
        return;
    }

    const { ok, text } = await fetch("https://ntfy.sh/3MFIHQw4F23Gs7dz", {
        method: "PUT",
        body: messageBody,
        headers: {
            Title: author || "Anonymous",
        },
    });

    if (!ok) {
        alert("Failed to send message. Check console for more information.");
        console.error(await text());

        return;
    }

    toast.success("Message sent!", {
        duration: 5000,
    });

    // Reset the form
    authorElement.value = "";
    messageBodyElement.value = "";
};
</script>
