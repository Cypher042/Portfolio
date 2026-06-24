<script setup lang="ts">
import { Info } from "@lucide/vue";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { Data } from "~~/types";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card } from "../ui/card";

const { data } = defineProps<{
    data: Data;
}>();
</script>

<template>
    <div class="flex flex-col gap-4 w-full">
        <Alert variant="default" class="max-w-fit mx-auto">
            <Info />
            <AlertTitle>This data is incomplete.</AlertTitle>
            <AlertDescription>
                <p>
                    This is a work in progress. More parts and information will
                    be added over time.
                </p>
            </AlertDescription>
        </Alert>

        <Card class="outline-none! overflow-x-auto p-4 md:p-6">
            <Table class="min-w-4xl">
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-25">Name</TableHead>
                        <TableHead>Characteristics</TableHead>
                        <TableHead>Uses</TableHead>
                        <TableHead>Triggers</TableHead>
                        <TableHead>Emotional Distance</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Episodes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="part in data.parts" :key="part.name">
                        <TableCell class="font-medium">
                            {{ part.name }}
                        </TableCell>
                        <TableCell class="whitespace-pre-wrap">
                            {{ part.characteristics }}
                        </TableCell>
                        <TableCell>{{ part.uses }}</TableCell>
                        <TableCell>{{ part.triggers }}</TableCell>
                        <TableCell class="whitespace-pre-wrap">
                            {{ part.emotional_distance }}
                        </TableCell>
                        <TableCell class="whitespace-pre-wrap">
                            {{ part.notes }}
                        </TableCell>
                        <TableCell class="whitespace-pre-wrap">
                            {{ part.episodes }}
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </Card>
    </div>
</template>
