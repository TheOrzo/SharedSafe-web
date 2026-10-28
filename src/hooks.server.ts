import type { ServerInit } from '@sveltejs/kit';
import { building } from '$app/environment';
import { startDevices } from '$lib/server/devices';

export const init: ServerInit = async () => {
  if (building) return;
  await startDevices();
};
