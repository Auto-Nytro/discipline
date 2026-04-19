import { AndroidMonitoringServiceState, MonotonicClock, Unique, UserProfile } from "@internal/prelude"

const BRAND = Symbol();

type RawAndroidProgramState = {
  monotonicClock: MonotonicClock,
  mainUserProfile: UserProfile,
  androidMonitoringServiceState: AndroidMonitoringServiceState,
};

export type AndroidProgramState = Unique<
  typeof BRAND,
  "AndroidProgramState",
  RawAndroidProgramState
>;