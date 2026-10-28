<script lang="ts">
  import type { Lock } from "$lib/types/Lock";
  import { Type } from "$lib/types/Lock";

  import * as Field from "$lib/components/ui/field/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Textarea } from "$lib/components/ui/textarea/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { ScrollArea } from "$lib/components/ui/scroll-area/index.js";

  import { onMount } from "svelte";

  let { lock = $bindable<Lock>() } = $props();
  let name = $derived(lock.name);
  let description = $derived(lock.description);
  let type = $derived(lock.type);
  let useEncryption = $derived(lock.useEncryption);
  let hasLockSensor = $derived(lock.hasLockSensor);
  let hasOpenSensor = $derived(lock.hasOpenSensor);
  let hasBypassSensor = $derived(lock.hasBypassSensor);
  let bypassResetMandatory = $derived(lock.bypassResetMandatory);
</script>

<ScrollArea class="h-dvh scrollarea">
  <h2>Edit</h2>
  <div class="w-full max-w-md" style="padding-bottom: 50px;">
    <Field.Set>
      <Field.Group>
        <Field.Field>
          <Field.Label for="name">Lock name</Field.Label>
          <Input id="name" type="text" placeholder="name" bind:value={name} />
          <!--Field.Description
          >Choose a unique name to identify your lock
        </Field.Description-->
        </Field.Field>
        <Field.Field>
          <Field.Label for="name">Description</Field.Label>
          <Input
            id="name"
            type="text"
            placeholder="description"
            bind:value={description}
          />
          <!--Field.Description>
          Describe the location an purpose of this lock
        </Field.Description-->
        </Field.Field>
        <Field.Field>
          <Field.Label for="type">Type</Field.Label>
          <Select.Root type="single" bind:value={type}>
            <Select.Trigger id="type">
              <span>{Type[type]}</span>
            </Select.Trigger>
            <Select.Content>
              {#each { length: Object.keys(Type).filter( (key) => isNaN(Number(key)), ).length }, i}
                <Select.Item value={i}>{Type[i]}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </Field.Field>
        <Field.Separator />
        <Field.Field>
          <Field.Label for="address">Network address</Field.Label>
          <Input id="address" type="text" placeholder="127.0.0.1" />
        </Field.Field>
        <Field.Field>
          <Field.Label for="id">Lock ID on device</Field.Label>
          <Input id="id" type="number" placeholder="0" />
        </Field.Field>
        <Field.Field orientation="horizontal">
          <Checkbox id="useEncryption" bind:checked={useEncryption} />
          <Field.Label for="useEncryption" class="font-normal">
            Use symmetric encryption
          </Field.Label>
        </Field.Field>
        {#if useEncryption}
          <Field.Field>
            <Field.Label for="key">Encryption Key</Field.Label>
            <Textarea id="key" placeholder="----------" class="resize-none" />
          </Field.Field>
        {/if}
        <Field.Field orientation="horizontal">
          <Button type="button">Test Connection</Button>
          <Button variant="outline" type="button">Save without testing</Button>
        </Field.Field>
        <Field.Separator />
        <Field.Field orientation="horizontal">
          <Checkbox id="hasLockSensor" bind:checked={hasLockSensor} />
          <Field.Label for="hasLockSensor" class="font-normal">
            The lock has a locked sensor
          </Field.Label>
        </Field.Field>
        <Field.Field orientation="horizontal">
          <Checkbox id="hasOpenSensor" bind:checked={hasOpenSensor} />
          <Field.Label for="hasOpenSensor" class="font-normal">
            The lock has an open sensor
          </Field.Label>
        </Field.Field>
        <Field.Field orientation="horizontal">
          <Checkbox id="hasBypassSensor" bind:checked={hasBypassSensor} />
          <Field.Label for="hasBypassSensor" class="font-normal">
            The lock has a bypass sensor
          </Field.Label>
        </Field.Field>
        {#if hasBypassSensor}
          <Field.Field orientation="horizontal">
            <Checkbox
              id="bypassResetMandatory"
              bind:checked={bypassResetMandatory}
            />
            <Field.Label for="bypassResetMandatory" class="font-normal">
              Is an admin reset mandatory after a bypass was detected
            </Field.Label>
          </Field.Field>
        {/if}
      </Field.Group>
    </Field.Set>
  </div>
</ScrollArea>

<style>
  .scrollarea {
    background-color: red;
  }
  h2 {
    font-size: 20pt;
    font-weight: 500;
  }
</style>
