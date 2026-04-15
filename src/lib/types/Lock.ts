const UNSPECIFIED = 0;
const DOOR = 1;
const SHED = 2;
const LOCKER = 3;
const SAFE = 4;
const BIKE = 5;

interface LockDefinition {
  title: string;
  type: number;
  description: string;
  hasLockSensor: boolean;
  hasOpenSensor: boolean;
  hasBypassSensor: boolean;
  bypassResetMandatory: boolean;
}
