<script lang="ts">
    import { onMount } from "svelte";
    import { MockService } from "$lib/services/mockData";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Textarea } from "$lib/components/ui/textarea";
    import { Plus, Trash2, Camera } from "lucide-svelte";
    import { Badge } from "$lib/components/ui/badge";

    let properties: Property[] = $state([]);
    let selectedPropertyId = $state<string>("");
    let summary = $state("");
    let isSubmitting = $state(false);

    // Finding Model
    interface Finding {
        id: string;
        room: string;
        description: string;
        severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    }

    let findings = $state<Finding[]>([]);

    // Form inputs for new finding
    let newFindingRoom = $state("");
    let newFindingDesc = $state("");
    let newFindingSeverity = $state<"LOW" | "MEDIUM" | "HIGH" | "CRITICAL">(
        "LOW",
    );

    onMount(async () => {
        properties = await MockService.getProperties("INSPECTOR");
        if (properties.length > 0) selectedPropertyId = properties[0].id;
    });

    function addFinding() {
        if (!newFindingDesc) return;

        findings = [
            ...findings,
            {
                id: crypto.randomUUID(),
                room: newFindingRoom || "General",
                description: newFindingDesc,
                severity: newFindingSeverity,
            },
        ];

        // Reset inputs
        newFindingDesc = "";
        newFindingRoom = "";
        newFindingSeverity = "LOW";
    }

    function removeFinding(id: string) {
        findings = findings.filter((f) => f.id !== id);
    }

    async function handleSubmit() {
        if (!selectedPropertyId) return;
        isSubmitting = true;

        // Mock Submission
        console.log("Submitting Inspection:", {
            propertyId: selectedPropertyId,
            summary,
            findings,
        });

        await new Promise((r) => setTimeout(r, 1000)); // Fake network delay

        isSubmitting = false;
        alert("Inspection submitted successfully!");

        // Reset Form
        summary = "";
        findings = [];
    }

    function getSeverityColor(sev: string) {
        switch (sev) {
            case "CRITICAL":
                return "destructive";
            case "HIGH":
                return "destructive";
            case "MEDIUM":
                return "secondary";
            default:
                return "outline"; // LOW
        }
    }
</script>

<div class="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
    <div>
        <h2 class="text-3xl font-bold tracking-tight text-foreground">
            Inspector Dashboard
        </h2>
        <p class="text-muted-foreground mt-2">
            Submit detailed risk assessments and findings.
        </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
            <Card.Root>
                <Card.Header>
                    <Card.Title>New Inspection Event</Card.Title>
                </Card.Header>
                <Card.Content class="space-y-6">
                    <div class="space-y-2">
                        <Label for="property">Select Property</Label>
                        <select
                            id="property"
                            bind:value={selectedPropertyId}
                            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {#each properties as property}
                                <option value={property.id}
                                    >{property.address}</option
                                >
                            {/each}
                        </select>
                    </div>

                    <div class="space-y-2">
                        <Label for="summary">Overall Summary</Label>
                        <Textarea
                            id="summary"
                            placeholder="General observations about the property..."
                            bind:value={summary}
                            class="min-h-[100px]"
                        />
                    </div>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header>
                    <div class="flex items-center justify-between">
                        <Card.Title>Findings</Card.Title>
                        <Badge variant="outline"
                            >{findings.length} findings</Badge
                        >
                    </div>
                </Card.Header>
                <Card.Content class="space-y-6">
                    <!-- Add New Finding Form -->
                    <div class="grid gap-4 p-4 border rounded-lg bg-muted/30">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="space-y-2">
                                <Label for="room">Room / Location</Label>
                                <Input
                                    id="room"
                                    placeholder="e.g. Master Bath"
                                    bind:value={newFindingRoom}
                                />
                            </div>
                            <div class="space-y-2">
                                <Label for="severity">Severity</Label>
                                <select
                                    id="severity"
                                    bind:value={newFindingSeverity}
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                    <option value="CRITICAL">Critical</option>
                                </select>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <Label for="description">Finding Description</Label>
                            <Input
                                id="description"
                                placeholder="Describe the issue..."
                                bind:value={newFindingDesc}
                            />
                        </div>
                        <Button
                            variant="secondary"
                            onclick={addFinding}
                            class="w-full gap-2"
                        >
                            <Plus class="w-4 h-4" /> Add Finding
                        </Button>
                    </div>

                    <!-- Findings List -->
                    <div class="space-y-3">
                        {#each findings as finding (finding.id)}
                            <div
                                class="flex items-start justify-between p-3 border rounded-md bg-card shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <Badge
                                            variant={getSeverityColor(
                                                finding.severity,
                                            )}>{finding.severity}</Badge
                                        >
                                        <span
                                            class="font-medium text-sm text-muted-foreground"
                                            >{finding.room}</span
                                        >
                                    </div>
                                    <p class="text-sm font-medium">
                                        {finding.description}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="text-muted-foreground hover:text-destructive h-8 w-8"
                                    onclick={() => removeFinding(finding.id)}
                                >
                                    <Trash2 class="w-4 h-4" />
                                </Button>
                            </div>
                        {:else}
                            <p
                                class="text-center text-sm text-muted-foreground py-4"
                            >
                                No findings added yet.
                            </p>
                        {/each}
                    </div>
                </Card.Content>
            </Card.Root>

            <Button
                size="lg"
                class="w-full"
                onclick={handleSubmit}
                disabled={isSubmitting || findings.length === 0}
            >
                {isSubmitting ? "Submitting..." : "Submit Complete Inspection"}
            </Button>
        </div>

        <!-- Sidebar / Recent -->
        <div class="space-y-6">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Quick Actions</Card.Title>
                </Card.Header>
                <Card.Content class="space-y-2">
                    <Button
                        variant="outline"
                        class="w-full justify-start gap-2"
                    >
                        <Camera class="w-4 h-4" /> Upload Photos
                    </Button>
                </Card.Content>
            </Card.Root>

            <Card.Root>
                <Card.Header>
                    <Card.Title class="text-lg">Stats</Card.Title>
                </Card.Header>
                <Card.Content class="space-y-4">
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground"
                            >Inspections Today</span
                        >
                        <span class="font-medium">0</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-muted-foreground"
                            >Pending Reports</span
                        >
                        <span class="font-medium">0</span>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
