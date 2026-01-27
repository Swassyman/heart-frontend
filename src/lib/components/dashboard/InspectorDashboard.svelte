<script lang="ts">
    import { onMount } from "svelte";
    import { MockService } from "$lib/services/mockData";
    import type { Property, Inspection } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";

    let properties: Property[] = $state([]);
    let selectedPropertyId = $state<string>("");
    let summary = $state("");
    let isSubmitting = $state(false);

    onMount(async () => {
        properties = await MockService.getProperties("INSPECTOR");
        if (properties.length > 0) selectedPropertyId = properties[0].id;
    });

    async function handleSubmit() {
        if (!selectedPropertyId) return;
        isSubmitting = true;
        await MockService.submitInspection({
            propertyId: selectedPropertyId,
            inspectorId: "current-inspector",
            date: new Date().toISOString(),
            summary,
            status: "COMPLETED",
            riskScore: Math.floor(Math.random() * 100), // Random risk for demo
            images: [], // Mock empty images
        });
        isSubmitting = false;
        alert("Inspection submitted successfully!");
        summary = "";
    }
</script>

<div class="grid gap-6 md:grid-cols-2">
    <div class="space-y-6">
        <h2 class="text-xl font-semibold">New Inspection</h2>
        <Card.Root>
            <Card.Header>
                <Card.Title>Inspection Details</Card.Title>
                <Card.Description
                    >Fill out the form below to submit a new risk assessment.</Card.Description
                >
            </Card.Header>
            <Card.Content class="space-y-4">
                <div class="space-y-2">
                    <Label for="property">Select Property</Label>
                    <select
                        id="property"
                        bind:value={selectedPropertyId}
                        class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {#each properties as property}
                            <option value={property.id}
                                >{property.address}</option
                            >
                        {/each}
                    </select>
                </div>

                <div class="space-y-2">
                    <Label for="summary">Inspection Summary</Label>
                    <Textarea
                        id="summary"
                        placeholder="Describe hazards, structural integrity, etc."
                        bind:value={summary}
                    />
                </div>

                <div class="space-y-2">
                    <Label>Images</Label>
                    <div
                        class="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                        <p>Drag and drop images here, or click to upload</p>
                        <p class="text-xs mt-2">(Mock functionality)</p>
                    </div>
                </div>
            </Card.Content>
            <Card.Footer>
                <Button
                    class="w-full"
                    onclick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? "Generating Report..."
                        : "Submit Inspection & Generate Risk Score"}
                </Button>
            </Card.Footer>
        </Card.Root>
    </div>

    <div>
        <h2 class="text-xl font-semibold mb-6">Recent Activity</h2>
        <Card.Root>
            <Card.Content class="p-6 text-sm text-muted-foreground text-center">
                No recent inspections found.
            </Card.Content>
        </Card.Root>
    </div>
</div>
