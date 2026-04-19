import { DateTime, AndroidProgramState, TextualError, Tried, Unique } from "@internal/prelude";

const BRAND = Symbol();

type RawAndroidProgram = {
  state: AndroidProgramState,
  // database: Database,
};

export type AndroidProgram = Unique<typeof BRAND, "Program", RawAndroidProgram>;

const openOrThrow = (): AndroidProgram => {
  // TODO
  throw new Error("Not implemented")
};

const onAndroidProfileProvisioningComplete = (it: AndroidProgram) => {};
const onAndroidAdminEnabled = (it: AndroidProgram) => {};
const onAndroidAdminDisabled = (it: AndroidProgram) => {};
const onAndroidDeviceStartupEvent = (it: AndroidProgram, when: DateTime) => {};
const onAndroidDeviceShutdownEvent = (it: AndroidProgram, when: DateTime) => {};
const onAndroidKeyguardShownEvent = (it: AndroidProgram, when: DateTime) => {};
const onAndroidKeyguardHiddenEvent = (it: AndroidProgram, when: DateTime) => {};
const onAndroidActivityResumedEvent = (it: AndroidProgram, packageName: string, when: DateTime) => {};
const onAndroidActivityPausedEvent = (it: AndroidProgram, packageName: string, when: DateTime) => {};
const onAndroidActivityStoppedEvent = (it: AndroidProgram, packageName: string, when: DateTime) => {};
const onAndroidUserStarted = (it: AndroidProgram) => {};
const onAndroidUserStopped = (it: AndroidProgram) => {};
const onAndroidUserRemoved = (it: AndroidProgram) => {};
const onAndroidUserSwitched = (it: AndroidProgram) => {};
const onAndroidServiceCreated = (it: AndroidProgram) => {};
const onAndroidServiceStartCommand = (it: AndroidProgram) => {};
const onAndroidServiceDestroy = (it: AndroidProgram) => {};

export const AndroidProgram = {
  openOrThrow,
  onAndroidProfileProvisioningComplete,
  onAndroidAdminEnabled,
  onAndroidAdminDisabled,
  onAndroidDeviceStartupEvent,
  onAndroidDeviceShutdownEvent,
  onAndroidKeyguardShownEvent,
  onAndroidKeyguardHiddenEvent,
  onAndroidActivityResumedEvent,
  onAndroidActivityPausedEvent,
  onAndroidActivityStoppedEvent,
  onAndroidUserStarted,
  onAndroidUserStopped,
  onAndroidUserRemoved,
  onAndroidUserSwitched,
  onAndroidServiceCreated,
  onAndroidServiceStartCommand,
  onAndroidServiceDestroy,

};