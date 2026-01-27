<script lang="ts">
    import { onMount } from "svelte";
    import { MockService } from "$lib/services/mockData";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { goto } from "$app/navigation";

    let properties: Property[] = $state([]);

    onMount(async () => {
        properties = await MockService.getProperties("BUYER");
    });

    function getRiskColor(score: number) {
        if (score < 30) return "bg-green-500 hover:bg-green-600";
        if (score < 70) return "bg-yellow-500 hover:bg-yellow-600";
        return "bg-red-500 hover:bg-red-600";
    }

    function navigateToProperty(id: string) {
        goto(`/dashboard/property/${id}`);
    }
</script>

<div class="max-w-7xl mx-auto py-10 space-y-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-foreground">
                Owner Dashboard
            </h2>
            <p class="text-muted-foreground mt-2 text-sm max-w-2xl">
                View your properties and access detailed risk reports.
            </p>
        </div>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each properties as property}
            <Card.Root
                class="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onclick={() => navigateToProperty(property.id)}
            >
                <div class="aspect-video w-full overflow-hidden">
                    <img
                        src={property.imageUrl}
                        alt={property.address}
                        class="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                </div>
                <Card.Header>
                    <div class="flex justify-between items-start">
                        <Card.Title class="text-lg"
                            >{property.address}</Card.Title
                        >
                        <Badge class={getRiskColor(property.riskScore)}
                            >Risk: {property.riskScore}%</Badge
                        >
                    </div>
                    <Card.Description class="line-clamp-2"
                        >{property.description}</Card.Description
                    >
                </Card.Header>
                <Card.Content>
                    <div class="text-sm text-muted-foreground">
                        <p>Owner ID: {property.ownerId}</p>
                    </div>
                </Card.Content>
                <Card.Footer>
                    <Button
                        class="w-full"
                        variant="secondary"
                        onclick={(e) => {
                            e.stopPropagation();
                            alert(
                                `Downloading report for ${property.address}...`,
                            );
                        }}
                    >
                        Download Risk Report
                    </Button>
                </Card.Footer>
            </Card.Root>
        {/each}
        {#if properties.length === 0}
            <div class="col-span-full text-center py-10 text-muted-foreground">
                No properties found.
            </div>
        {/if}
    </div>
</div>
