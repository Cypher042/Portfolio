import { readdirSync } from "node:fs";
import { join } from "node:path";
import tailwindcss from "@tailwindcss/vite";

/*
 * Reads the content directory and returns an array of all the files in the directory and subdirectories.
 */
const getRouteRenderingPaths = () => {
    const contentDir = join(process.cwd(), "content");
    const paths: string[] = [];

    const readDir = (dir: string) => {
        const files = readdirSync(dir);
        for (const file of files) {
            const filePath = join(dir, file);
            if (file.endsWith(".md")) {
                paths.push(
                    filePath.replace(contentDir, "/blog").replace(".md", ""),
                );
            } else {
                readDir(filePath);
            }
        }
    };

    readDir(contentDir);

    return paths;
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        "@nuxtjs/seo",
        "@vueuse/nuxt",
        "@nuxt/fonts",
        "@nuxt/image",
        "@nuxtjs/plausible",
        "@nuxt/content",
        "shadcn-nuxt",
        "@pinia/nuxt",
    ],
    vite: {
        plugins: [tailwindcss()],
    },
    css: ["~/styles/index.css"],
    app: {
        head: {
            link: [
                {
                    rel: "icon",
                    href: "/favicon.png",
                    type: "image/png",
                },
            ],
            htmlAttrs: { lang: "en-us", class: "dark" },
        },
    },
    image: {
        domains: [
            "cdn.cypher.com",
            "cdn-web.cypher.com",
            "s3.kitsunes.club",
            "unsplash.com",
            "cypher.com",
        ],
        format: ["webp"],
        ipx: {
            maxAge: 60 * 60 * 24 * 365,
            sharpOptions: {
                animated: true,
            },
        },
    },
    nitro: {
        preset: "static",
        minify: true,
        prerender: {
            failOnError: true,
            crawlLinks: true,
            routes: ["/.well-known/webfinger"],
        },
    },
    sitemap: {
        sources: [...getRouteRenderingPaths(), "/", "/contact"],
    },
    fonts: {
        defaults: {
            weights: [400, 500, 600, 700],
        },
    },
    plausible: {
        ignoredHostnames: ["localhost"],
        apiHost: "https://logs.cypher.com",
        autoOutboundTracking: true,
    },
    compatibilityDate: "2025-05-11",
    site: {
        url: "https://cypher.com",
    },
    devtools: {
        enabled: true,
    },
});
