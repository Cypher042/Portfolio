<template>
    <div
        class="bg-background z-100 fixed inset-0 flex flex-col items-center justify-center gap-6 p-6 md:p-10"
    >
        <div class="w-full max-w-sm">
            <div class="flex flex-col gap-6">
                <form
                    @submit.prevent="emit('decrypt', (($event.target as any).passphrase as HTMLInputElement).value)"
                >
                    <FieldGroup>
                        <div
                            class="flex flex-col items-center gap-2 text-center"
                        >
                            <div
                                class="flex size-8 items-center justify-center rounded-md"
                            >
                                <LockKeyhole class="size-6" />
                            </div>
                            <h1 class="text-xl font-bold">Encrypted Content</h1>
                            <FieldDescription class="text-center max-w-xs">
                                This content is encrypted to protect sensitive
                                data, and requires a passphrase to access.
                            </FieldDescription>
                        </div>
                        <Field :data-invalid="!!error">
                            <FieldLabel for="passphrase">Passphrase</FieldLabel>
                            <Input
                                id="passphrase"
                                type="text"
                                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx"
                                required
                                :disabled="loading"
                                :aria-invalid="!!error"
                            />
                            <FieldError v-if="error">{{ error }}</FieldError>
                        </Field>
                        <Field>
                            <Button type="submit" :disabled="loading">
                                <Spinner v-if="loading" />
                                {{ loading ? "Decrypting..." : "Decrypt" }}
                            </Button>
                            <Button
                                v-if="cache"
                                :disabled="loading"
                                variant="secondary"
                                type="button"
                                @click="emit('decrypt', cache)"
                            >
                                Use Cached Passphrase
                            </Button>
                        </Field>
                    </FieldGroup>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { LockKeyhole } from "@lucide/vue";
import { Button } from "../ui/button";
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";

const {
    error,
    loading = false,
    cache,
} = defineProps<{
    error?: string;
    loading?: boolean;
    cache?: string;
}>();

const emit = defineEmits<{
    decrypt: [passphrase: string];
}>();
</script>
