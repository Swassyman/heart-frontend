<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { goto } from "$app/navigation";
    import { authStore, login } from "$lib/stores/auth";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    let email = $state("");
    let password = $state("");
    let loading = $state(false);
    let error = $state("");

    onMount(() => {
        const currentUser = get(authStore);
        if (currentUser) {
            redirectBasedOnRole(currentUser.role);
        }
    });

    function redirectBasedOnRole(role: string) {
        if (role === "OWNER") {
            goto("/dashboard/owner");
        } else if (role === "CONTRACTOR") {
            goto("/dashboard/contractor");
        } else if (role === "INSPECTOR") {
            goto("/dashboard/inspector");
        } else {
            goto("/dashboard/owner");
        }
    }

    async function handleLogin() {
        loading = true;
        error = "";

        try {
            const res = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Persistence
            login({
                id: data.user_id,
                name: data.full_name,
                role: data.role,
            });

            redirectBasedOnRole(data.role);
        } catch (err: any) {
            error = err.message;
        } finally {
            loading = false;
        }
    }
</script>

<div class="flex items-center justify-center min-h-screen bg-muted/40 p-4">
    <Card.Root class="w-full max-w-md">
        <Card.Header>
            <Card.Title
                class="text-2xl font-semibold tracking-tight text-center"
                >Welcome Back</Card.Title
            >
            <Card.Description class="text-center">
                Enter your credentials to access your account
            </Card.Description>
        </Card.Header>
        <Card.Content>
            <form
                class="space-y-4"
                onsubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                }}
            >
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
                {#if error}
                    <p class="text-sm text-destructive">{error}</p>
                {/if}
                <Button type="submit" class="w-full" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                </Button>
            </form>
        </Card.Content>
        <Card.Footer class="flex justify-center border-t p-4 mt-4">
            <p class="text-sm text-muted-foreground">
                Don't have an account?
                <a
                    href="/register"
                    class="text-primary font-medium hover:underline px-1"
                    >Register</a
                >
            </p>
        </Card.Footer>
    </Card.Root>
</div>
