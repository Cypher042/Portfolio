<script setup lang="ts">
import { DsfrFooter, DsfrHeader, DsfrSkipLinks } from "@gouvminint/vue-dsfr";
import "@gouvfr/dsfr/dist/core/core.main.min.css";
import "@gouvfr/dsfr/dist/component/component.main.min.css";
import "@gouvfr/dsfr/dist/utility/utility.main.min.css";
import "@gouvfr/dsfr/dist/scheme/scheme.min.css";
import "@gouvminint/vue-dsfr/styles";

const serviceTitle = "Ministère des câlins et de la tendresse";
const serviceDescription = "Rendre le pays plus doux, un câlin à la fois.";
const logoText = ["Ministère des", "câlins et de", "la tendresse"];

const quickLinks = [
    {
        label: "Accueil",
        to: "/pats",
        icon: { name: "ri-home-2-line", ssr: true },
    },
    {
        label: "Site Principal",
        to: "/",
        icon: { name: "ri-flag-line", ssr: true },
    },
];

const skipLinks = [
    {
        id: "content",
        text: "Accéder au contenu",
    },
    {
        id: "footer",
        text: "Accéder au pied de page",
    },
];
</script>

<template>
    <DsfrSkipLinks :links="skipLinks" />
    <DsfrHeader
        :service-title="serviceTitle"
        :service-description="serviceDescription"
        :logo-text="logoText"
        :quick-links="quickLinks"
    />
    <main id="content" role="main" class="fr-container" tabindex="0">
        <slot />
    </main>
    <DsfrFooter
        id="footer"
        tabindex="0"
        a11y-compliance-link="/"
        cookies-link="/"
        personal-data-link="/"
        legal-link="/"
    />
</template>
