<script lang="ts">
    import { onMount } from "svelte";
    import { MockService } from "$lib/services/mockData";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";

    let properties: Property[] = $state([]);

    onMount(async () => {
        properties = await MockService.getProperties("BUILDER");
    });

    function getRiskVariant(
        score: number,
    ): "default" | "secondary" | "destructive" | "outline" {
        if (score > 70) return "destructive";
        if (score > 30) return "secondary"; // yellow-ish usually, mapping to secondary for now or custom class
        return "outline"; // green-ish usually
    }
</script>

<div class="space-y-6">
    <h2 class="text-xl font-semibold">Project Overview</h2>

    <Card.Root>
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.Head>Address</Table.Head>
                    <Table.Head>Owner</Table.Head>
                    <Table.Head>Risk Score</Table.Head>
                    <Table.Head>Technical Summary</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each properties as property}
                    <Table.Row>
                        <Table.Cell class="font-medium"
                            >{property.address}</Table.Cell
                        >
                        <Table.Cell>{property.owner}</Table.Cell>
                        <Table.Cell>
                            <Badge variant={getRiskVariant(property.riskScore)}
                                >{property.riskScore}</Badge
                            >
                        </Table.Cell>
                        <Table.Cell>
                            {#if property.technicalDetails}
                                <div
                                    class="text-xs text-muted-foreground space-y-1"
                                >
                                    <div>
                                        Roof: {property.technicalDetails.roof}
                                    </div>
                                    <div>
                                        Fnd: {property.technicalDetails
                                            .foundation}
                                    </div>
                                </div>
                            {:else}
                                <span class="text-muted-foreground">-</span>
                            {/if}
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</div>
