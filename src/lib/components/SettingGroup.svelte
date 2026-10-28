<script lang="ts">
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { onMount } from "svelte";

  let { groupName, children } = $props();
  let open = $state(false);
</script>

<Collapsible.Root class="rounded-[3px]" bind:open>
  <Collapsible.Trigger
    class="w-full h-15 pl-5 text-left text-xl font-bold bg-surface-a10  {open
      ? ''
      : 'hover:bg-surface-a20 rounded-[3px]'}"
  >
    {groupName}
  </Collapsible.Trigger>
  <Collapsible.Content class="pl-5 pb-5 pt-5 border-2">
    {@render children()}
  </Collapsible.Content>
</Collapsible.Root>
