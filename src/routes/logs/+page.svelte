<script lang="ts">
  import LogTable from "$lib/components/ui/LogTable.svelte";
</script>

<h1 class="title">Event Logs</h1>
<div class="log-table">
  <LogTable />
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
    color: var(--clr-light-a0);
    display: flex;
    flex-direction: row;
    gap: 10px;
  }

  .log-table {
    margin-top: 20px;
  }
</style>
