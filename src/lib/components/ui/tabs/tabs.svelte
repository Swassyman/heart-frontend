<script lang="ts">
    import { Tabs as BitsTabs } from "bits-ui";
    import { cn } from "$lib/utils.js";

    let {
        ref = $bindable(null),
        value = $bindable(),
        class: className,
        children,
        ...restProps
    }: BitsTabs.RootProps = $props();
</script>

<BitsTabs.Root bind:ref bind:value class={cn(className)} {...restProps}>
    {@render children?.()}
</BitsTabs.Root>
