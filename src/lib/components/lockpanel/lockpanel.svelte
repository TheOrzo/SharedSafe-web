<script lang="ts">
  import * as Lock from "$lib/types/Lock";
  import CheckIcon from "@lucide/svelte/icons/circle-check";
  import ErrorIcon from "@lucide/svelte/icons/circle-alert";
  import SvgIcon from "@jamescoyle/svelte-icon";
  import Swipe from "$lib/components/swipe.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";

  import { mdiCheckCircle } from "@mdi/js";
  import { mdiAlertCircle } from "@mdi/js";
  import { mdiAlert } from "@mdi/js";
  import { mdiInformation } from "@mdi/js";
  import { mdiLockQuestion } from "@mdi/js";
  import { mdiDoor } from "@mdi/js";
  import { mdiLocker } from "@mdi/js";
  import { mdiGreenhouse } from "@mdi/js";
  import { mdiSafe } from "@mdi/js";
  import { mdiBike } from "@mdi/js";
  import { mdiPlusThick } from "@mdi/js";

  import { getUser, getUsers } from "$lib/api/user";

  let { lock = null, panelClickHandler = () => {} } = $props();
  let swipeValue = $state(0);
  let status = false;
  function swipeOpenHandler(event, isComplete, value) {
    swipeValue = 0;
  }

  let currentUser = getUser();
</script>

<div
  class="lock-panel
  {lock?.state === Lock.State.OFFLINE ? 'red-background' : ''}"
  onclick={panelClickHandler}
  onkeydown={(event) => {
    if (event.key === "Enter" || event.key === " ") panelClickHandler();
  }}
  role="button"
  tabindex={lock === null ? 0 : -1}
>
  {#if lock !== null}
    <div class="title_row">
      <div class="icon_container">
        {#if lock.type === Lock.UNSPECIFIED}
          <SvgIcon type="mdi" path={mdiLockQuestion} size="50px"></SvgIcon>
        {:else if lock.type === Lock.DOOR}
          <SvgIcon type="mdi" path={mdiDoor} size="50px"></SvgIcon>
        {:else if lock.type === Lock.SHED}
          <SvgIcon type="mdi" path={mdiLocker} size="50px"></SvgIcon>
        {:else if lock.type === Lock.LOCKER}
          <SvgIcon type="mdi" path={mdiGreenhouse} size="50px"></SvgIcon>
        {:else if lock.type === Lock.SAFE}
          <SvgIcon type="mdi" path={mdiSafe} size="50px"></SvgIcon>
        {:else if lock.type === Lock.BIKE}
          <SvgIcon type="mdi" path={mdiBike} size="50px"></SvgIcon>
        {/if}
      </div>
      <div>
        {#if currentUser.isAdmin}
          <Sheet.Root>
            <Sheet.Trigger>
              <h2 class="title admin-title">{lock.title}</h2>
            </Sheet.Trigger>
            <Sheet.Content>
              <Sheet.Header>
                <Sheet.Title>Are you sure absolutely sure?</Sheet.Title>
                <Sheet.Description>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </Sheet.Description>
              </Sheet.Header>
            </Sheet.Content>
          </Sheet.Root>
        {:else}
          <h2 class="title">{lock.title}</h2>
        {/if}
        <p>{lock.description}</p>
      </div>

      {#if lock.state === Lock.State.ONLINE}
        <div class="status success">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--clr-success-a0)"
          ></SvgIcon>
          <span>Online</span>
        </div>
      {:else if lock.state === Lock.State.OFFLINE}
        <div class="status offline">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--clr-danger-a0)"
          ></SvgIcon>
          <span>Offline</span>
        </div>
      {:else if lock.state === Lock.State.ERROR}
        <div class="status error">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--clr-danger-a0)"
          ></SvgIcon>
          <span>Error</span>
        </div>
      {:else if lock.state === Lock.State.BYPASSED}
        <div class="status warning">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--clr-warning-a0)"
          ></SvgIcon>
          <span>Bypassed</span>
        </div>
      {/if}
    </div>
    <div class="statsTable">
      <div>
        <strong class="stat-label">Last contact:</strong>
        {lock.lastContact
          ? lock.lastContact.toLocaleTimeString("de-DE")
          : "N/A"}
      </div>
      <div>
        <strong class="stat-label">Last opened:</strong>
        {lock.lastOpened ? lock.lastOpened.toLocaleString("de-DE") : "N/A"}
      </div>
      <div>
        <strong class="stat-label">Opened by:</strong>
        {lock.lastUser ? lock.lastUser : "N/A"}
      </div>
    </div>
    <div
      class="openButton {lock.state === Lock.State.ONLINE
        ? 'visible'
        : 'hidden'}"
    >
      {#if lock.state === Lock.State.ONLINE}
        <Swipe
          oncomplete={swipeOpenHandler}
          bind:value={swipeValue}
          bind:status
          width="250"
          height="40"
          trackBorderWidth="0"
          trackRadius="10"
          trackColor="var(--clr-surface-a10)"
          completeTrackColor="var(--clr-primary-a30)"
          thumbColor="var(--clr-primary-a10)"
          completeThumbColor="var(--clr-primary-a0)"
          labelColor="var(--clr-light-a0)"
          label="Slide to open"
          completeLabel="opening..."
        />
      {/if}
    </div>
  {:else}
    <div
      style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;color: var(--clr-surface-a30)"
    >
      <SvgIcon type="mdi" path={mdiPlusThick} size="50px"></SvgIcon>
      <span style="margin-left: 10px; font-size: 16pt">Add new lock</span>
    </div>
  {/if}
</div>

<style>
  .lock-panel {
    padding: 20px;
    background-color: var(--clr-surface-a0);
    border: 1px solid var(--clr-surface-a30);
    position: relative;
    min-height: 200px;
    border-radius: 5px;
  }

  .title {
    font-size: 20pt;
    margin-top: 0;
    color: var(--clr-light-a0);
  }

  .admin-title:hover {
    cursor: pointer;
  }

  .red-background {
    background-color: var(--clr-danger-t50);
  }

  .title_row {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .icon_container {
    color: var(--clr-primary-a20);
    width: 50px;
    height: 50px;
  }

  .status {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12pt;
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 2;
  }
  .success {
    color: var(--clr-dark-a0);
    background-color: var(--clr-success-a20);
  }
  .offline {
    color: var(--clr-dark-a0);
    background-color: var(--clr-danger-a20);
  }
  .error {
    color: var(--clr-dark-a0);
    background-color: var(--clr-danger-a20);
  }
  .warning {
    color: var(--clr-dark-a0);
    background-color: var(--clr-warning-a20);
  }

  .statsTable {
    margin-top: 15px;
    width: 90%;
  }
  .stat-label {
    display: inline-block;
    width: 110px;
  }

  .openButton {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 2;
  }

  @media (max-width: 799px) {
    .lock-panel {
      padding-top: 50px;
    }

    .statsTable {
      padding-bottom: 10px;
    }

    .openButton {
      display: flex;
      position: unset;
      justify-content: center;
      width: 100%;
    }
  }
</style>
