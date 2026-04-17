<script lang="ts">
  import LockPanel from "$lib/components/lockpanel/lockpanel.svelte";
  import { getLocks } from "$lib/api/lock";
  import { onMount } from "svelte";

  import { getUser, getUsers } from "$lib/api/user";

  let addPanel: LockPanel;

  function addPanelClickHandler() {
    console.log("Add panel clicked");
  }

  let currentUser = getUser();
</script>

<div class="title">
  <span>AuthLock</span>
  {#if currentUser.isAdmin}
    <span style="color: red">Admin Panel</span>
  {/if}
</div>

<div class="lock-panels">
  {#each getLocks() as lock}
    <LockPanel {lock} />
  {/each}

  {#if currentUser.isAdmin}
    <LockPanel
      bind:this={addPanel}
      lock={null}
      panelClickHandler={addPanelClickHandler}
    />
  {/if}
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

  .lock-panels {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns: repeat(auto-fit, minmax(550px, 1fr));
    gap: 30px;
    margin-top: 20px;
  }

  @media (max-width: 799px) {
    .lock-panels {
      grid-template-columns: auto;
    }
  }
</style>
