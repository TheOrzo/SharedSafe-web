export enum Type {
  UNSPECIFIED = 0,
  DOOR = 1,
  SHED = 2,
  LOCKER = 3,
  SAFE = 4,
  BIKE = 5,
}

export enum State {
  ONLINE = 0,
  OFFLINE = 1,
  ERROR = 2,
  BYPASSED = 3,
}

export interface Lock {
  lockId: number;
  name: string;
  type: Type;
  description: string;
  hasLockSensor: boolean;
  hasOpenSensor: boolean;
  hasBypassSensor: boolean;

  useEncryption: boolean;
  bypassResetMandatory: boolean;
  useDoorSensor: boolean;
  
  state: State;
  lastUser: string | null;
  lastOpened: Date | null;
  lastContact: Date | null;
}