<script lang="ts">
    import { onMount } from "svelte";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { goto } from "$app/navigation";
    import { authStore } from "$lib/stores/auth";
    import { get } from "svelte/store";
    import { downloadReport } from "$lib/services/reportService";

    let properties: Property[] = $state([]);
    let pdfLoading = $state(false);

    onMount(async () => {
        const user = get(authStore);
        if (user && user.id) {
            try {
                const res = await fetch(
                    `http://localhost:3000/property/owner/${user.id}`,
                );
                if (res.ok) {
                    const data = await res.json();
                    // Map backend keys to frontend model
                    properties = data.map((p: any) => ({
                        id: p.PROPERTY_ID || p.property_id,
                        address: p.ADDRESS || p.address,
                        owner: p.OWNER_NAME || "Unknown",
                        ownerId: p.USER_ID || p.user_id,
                        riskScore: p.RISK_SCORE
                            ? Math.round(p.RISK_SCORE * 100)
                            : 0,
                        imageUrl:
                            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80", // Fallback image
                        description:
                            p.DESCRIPTION ||
                            p.description ||
                            "No description available",
                    }));
                } else {
                    console.error(
                        "Failed to fetch properties:",
                        await res.text(),
                    );
                }

                // Fetch risk scores for all properties in parallel
                await Promise.all(
                    properties.map(async (property, index) => {
                        try {
                            const riskRes = await fetch(
                                `http://localhost:3000/property/${property.id}/risk-score`,
                            );
                            if (riskRes.ok) {
                                const riskData = await riskRes.json();
                                const score =
                                    riskData.PROPERTY_RISK_SCORE ??
                                    riskData.property_risk_score;
                                if (score !== undefined) {
                                    properties[index].riskScore = Math.round(
                                        score * 100,
                                    );
                                }
                            }
                        } catch (e) {
                            console.warn(
                                `Could not fetch risk score for property ${property.id}`,
                                e,
                            );
                        }
                    }),
                );
            } catch (err) {
                console.error("Error fetching properties:", err);
            }
        }
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
                    <div class="flex gap-2 w-full">
                        <Button
                            class="flex-1"
                            variant="secondary"
                            onclick={async (e) => {
                                e.stopPropagation();
                                await downloadReport(
                                    property.id,
                                    "Buyer",
                                    "en",
                                );
                            }}
                        >
                            Report (En)
                        </Button>
                        <Button
                            class="flex-1"
                            variant="outline"
                            onclick={async (e) => {
                                e.stopPropagation();
                                await downloadReport(
                                    property.id,
                                    "Buyer",
                                    "ml",
                                );
                            }}
                        >
                            Report (Ml)
                        </Button>
                    </div>
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
