<script lang="ts">
  import LockPanel from "$lib/components/lockpanel/lockpanel.svelte";
</script>

<span class="title">AuthLock</span>

<div class="lock-panels">
  <LockPanel />
</div>

<style>
  .title {
    font-family:
      DM Sans,
      "DM Sans Fallback: BlinkMacSystemFont",
      "DM Sans Fallback: Segoe UI",
      "DM Sans Fallback: Helvetica Neue",
      "DM Sans Fallback: Arial",
      "DM Sans Fallback: Noto Sans",
      Roboto,
      -apple-system,
      Segoe UI,
      sans-serif;
    font-size: 30pt;
    font-weight: 800;
    margin-top: 20px;
    padding-bottom: 50px;
    color: var(--clr-light-a0);
  }

  .lock-panels {
    display: grid;
    grid-template-columns: auto;
    gap: 20px;
  }
</style>
