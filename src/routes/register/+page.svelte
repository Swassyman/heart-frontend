<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Tabs from "$lib/components/ui/tabs";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { goto } from "$app/navigation";

    let activeTab = $state("owner");
    let loading = $state(false);
    let error = $state("");

    // Form Fields
    let fullName = $state("");
    let email = $state("");
    let password = $state("");
    let licenseId = $state("");

    async function handleRegister() {
        loading = true;
        error = "";

        // Map tab to backend role
        let role = "OWNER";
        if (activeTab === "contractor") role = "CONTRACTOR";
        if (activeTab === "inspector") role = "INSPECTOR";

        const payload = {
            full_name: fullName,
            email,
            password,
            role,
            license_id: role === "INSPECTOR" ? licenseId : null,
        };

        try {
            const res = await fetch("http://localhost:3000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Success
            goto("/login");
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<div
    class="flex items-center justify-center min-h-screen bg-muted/40 p-4 py-10"
>
    <div class="w-full max-w-lg space-y-6">
        <div class="text-center space-y-2">
            <h1 class="text-3xl font-bold tracking-tight">Create an Account</h1>
            <p class="text-muted-foreground">Select your role to get started</p>
        </div>

        <Tabs.Root bind:value={activeTab} class="w-full">
            <Tabs.List class="grid w-full grid-cols-3">
                <Tabs.Trigger value="owner">Owner/Buyer</Tabs.Trigger>
                <Tabs.Trigger value="contractor">Contractor</Tabs.Trigger>
                <Tabs.Trigger value="inspector">Inspector</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="owner">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Owner / Buyer</Card.Title>
                        <Card.Description>
                            Create an account to manage your properties and
                            projects.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <Label for="name">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                bind:value={fullName}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                bind:value={email}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                bind:value={password}
                            />
                        </div>
                        {#if error && activeTab === "owner"}
                            <p class="text-sm text-destructive">{error}</p>
                        {/if}
                        <Button
                            class="w-full"
                            onclick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="contractor">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Contractor</Card.Title>
                        <Card.Description>
                            Join to bid on projects and manage renovations.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <Label for="c-name">Company / Full Name</Label>
                            <Input
                                id="c-name"
                                placeholder="Acme Construction"
                                bind:value={fullName}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="c-email">Email</Label>
                            <Input
                                id="c-email"
                                type="email"
                                placeholder="name@example.com"
                                bind:value={email}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="c-password">Password</Label>
                            <Input
                                id="c-password"
                                type="password"
                                bind:value={password}
                            />
                        </div>
                        {#if error && activeTab === "contractor"}
                            <p class="text-sm text-destructive">{error}</p>
                        {/if}
                        <Button
                            class="w-full"
                            onclick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>

            <Tabs.Content value="inspector">
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Inspector</Card.Title>
                        <Card.Description>
                            Verify properties and provide official assessments.
                        </Card.Description>
                    </Card.Header>
                    <Card.Content class="space-y-4">
                        <div class="space-y-2">
                            <Label for="i-name">Full Name</Label>
                            <Input
                                id="i-name"
                                placeholder="Jane Smith"
                                bind:value={fullName}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="i-email">Email</Label>
                            <Input
                                id="i-email"
                                type="email"
                                placeholder="name@example.com"
                                bind:value={email}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="i-password">Password</Label>
                            <Input
                                id="i-password"
                                type="password"
                                bind:value={password}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label for="i-credential"
                                >Government Credential / License ID</Label
                            >
                            <Input
                                id="i-credential"
                                placeholder="Lic-12345678"
                                bind:value={licenseId}
                            />
                            <p class="text-[0.8rem] text-muted-foreground">
                                Required to verify your inspector status.
                            </p>
                        </div>
                        {#if error && activeTab === "inspector"}
                            <p class="text-sm text-destructive">{error}</p>
                        {/if}
                        <Button
                            class="w-full"
                            onclick={handleRegister}
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </Card.Content>
                </Card.Root>
            </Tabs.Content>
        </Tabs.Root>

        <p class="text-center text-sm text-muted-foreground">
            Already have an account?
            <a href="/login" class="text-primary font-medium hover:underline"
                >Sign In</a
            >
        </p>
    </div>
</div>
