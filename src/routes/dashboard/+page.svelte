<script lang="ts">
    import { authStore, login, logout } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import BuyerDashboard from "$lib/components/dashboard/BuyerDashboard.svelte";
    import BuilderDashboard from "$lib/components/dashboard/BuilderDashboard.svelte";
    import InspectorDashboard from "$lib/components/dashboard/InspectorDashboard.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import type { UserRole } from "$lib/types";

    let user = $derived($authStore);

    function handleLogin(role: UserRole) {
        login(role, `Mock ${role}`);
    }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-zinc-950 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
        <div class="flex justify-between items-center">
            <div class="space-y-1">
                <h1 class="text-2xl font-bold tracking-tight">
                    Heart Dashboard
                </h1>
                {#if user}
                    <p class="text-muted-foreground">
                        Welcome back, {user.name} ({user.role})
                    </p>
                {/if}
            </div>
            {#if user}
                <Button variant="outline" onclick={logout}>Logout</Button>
            {/if}
        </div>

        {#if !user}
            <Card.Root class="w-full max-w-md mx-auto mt-20">
                <Card.Header>
                    <Card.Title>Login Selection</Card.Title>
                    <Card.Description
                        >Select a role to preview the dashboard.</Card.Description
                    >
                </Card.Header>
                <Card.Content class="flex flex-col gap-4">
                    <Button onclick={() => handleLogin("BUYER")}
                        >Login as Buyer</Button
                    >
                    <Button onclick={() => handleLogin("BUILDER")}
                        >Login as Builder</Button
                    >
                    <Button onclick={() => handleLogin("INSPECTOR")}
                        >Login as Inspector</Button
                    >
                </Card.Content>
            </Card.Root>
        {:else if user.role === "BUYER"}
            <BuyerDashboard />
        {:else if user.role === "BUILDER"}
            <BuilderDashboard />
        {:else if user.role === "INSPECTOR"}
            <InspectorDashboard />
        {/if}
    </div>
</div>
