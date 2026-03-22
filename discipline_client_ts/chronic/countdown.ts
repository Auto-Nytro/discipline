import { Duration, DateTime, Branded } from "../mod.ts";

const BRAND = Symbol();

export type TCountdown = Branded<typeof BRAND, {
  remainingDuration: Duration.TDuration,
  previousSynchronizationTime: DateTime.DateTimeT,
}>;

export const construct = (
  remainingDuration: Duration.TDuration,
  previousSynchronizationTime: DateTime.DateTimeT,
): TCountdown => {
  return Branded(BRAND, {
    remainingDuration,
    previousSynchronizationTime,
  });
};

export const create = (duration: Duration.TDuration, now: DateTime.DateTimeT): TCountdown => {
  return construct(duration, now);
}

export const synchronize = (me: TCountdown, now: DateTime.DateTimeT) => {
  const interval = DateTime.tillOrZero(
    me.previousSynchronizationTime, 
    now,
  );

  me.remainingDuration = Duration.minusOrZero(
    me.remainingDuration,
    interval,
  );

  me.previousSynchronizationTime = now;
}

export const isFinished = (me: TCountdown): boolean => {
  return Duration.isZero(me.remainingDuration);
};

export const isRunning = (me: TCountdown): boolean => {
  return !Duration.isZero(me.remainingDuration);
};

export const getRemainingDuration = (me: TCountdown): Duration.TDuration => {
  return me.remainingDuration;
};

export const setRemaniningDuration = (me: TCountdown, newValue: Duration.TDuration) => {
  me.remainingDuration = newValue;
};

export const getPreviousSynchronizationTime = (me: TCountdown): DateTime.DateTimeT => {
  return me.previousSynchronizationTime;
};