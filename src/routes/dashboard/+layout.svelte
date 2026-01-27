<script lang="ts">
    import { authStore, logout } from "$lib/stores/auth";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";
    import { LogOut } from "lucide-svelte";
    import { get } from "svelte/store";

    let { children } = $props();

    // Subscribe to store for reactive UI
    let user = $state(get(authStore));

    // Update user state when store changes
    authStore.subscribe((value) => {
        user = value;
    });

    function handleSignOut() {
        logout();
        goto("/login");
    }
</script>

<div class="min-h-screen flex flex-col">
    <header class="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div
            class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
            <div class="flex items-center gap-2">
                <span class="font-bold text-xl tracking-tight text-primary"
                    >HEART</span
                >
                {#if user}
                    <span
                        class="px-2 py-0.5 rounded-full bg-muted text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                        {user.role}
                    </span>
                {/if}
            </div>

            <div class="flex items-center gap-4">
                {#if user}
                    <span
                        class="text-sm text-muted-foreground hidden sm:inline-block"
                    >
                        Welcome, <span class="font-medium text-foreground"
                            >{user.name}</span
                        >
                    </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onclick={handleSignOut}
                        class="text-muted-foreground hover:text-destructive gap-2"
                    >
                        <LogOut class="w-4 h-4" />
                        Sign Out
                    </Button>
                {/if}
            </div>
        </div>
    </header>

    <main class="flex-1">
        {@render children()}
    </main>
</div>
