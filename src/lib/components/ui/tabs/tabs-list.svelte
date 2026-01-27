<script lang="ts">
    import { Tabs as BitsTabs } from "bits-ui";
    import { cn } from "$lib/utils.js";

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: BitsTabs.ListProps = $props();
</script>

<BitsTabs.List
    bind:ref
    class={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className,
    )}
    {...restProps}
>
    {@render children?.()}
</BitsTabs.List>
