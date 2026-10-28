import type { Lock } from "$lib/types/Lock";
import { Type } from "$lib/types/Lock";
import { State } from "$lib/types/Lock";

export function getLocks()
{
    let locks: Lock[] = [
    {
      lockId: 0,
      name: "Main Entrance",
      type: 1,
      description: "The main entrance lock of the building",
      useEncryption: true,
      hasLockSensor: true,
      hasOpenSensor: true,
      hasBypassSensor: false,
      bypassResetMandatory: false,
      
      state: State.ONLINE,
      lastUser: "John Doe",
      lastOpened: new Date(),
      lastContact: new Date(),
    },
    {
      lockId: 1,
      name: "Wechselgeld Tresor",
      type: 4,
      description: "Tresor im Gezi mit Gagen und Wechsegeld",
      useEncryption: true,
      hasLockSensor: true,
      hasOpenSensor: true,
      hasBypassSensor: true,
      bypassResetMandatory: true,
      
      state: State.ONLINE,
      lastUser: "John Doe",
      lastOpened: new Date(),
      lastContact: new Date(),
    },
    {
      lockId: 2,
      name: "Carport",
      type: 3,
      description: "Carport Zugang",
      useEncryption: true,
      hasLockSensor: false,
      hasOpenSensor: false,
      hasBypassSensor: false,
      bypassResetMandatory: false,
      
      state: State.ONLINE,
      lastUser: "John Doe",
      lastOpened: new Date(),
      lastContact: new Date(),
    },
    {
      lockId: 3,
      name: "GR Schließfach 1",
      type: 2,
      description: "Queerbeet Schließfach im Gruppenraum",
      useEncryption: true,
      hasLockSensor: false,
      hasOpenSensor: false,
      hasBypassSensor: false,
      bypassResetMandatory: false,
      
      state: State.ONLINE,
      lastUser: "John Doe",
      lastOpened: new Date(),
      lastContact: new Date(),
    },
  ];

  return locks;
}