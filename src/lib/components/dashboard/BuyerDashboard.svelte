<script lang="ts">
    import { onMount } from "svelte";
    import { MockService } from "$lib/services/mockData";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Badge } from "$lib/components/ui/badge";

    let properties: Property[] = $state([]);

    onMount(async () => {
        properties = await MockService.getProperties("BUYER");
    });

    function getRiskColor(score: number) {
        if (score < 30) return "bg-green-500 hover:bg-green-600";
        if (score < 70) return "bg-yellow-500 hover:bg-yellow-600";
        return "bg-red-500 hover:bg-red-600";
    }
</script>

<div class="space-y-6">
    <h2 class="text-xl font-semibold">Your Properties</h2>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#each properties as property}
            <Card.Root class="overflow-hidden">
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
                            >Risk: {property.riskScore}</Badge
                        >
                    </div>
                    <Card.Description>{property.description}</Card.Description>
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
                        onclick={() =>
                            alert(
                                `Downloading report for ${property.address}...`,
                            )}
                    >
                        Download Risk Report
                    </Button>
                </Card.Footer>
            </Card.Root>
        {/each}
    </div>
</div>
