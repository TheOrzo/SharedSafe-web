<script lang="ts">
  import type { Lock } from "$lib/types/Lock";
  import { State, Type } from "$lib/types/Lock";
  import { getUser, getUsers } from "$lib/api/user";

  import Swipe from "$lib/components/swipe.svelte";
  import * as Sheet from "$lib/components/ui/sheet/index.js";
  import { buttonVariants } from "$lib/components/ui/button/index.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
  import LockEdit from "$lib/components/lockedit/lockedit.svelte";
  import { Textarea } from "$lib/components/ui/textarea/index.js";

  import SvgIcon from "@jamescoyle/svelte-icon";
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
  import { mdiPlaylistEdit } from "@mdi/js";
  import { mdiPencil } from "@mdi/js";

  let {
    lock = null as Lock | null,
    panelClickHandler = (e: MouseEvent) => {},
  } = $props();

  let reasonDialogOpen = $state(false);
  let reasonText = $state("");

  let swipeValue = $state(0);
  function swipeOpenHandler(event: Event, isComplete: boolean, value: number) {
    swipeValue = 0;
    reasonText = "";
    reasonDialogOpen = true;
  }

  let currentUser = getUser();
</script>

<AlertDialog.Root bind:open={reasonDialogOpen}>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>
        State a reason to open {lock?.name}?
      </AlertDialog.Title>
      <AlertDialog.Description></AlertDialog.Description>
      <Textarea
        id="reason"
        placeholder="reason"
        bind:value={reasonText}
        class="resize-none"
      />
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action disabled={reasonText.trim() === ""}>
        Open
      </AlertDialog.Action>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>

<div
  class="lock-panel
  {lock?.state === State.OFFLINE ? 'red-background' : ''}"
  onclick={(event) => panelClickHandler(event)}
  onkeydown={(event) => {
    if (event.key === "Enter" || event.key === " ") panelClickHandler();
  }}
  role="button"
  tabindex={lock === null ? 0 : -1}
>
  {#if lock !== null}
    <div class="title_row">
      <div class="icon_container">
        {#if lock.type === Type.UNSPECIFIED}
          <SvgIcon type="mdi" path={mdiLockQuestion} size="50px"></SvgIcon>
        {:else if lock.type === Type.DOOR}
          <SvgIcon type="mdi" path={mdiDoor} size="50px"></SvgIcon>
        {:else if lock.type === Type.SHED}
          <SvgIcon type="mdi" path={mdiLocker} size="50px"></SvgIcon>
        {:else if lock.type === Type.LOCKER}
          <SvgIcon type="mdi" path={mdiGreenhouse} size="50px"></SvgIcon>
        {:else if lock.type === Type.SAFE}
          <SvgIcon type="mdi" path={mdiSafe} size="50px"></SvgIcon>
        {:else if lock.type === Type.BIKE}
          <SvgIcon type="mdi" path={mdiBike} size="50px"></SvgIcon>
        {/if}
      </div>
      <div>
        {#if currentUser.isAdmin}
          <Sheet.Root>
            <Sheet.Trigger style="display:flex;flex-direction=row">
              <h2 class="title admin-title">{lock.name}&nbsp;</h2>
              <SvgIcon type="mdi" path={mdiPencil} size="30px"></SvgIcon>
            </Sheet.Trigger>
            <Sheet.Content>
              <Sheet.Header>
                <LockEdit {lock} />
              </Sheet.Header>
            </Sheet.Content>
          </Sheet.Root>
        {:else}
          <h2 class="title">{lock.name}</h2>
        {/if}
        <p>{lock.description}</p>
      </div>

      {#if lock.state === State.ONLINE}
        <div class="status success">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--status-success-color)"
          ></SvgIcon>
          <span>Online</span>
        </div>
      {:else if lock.state === State.OFFLINE}
        <div class="status offline">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--clr-danger-a0)"
          ></SvgIcon>
          <span>Offline</span>
        </div>
      {:else if lock.state === State.ERROR}
        <div class="status error">
          <SvgIcon
            type="mdi"
            path={mdiCheckCircle}
            style="color: var(--clr-danger-a0)"
          ></SvgIcon>
          <span>Error</span>
        </div>
      {:else if lock.state === State.BYPASSED}
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
      class="openButton {lock.state === State.ONLINE ? 'visible' : 'hidden'}"
    >
      {#if lock.state === State.ONLINE}
        <Swipe
          oncomplete={swipeOpenHandler}
          bind:value={swipeValue}
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
    border: 1px solid var(--card-border-color);
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
    color: var(--status-success-color);
    background-color: var(--status-success-background);
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
    color: var(--clr-light-a40);
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
