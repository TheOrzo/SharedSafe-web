export const UNSPECIFIED = 0;
export const DOOR = 1;
export const SHED = 2;
export const LOCKER = 3;
export const SAFE = 4;
export const BIKE = 5;

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
  title: string;
  type: Type;
  description: string;
  hasLockSensor: boolean;
  hasOpenSensor: boolean;
  hasBypassSensor: boolean;
  bypassResetMandatory: boolean;
  
  state: State;
  lastUser: string | null;
  lastOpened: Date | null;
  lastContact: Date | null;
}