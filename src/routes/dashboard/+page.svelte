<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    onMount(() => {
        goto("/login");
    });
</script>

<div class="flex items-center justify-center h-screen">
    <p class="text-muted-foreground">Redirecting...</p>
</div>
