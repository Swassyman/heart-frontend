<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table";
    import { Badge } from "$lib/components/ui/badge";
    import { authStore } from "$lib/stores/auth";
    import { get } from "svelte/store";
    import { downloadReport } from "$lib/services/reportService";
    import Button from "$lib/components/ui/button/button.svelte";

    let properties: Property[] = $state([]);
    let generatingPdfId = $state<string | null>(null);

    onMount(async () => {
        const user = get(authStore);
        if (user && user.id) {
            try {
                const res = await fetch(
                    `http://localhost:3000/user/${user.id}/properties`,
                );
                if (res.ok) {
                    const data = await res.json();
                    properties = data.map((p: any) => ({
                        id: p.PROPERTY_ID || p.property_id,
                        address: p.ADDRESS || p.address,
                        owner: p.OWNER_NAME || "Unknown",
                        ownerId: p.OWNER_ID || p.owner_id,
                        riskScore: p.RISK_SCORE
                            ? Math.round(p.RISK_SCORE * 100)
                            : 0,
                        imageUrl:
                            "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
                        description:
                            p.DESCRIPTION ||
                            p.description ||
                            "No description available",
                        technicalDetails: {
                            // Mock technical details if not in DB flat table
                            roof: "Standard",
                            foundation: "Standard",
                            electrical: "Standard",
                            plumbing: "Standard",
                        },
                    }));
                } else {
                    console.error(
                        "Failed to fetch properties:",
                        await res.text(),
                    );
                }
            } catch (err) {
                console.error("Error fetching properties:", err);
            }
        }
    });

    function getRiskVariant(
        score: number,
    ): "default" | "secondary" | "destructive" | "outline" {
        if (score > 70) return "destructive";
        if (score > 30) return "secondary";
        return "outline";
    }

    function navigateToProperty(id: string) {
        goto(`/dashboard/property/${id}`);
    }
</script>

<div class="max-w-7xl mx-auto py-10 space-y-8 px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between">
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-foreground">
                Contractor Dashboard
            </h2>
            <p class="text-muted-foreground mt-2 text-sm max-w-2xl">
                Manage your active projects, track risk assessments, and monitor
                technical status.
            </p>
        </div>
    </div>

    <Card.Root
        class="shadow-sm border-border/60 bg-card/50 backdrop-blur-[2px]"
    >
        <Table.Root>
            <Table.Header>
                <Table.Row
                    class="hover:bg-transparent border-b border-border/60"
                >
                    <Table.Head
                        class="w-[300px] h-14 pl-6 uppercase text-xs tracking-wider font-semibold text-muted-foreground"
                        >Address</Table.Head
                    >
                    <Table.Head
                        class="h-14 uppercase text-xs tracking-wider font-semibold text-muted-foreground"
                        >Contractor</Table.Head
                    >
                    <Table.Head
                        class="h-14 uppercase text-xs tracking-wider font-semibold text-muted-foreground"
                        >Risk Score</Table.Head
                    >
                    <Table.Head
                        class="h-14 uppercase text-xs tracking-wider font-semibold text-muted-foreground"
                        >Report</Table.Head
                    >
                    <Table.Head
                        class="h-14 uppercase text-xs tracking-wider font-semibold text-muted-foreground"
                        >Technical Summary</Table.Head
                    >
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {#each properties as property}
                    <Table.Row
                        class="h-20 hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0 cursor-pointer"
                        onclick={() => navigateToProperty(property.id)}
                    >
                        <Table.Cell class="font-medium pl-6">
                            <div class="flex flex-col">
                                <span
                                    class="text-base font-semibold text-foreground/90"
                                    >{property.address}</span
                                >
                                <span
                                    class="text-xs text-muted-foreground font-light mt-0.5"
                                    >ID: {property.id.slice(0, 8)}</span
                                >
                            </div>
                        </Table.Cell>
                        <Table.Cell>
                            <span class="text-sm text-foreground/80"
                                >{property.owner}</span
                            >
                        </Table.Cell>
                        <Table.Cell>
                            <Badge
                                variant={getRiskVariant(property.riskScore)}
                                class="px-2.5 py-0.5 text-xs font-medium"
                            >
                                {property.riskScore}%
                            </Badge>
                        </Table.Cell>
                        <Table.Cell>
                            <Button
                                variant="outline"
                                size="sm"
                                onclick={(e) => {
                                    e.stopPropagation();
                                    downloadReport(property.id, "Builder");
                                }}
                            >
                                Generate PDF
                            </Button>
                        </Table.Cell>
                        <Table.Cell>
                            {#if property.technicalDetails}
                                <div
                                    class="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground"
                                >
                                    <div class="flex items-center gap-1.5">
                                        <div
                                            class="w-1 h-1 rounded-full bg-foreground/20"
                                        ></div>
                                        <span
                                            >Roof: <span
                                                class="text-foreground/70 font-medium"
                                                >{property.technicalDetails
                                                    .roof}</span
                                            ></span
                                        >
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <div
                                            class="w-1 h-1 rounded-full bg-foreground/20"
                                        ></div>
                                        <span
                                            >Fnd: <span
                                                class="text-foreground/70 font-medium"
                                                >{property.technicalDetails
                                                    .foundation}</span
                                            ></span
                                        >
                                    </div>
                                </div>
                            {:else}
                                <span
                                    class="text-muted-foreground/50 text-xs italic"
                                    >No details available</span
                                >
                            {/if}
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Root>
</div>
