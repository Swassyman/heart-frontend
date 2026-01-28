<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import type { Property } from "$lib/types";
    import * as Card from "$lib/components/ui/card";
    import { Badge } from "$lib/components/ui/badge";
    import * as Tabs from "$lib/components/ui/tabs";
    import {
        ArrowLeft,
        AlertTriangle,
        AlertOctagon,
        Info,
        FileText,
        Sparkles,
    } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";

    let property: Property | null = $state(null);
    let loading = $state(true);
    let analyzing = $state(false);
    let pdfUrl: string | null = $state(null);

    async function runAnalysis() {
        if (!property) return;
        analyzing = true;
        try {
            const res = await fetch(
                `http://localhost:3000/property/${property.id}/analyze`,
                {
                    method: "POST",
                },
            );

            if (res.ok) {
                const data = await res.json();

                // Update PDF URL
                if (data.pdf_report) {
                    pdfUrl = `http://localhost:3000${data.pdf_report}`;
                }

                // Update Root Causes
                if (data.analysis && data.analysis.rootCauses) {
                    property.rootCauses = data.analysis.rootCauses.map(
                        (rc: any) => ({
                            rootCause: rc.cause,
                            defectType: "AI Identified",
                            roomId: rc.affectedSystems.join(", "),
                            confidence:
                                rc.confidence === "high"
                                    ? 0.9
                                    : rc.confidence === "medium"
                                      ? 0.6
                                      : 0.3,
                            supportingSignals: "AI Analysis",
                            reasoning: rc.reasoning,
                        }),
                    );
                }

                // Update Future Predictions
                if (
                    data.future_predictions &&
                    data.future_predictions.predictions
                ) {
                    property.futureEvents =
                        data.future_predictions.predictions.map((fp: any) => ({
                            eventName: fp.defectType,
                            probability: fp.likelihood,
                            severity:
                                fp.likelihood === "high"
                                    ? "HIGH"
                                    : fp.likelihood === "medium"
                                      ? "MEDIUM"
                                      : "LOW",
                            roomId: fp.relatedRootCause || "General",
                            timeframe: fp.timeframe,
                            preventiveMeasures: fp.preventiveMeasures,
                        }));
                }
            } else {
                console.error("Analysis failed");
            }
        } catch (e) {
            console.error("Error running analysis", e);
        } finally {
            analyzing = false;
        }
    }

    onMount(async () => {
        const id = $page.params.id;
        if (id) {
            try {
                // 1. Fetch Property Details (Real API)
                const propRes = await fetch(
                    `http://localhost:3000/property/${id}`,
                );

                if (propRes.ok) {
                    const p = await propRes.json();

                    const newProperty: Property = {
                        id: p.PROPERTY_ID || p.property_id,
                        address: p.ADDRESS || p.address,
                        owner: p.OWNER_NAME || "Unknown",
                        ownerId: p.USER_ID || p.user_id,
                        riskScore: p.PROPERTY_RISK_SCORE
                            ? Math.round(p.RISK_SCORE * 100)
                            : 0,
                        imageUrl:
                            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=800&q=80",
                        description:
                            p.DESCRIPTION ||
                            p.description ||
                            "No description available",
                        technicalDetails: {
                            roof: "Standard",
                            foundation: "Standard",
                            electrical: "Standard",
                            plumbing: "Standard",
                        },
                        findings: [],
                        alerts: [],
                        // Initialize other arrays primarily
                        rootCauses: [],
                        futureEvents: [],
                    };

                    property = newProperty;
                } else {
                    console.error("Failed to fetch property details");
                    loading = false;
                    return;
                }
            } catch (err) {
                console.error("Error fetching generic details:", err);
                loading = false;
                return;
            }

            try {
                const res = await fetch(
                    `http://localhost:3000/property/${id}/defects`,
                );
                if (res.ok) {
                    const defects = await res.json();

                    // Map Snowflake uppercase keys to our frontend model
                    if (property) {
                        property.findings = defects.map((d: any) => ({
                            id: d.FINDING_ID || d.finding_id,
                            defectType: d.DEFECT_TYPE || d.defect_type,
                            severity: d.SEVERITY || d.severity,
                            roomId: d.OBSERVATION_ZONE || d.observation_zone,
                            confidence: d.CONFIDENCE || d.confidence,
                            observationText:
                                d.OBSERVATION_TEXT || d.observation_text,
                        }));
                    }
                } else {
                    console.error("Failed to fetch defects:", await res.text());
                }
            } catch (err) {
                console.error("Error connecting to defects API:", err);
            }

            // 2. Fetch Risk Score
            try {
                const res = await fetch(
                    `http://localhost:3000/property/${id}/risk-score`,
                );
                if (res.ok) {
                    const riskData = await res.json();
                    if (riskData) {
                        const score =
                            riskData.PROPERTY_RISK_SCORE ??
                            riskData.property_risk_score;
                        if (score !== undefined && property) {
                            property.riskScore = Math.round(score * 100);
                        }
                    }
                }
            } catch (err) {
                console.error("Error fetching risk score:", err);
            }

            // 3. Fetch Room Alerts
            if (property && property.findings && property.findings.length > 0) {
                const uniqueRooms = [
                    ...new Set(
                        property.findings.map((f) => f.roomId).filter(Boolean),
                    ),
                ];
                const allAlerts = [];

                for (const room of uniqueRooms) {
                    try {
                        const encodedRoom = encodeURIComponent(room);
                        const res = await fetch(
                            `http://localhost:3000/room/${encodedRoom}/alerts`,
                        );
                        if (res.ok) {
                            const roomAlerts = await res.json();
                            const mappedAlerts = roomAlerts.map((a: any) => ({
                                id: a.ALERT_ID || a.alert_id,
                                level: "ROOM",
                                entityId: room,
                                riskScore: a.RISK_SCORE || a.risk_score,
                                type: a.ALERT_TYPE || a.alert_type,
                                message: a.ALERT_MESSAGE || a.alert_message,
                                createdAt: a.CREATED_AT || a.created_at,
                            }));
                            allAlerts.push(...mappedAlerts);
                        }
                    } catch (err) {
                        console.error(
                            `Error fetching alerts for room ${room}:`,
                            err,
                        );
                    }
                }

                if (allAlerts.length > 0) {
                    property.alerts = allAlerts;
                }
            }
        }
        loading = false;
    });

    function getSeverityColor(severity: string) {
        switch (severity) {
            case "CRITICAL":
                return "bg-red-500/10 text-red-600 border-red-200";
            case "HIGH":
                return "bg-orange-500/10 text-orange-600 border-orange-200";
            case "MEDIUM":
                return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
            case "LOW":
                return "bg-green-500/10 text-green-600 border-green-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    function getRiskColor(score: number) {
        if (score >= 80) return "text-destructive";
        if (score >= 50) return "text-orange-600";
        return "text-green-600";
    }
</script>

<div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Back Button -->
    <a
        href="/dashboard"
        class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
        <ArrowLeft class="w-4 h-4 mr-2" />
        Back to Dashboard
    </a>

    {#if loading}
        <div class="flex items-center justify-center p-20">
            <span class="text-muted-foreground animate-pulse"
                >Loading property details...</span
            >
        </div>
    {:else if property}
        <!-- Header Section -->
        <div
            class="flex flex-col md:flex-row justify-between items-start gap-4"
        >
            <div>
                <h1 class="text-3xl font-bold tracking-tight">
                    {property.address}
                </h1>
                <p class="text-muted-foreground mt-1">
                    Owner: {property.owner}
                </p>
            </div>
            <div class="flex flex-col items-end gap-2">
                <div class="flex flex-col items-end">
                    <span
                        class="text-sm font-medium text-muted-foreground uppercase tracking-wider"
                        >Overall Risk Score</span
                    >
                    <span
                        class="text-4xl font-bold {getRiskColor(
                            property.riskScore,
                        )}">{property.riskScore}%</span
                    >
                </div>
                <div class="flex gap-2">
                    {#if pdfUrl}
                        <Button variant="outline" href={pdfUrl} target="_blank">
                            <FileText class="w-4 h-4 mr-2" />
                            Download Report
                        </Button>
                    {/if}
                    <Button onclick={runAnalysis} disabled={analyzing}>
                        {#if analyzing}
                            <Sparkles class="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                        {:else}
                            <Sparkles class="w-4 h-4 mr-2" />
                            Run AI Analysis
                        {/if}
                    </Button>
                </div>
            </div>
        </div>

        <!-- High Level Alerts Banner -->
        {#if property.alerts && property.alerts.length > 0}
            <div class="space-y-3">
                {#each property.alerts as alert}
                    <div
                        class="flex items-center p-4 rounded-lg bg-destructive/5 border border-destructive/20 text-destructive"
                    >
                        <AlertOctagon class="w-5 h-5 mr-3 flex-shrink-0" />
                        <div>
                            <span
                                class="font-semibold block text-sm uppercase tracking-wide"
                                >{alert.level} ALERT</span
                            >
                            <span class="text-sm opacity-90"
                                >{alert.message}</span
                            >
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Description & Specs -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card.Root class="md:col-span-2 shadow-sm">
                <Card.Header>
                    <Card.Title>Property Description</Card.Title>
                </Card.Header>
                <Card.Content>
                    <p class="text-sm text-muted-foreground leading-relaxed">
                        {property.description}
                    </p>
                </Card.Content>
            </Card.Root>

            <Card.Root class="shadow-sm">
                <Card.Header>
                    <Card.Title>Technical Specs</Card.Title>
                </Card.Header>
                <Card.Content>
                    {#if property.technicalDetails}
                        <dl class="space-y-3 text-sm">
                            <div
                                class="flex justify-between border-b pb-2 border-border/50"
                            >
                                <dt class="text-muted-foreground">
                                    Foundation
                                </dt>
                                <dd
                                    class="font-medium text-right text-foreground max-w-[150px] truncate"
                                >
                                    {property.technicalDetails.foundation}
                                </dd>
                            </div>
                            <div
                                class="flex justify-between border-b pb-2 border-border/50"
                            >
                                <dt class="text-muted-foreground">Roof</dt>
                                <dd
                                    class="font-medium text-right text-foreground max-w-[150px] truncate"
                                >
                                    {property.technicalDetails.roof}
                                </dd>
                            </div>
                            <div
                                class="flex justify-between border-b pb-2 border-border/50"
                            >
                                <dt class="text-muted-foreground">
                                    Electrical
                                </dt>
                                <dd
                                    class="font-medium text-right text-foreground max-w-[150px] truncate"
                                >
                                    {property.technicalDetails.electrical}
                                </dd>
                            </div>
                            <div class="flex justify-between pt-1">
                                <dt class="text-muted-foreground">Plumbing</dt>
                                <dd
                                    class="font-medium text-right text-foreground max-w-[150px] truncate"
                                >
                                    {property.technicalDetails.plumbing}
                                </dd>
                            </div>
                        </dl>
                    {/if}
                </Card.Content>
            </Card.Root>
        </div>

        <!-- Main Data Tabs -->
        <Tabs.Root value="findings" class="w-full">
            <Tabs.List class="grid w-full grid-cols-3 lg:w-[400px] mb-6">
                <Tabs.Trigger value="findings">Findings</Tabs.Trigger>
                <Tabs.Trigger value="root-cause">Root Causes</Tabs.Trigger>
                <Tabs.Trigger value="future">Future Risks</Tabs.Trigger>
            </Tabs.List>

            <!-- Findings Tab -->
            <Tabs.Content value="findings" class="space-y-4">
                {#if property.findings && property.findings.length > 0}
                    <div class="grid grid-cols-1 gap-4">
                        {#each property.findings as finding}
                            <Card.Root
                                class="border-l-4 border-l-transparent hover:border-l-primary/50 transition-all duration-200"
                            >
                                <Card.Content class="p-5">
                                    <div
                                        class="flex justify-between items-start mb-2"
                                    >
                                        <div class="flex items-center gap-2">
                                            <Badge
                                                variant="outline"
                                                class="{getSeverityColor(
                                                    finding.severity,
                                                )} text-xs font-bold px-2 py-0.5 border"
                                            >
                                                {finding.severity}
                                            </Badge>
                                            <span
                                                class="text-sm font-medium text-muted-foreground flex items-center gap-1"
                                            >
                                                <Info class="w-3 h-3" />
                                                {finding.defectType}
                                            </span>
                                        </div>
                                        <span
                                            class="text-xs text-muted-foreground font-mono"
                                            >Conf: {(
                                                finding.confidence * 100
                                            ).toFixed(0)}%</span
                                        >
                                    </div>
                                    <div class="space-y-1">
                                        <h4
                                            class="text-base font-semibold text-foreground"
                                        >
                                            {finding.roomId}
                                        </h4>
                                        <p class="text-sm text-foreground/80">
                                            {finding.observationText}
                                        </p>
                                    </div>
                                </Card.Content>
                            </Card.Root>
                        {/each}
                    </div>
                {:else}
                    <div
                        class="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-lg"
                    >
                        No findings recorded.
                    </div>
                {/if}
            </Tabs.Content>

            <!-- Root Causes Tab -->
            <Tabs.Content value="root-cause" class="space-y-4">
                {#if property.rootCauses && property.rootCauses.length > 0}
                    <div class="grid grid-cols-1 gap-4">
                        {#each property.rootCauses as cause}
                            <Card.Root>
                                <Card.Content class="p-5">
                                    <div
                                        class="flex flex-col sm:flex-row justify-between sm:items-center gap-4"
                                    >
                                        <div>
                                            <div
                                                class="flex items-center gap-2 mb-1"
                                            >
                                                <h4
                                                    class="font-bold text-lg text-foreground"
                                                >
                                                    {cause.rootCause}
                                                </h4>
                                                <Badge
                                                    variant="secondary"
                                                    class="text-xs"
                                                >
                                                    {cause.roomId}
                                                </Badge>
                                            </div>
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                inferred from <span
                                                    class="font-medium text-foreground"
                                                    >{cause.defectType}</span
                                                >
                                            </p>
                                        </div>
                                        <div class="flex items-center gap-6">
                                            <div class="text-center">
                                                <div
                                                    class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5"
                                                >
                                                    Confidence
                                                </div>
                                                <div class="font-bold text-lg">
                                                    {(
                                                        cause.confidence * 100
                                                    ).toFixed(0)}%
                                                </div>
                                            </div>
                                            <div class="text-center">
                                                <div
                                                    class="text-xs text-muted-foreground uppercase tracking-wider mb-0.5"
                                                >
                                                    Signals
                                                </div>
                                                <div class="font-bold text-lg">
                                                    {cause.supportingSignals}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {#if cause.reasoning}
                                        <div
                                            class="mt-4 pt-4 border-t border-border/50"
                                        >
                                            <p
                                                class="text-sm font-semibold mb-1"
                                            >
                                                Reasoning:
                                            </p>
                                            <p
                                                class="text-sm text-muted-foreground"
                                            >
                                                {cause.reasoning}
                                            </p>
                                        </div>
                                    {/if}
                                </Card.Content>
                            </Card.Root>
                        {/each}
                    </div>
                {:else}
                    <div
                        class="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-lg"
                    >
                        No root cause analysis available.
                    </div>
                {/if}
            </Tabs.Content>

            <!-- Future Risks Tab -->
            <Tabs.Content value="future" class="space-y-4">
                {#if property.futureEvents && property.futureEvents.length > 0}
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {#each property.futureEvents as event}
                            <Card.Root
                                class="border-destructive/10 bg-destructive/5 overflow-hidden relative"
                            >
                                <div
                                    class="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"
                                >
                                    <AlertTriangle
                                        class="w-24 h-24 text-destructive"
                                    />
                                </div>
                                <Card.Header>
                                    <div
                                        class="flex justify-between items-center"
                                    >
                                        <Badge
                                            variant="outline"
                                            class="{getSeverityColor(
                                                event.severity,
                                            )} px-2 py-0.5 text-xs font-bold border"
                                        >
                                            {event.severity}
                                        </Badge>
                                        <span
                                            class="text-xs font-medium text-destructive uppercase tracking-wider"
                                            >{event.probability ||
                                                "Predicted"}</span
                                        >
                                    </div>
                                    <Card.Title
                                        class="mt-2 text-xl text-destructive/90"
                                        >{event.eventName}</Card.Title
                                    >
                                    <Card.Description
                                        class="text-destructive/70"
                                        >Risk detected in {event.roomId}</Card.Description
                                    >
                                </Card.Header>
                                <Card.Content>
                                    {#if event.timeframe}
                                        <div class="mb-2">
                                            <span
                                                class="text-xs font-semibold text-muted-foreground uppercase"
                                                >Expected Timeframe:</span
                                            >
                                            <span
                                                class="text-sm ml-1 text-foreground"
                                                >{event.timeframe}</span
                                            >
                                        </div>
                                    {/if}
                                    {#if event.preventiveMeasures && event.preventiveMeasures.length > 0}
                                        <div>
                                            <span
                                                class="text-xs font-semibold text-muted-foreground uppercase block mb-1"
                                                >Preventive Measures:</span
                                            >
                                            <ul
                                                class="list-disc list-inside text-sm text-muted-foreground space-y-1"
                                            >
                                                {#each event.preventiveMeasures as measure}
                                                    <li>{measure}</li>
                                                {/each}
                                            </ul>
                                        </div>
                                    {/if}
                                </Card.Content>
                            </Card.Root>
                        {/each}
                    </div>
                {:else}
                    <div
                        class="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-lg"
                    >
                        No future risks predicted.
                    </div>
                {/if}
            </Tabs.Content>
        </Tabs.Root>
    {:else}
        <div class="text-center py-20">
            <h2 class="text-2xl font-bold">Property Not Found</h2>
            <p class="text-muted-foreground mt-2">
                The property you requested does not exist.
            </p>
            <a
                href="/dashboard"
                class="inline-block mt-4 text-primary hover:underline"
                >Return to Dashboard</a
            >
        </div>
    {/if}
</div>
