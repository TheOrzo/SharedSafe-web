<script lang="ts">
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index";

  import { getLogEntries } from "$lib/api/log";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import * as NativeSelect from "$lib/components/ui/native-select/index.js";

  import { getUser, getUsers } from "$lib/api/user";

  let fromDate = $state();
  let toDate = $state();

  let currentUser = getUser();
</script>

<!--div class="search">
  <Input type="text" placeholder="Search" class="w-1/2" />
</div -->

<div class="filter">
  {#if currentUser.isPriviledged}
    <NativeSelect.Root>
      <NativeSelect.Option value="">Select User</NativeSelect.Option>
      {#each getUsers() as user}
        <NativeSelect.Option value={user.id}>{user.name}</NativeSelect.Option>
      {/each}
    </NativeSelect.Root>
  {/if}
  <DatePicker label="From" bind:value={fromDate} />
  <DatePicker label="To" bind:value={toDate} />
</div>

<Table.Root>
  <Table.Caption></Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Lock</Table.Head>
      <Table.Head class="w-[150px]">Action</Table.Head>
      <Table.Head>User</Table.Head>
      <Table.Head>Date</Table.Head>
      <Table.Head>Description</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each getLogEntries() as entry}
      <Table.Row>
        <Table.Cell class="font-medium">{entry.lock}</Table.Cell>
        <Table.Cell>{entry.action}</Table.Cell>
        <Table.Cell>{entry.user}</Table.Cell>
        <Table.Cell>{entry.date.toLocaleString("de-DE")}</Table.Cell>
        <Table.Cell>{entry.description}</Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>

<div class="loadButton">
  <Button variant="outline">load more</Button>
</div>

<style>
  .filter {
    margin-bottom: 10px;
    display: flex;
    flex-direction: row;
    gap: 5px;
  }

  .loadButton {
    display: flex;
    justify-content: center;
    width: 100%;
  }
</style>
