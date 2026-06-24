<script setup lang="ts">
import {
    DsfrButton,
    DsfrCheckboxSet,
    type DsfrCheckboxSetProps,
    DsfrInput,
    DsfrNotice,
    DsfrRadioButtonSet,
} from "@gouvminint/vue-dsfr";

definePageMeta({
    layout: "gouv",
});

useHead({
    title: "Page d’accueil • Gouvernement",
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon-gouv.ico" }],
});

const params = useUrlSearchParams();

const cbOptions: DsfrCheckboxSetProps["options"] = [
    {
        name: "qualifiers-1",
        label: "Affectueux·se",
        value: "affectueux",
    },
    {
        name: "qualifiers-2",
        label: "Mignon·ne",
        value: "mignon",
    },
    {
        name: "qualifiers-3",
        label: "Gentil·le",
        value: "gentil",
    },
    {
        name: "qualifiers-4",
        label: "Sympathique",
        value: "sympathique",
    },
];
const checkboxSexValue = ref([]);
const radioButtonValue = ref(0);
const loading = ref(false);

const sendForm = async (event: Event) => {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const data = Object.fromEntries(formData.entries()) as {
        firstname: string;
        lastname: string;
        calinage: string;
        address: string;
        "qualifiers-1"?: string;
        "qualifiers-2"?: string;
        "qualifiers-3"?: string;
        "qualifiers-4"?: string;
    };

    // Disable the form while sending the message
    loading.value = true;

    const { ok, text } = await fetch("https://ntfy.sh/3MFIHQw4F23Gs7dz", {
        method: "PUT",
        body: `Prénom: ${data.firstname}\nNom: ${data.lastname}\nCâliné·e: ${
            data.calinage === "yes" ? "Oui" : "Non"
        }\nQualificateurs: ${Object.entries(data)
            .filter(([key]) => key.startsWith("qualifiers-"))
            .map(([, value]) => value)
            .join(", ")}\nCourriel: ${data.address}`,
        headers: {
            Title: "Notification du Ministere",
        },
    });

    if (!ok) {
        alert("Failed to send message. Check console for more information.");
        console.error(await text());

        loading.value = false;

        return;
    }

    // Redirect to /pats?sent=true
    window.location.href = "/pats?sent=true";
};
</script>

<template>
    <div class="fr-container fr-mb-5w">
        <h1 class="fr-mt-3w fr-mt-md-5w fr-mb-5w">Accueil</h1>

        <p>
            Remplissez ce formulaire rapide afin de valider votre éligibilité à
            un câlin du ministère.
        </p>

        <DsfrNotice
            v-if="params.sent"
            title="Votre demande a été envoyée"
            class="mb-5"
        />

        <form @submit.prevent="sendForm" class="space-y-5">
            <div>
                <DsfrInput
                    :disabled="loading"
                    name="firstname"
                    label="Prénom"
                    label-visible
                    required
                />
            </div>

            <div>
                <DsfrInput
                    :disabled="loading"
                    name="lastname"
                    label="Nom"
                    label-visible
                    required
                />
            </div>

            <div>
                <DsfrRadioButtonSet
                    :disabled="loading"
                    name="calinage"
                    v-model="radioButtonValue"
                    legend="Avez-vous déjà été câliné par le ministère ?"
                    :options="[
                        {
                            label: 'Oui',
                            value: 'yes',
                        },
                        {
                            label: 'Non',
                            value: 'no',
                        },
                    ]"
                    required
                />
            </div>

            <div>
                <DsfrCheckboxSet
                    :disabled="loading"
                    name="qualifiers"
                    v-model="checkboxSexValue"
                    legend="Lesquels de ces qualificateurs vous décrivent?"
                    :options="cbOptions"
                />
            </div>

            <div>
                <DsfrInput
                    :disabled="loading"
                    label="Courriel"
                    name="address"
                    type="email"
                    hint="Vous pouvez aussi utiliser votre addresse Fedi."
                    label-visible
                    required
                />
            </div>

            <DsfrButton :disabled="loading" type="submit" label="Confirmer" />
        </form>
    </div>
</template>

<style scoped>
.custom-required {
    color: red;
}
</style>
