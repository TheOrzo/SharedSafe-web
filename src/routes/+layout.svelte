<script lang="ts">
  import "./layout.css";
  import favicon from "$lib/assets/favicon.svg";
  import Navigation from "$lib/components/navigation/navigation.svelte";

  let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Navigation />
<div class="content">
  {@render children()}
</div>

<style>
  .content {
    margin-left: 200px;
    padding: 1px 16px;
  }

  @media (max-width: 799px) {
    .content {
      margin-left: 0;
      padding-bottom: 70px;
    }
  }
</style>
