import { Duration, DateTime, Instant, Branded } from "@internal/prelude";

const BRAND = Symbol();

export type MonotonicClock = Branded<typeof BRAND, {
  elapsedTime: Duration,
  previousSynchronizationTime: DateTime,
}>;

const construct = (
  elapsedTime: Duration,
  previousSynchronizationTime: DateTime,
): MonotonicClock => {
  return Branded(BRAND, {
    elapsedTime,
    previousSynchronizationTime,
  });
};

const create = (now: DateTime): MonotonicClock => {
  return construct(
    Duration.zero(),
    now,
  );
};

const synchronize = (it: MonotonicClock, now: DateTime): void => {
  const interval = DateTime.tillOrZero(it.previousSynchronizationTime, now);
  it.elapsedTime = Duration.saturatingAdd(it.elapsedTime, interval);
  it.previousSynchronizationTime = now;
};

const getElapsedTime = (it: MonotonicClock): Duration => {
  return it.elapsedTime;
};

const getPreviousSynchronizationTime = (it: MonotonicClock): DateTime => {
  return it.previousSynchronizationTime;
};

const getNow = (it: MonotonicClock): Instant => {
  return Instant.fromElapsedTime(it.elapsedTime);
};

const getNowAsDateTime = (it: MonotonicClock): DateTime => {
  const now = DateTime.now();
  if (DateTime.isEarilerThan(now, it.previousSynchronizationTime)) {
    return now;
  } else {
    return it.previousSynchronizationTime;
  }
};

export const MonotonicClock = {
  create,
  construct,
  synchronize,
  getElapsedTime,
  getPreviousSynchronizationTime,
  getNow,
  getNowAsDateTime,
};