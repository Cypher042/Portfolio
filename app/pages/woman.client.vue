<template>
    <div
        class="p-2 max-w-7xl mx-auto flex items-center justify-center min-h-screen"
    >
        <WomanRenderer v-if="data" :data="data" />
        <WomanEncryptionGate
            v-else
            :loading="decrypting"
            :error="error"
            :cache="passphraseCache"
            @decrypt="decryptData"
        />
    </div>
</template>

<script lang="ts" setup>
import { armor, Decrypter } from "age-encryption";
import encryptedData from "~~/public/data/data.age?raw";
import type { Data } from "~~/types.ts";

const data = ref<Data | null>(null);
const error = ref<string | undefined>(undefined);
const decrypting = ref(false);
const passphraseCache = useLocalStorage<string>("woman-passphrase", "");

const decryptData = async (passphrase: string): Promise<void> => {
    decrypting.value = true;
    await new Promise((r) => setTimeout(r, 100)); // Allow UI to update, nextTick doesn't work here for some reason

    const decrypter = new Decrypter();
    decrypter.addPassphrase(passphrase);

    const decoded = armor.decode(encryptedData);

    try {
        const decrypted = await decrypter.decrypt(decoded, "text");
        data.value = JSON.parse(decrypted) as Data;

        passphraseCache.value = passphrase;
    } catch {
        error.value =
            "Decryption failed. Please check your passphrase and try again.";
    }
    decrypting.value = false;
};
</script>
