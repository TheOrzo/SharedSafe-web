<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Navigation from "$lib/components/navigation/navigation.svelte";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<Navigation />
<div style="margin-left: 150px; padding: 1px 16px;">
  {@render children()}
</div>
