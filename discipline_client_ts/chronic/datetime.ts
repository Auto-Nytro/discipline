import { Time, Duration, Branded, Tried } from "../mod.ts";

const BRAND = Symbol();

export type DateTimeT = Branded<typeof BRAND, Date>;

const construct = (inner: Date): DateTimeT => {
  return Branded(BRAND, inner);
};

export const now = (): DateTimeT => {
  return construct(new Date());
};

export const time = (me: DateTimeT): Time.Time => {
  const hour = me.getUTCHours();
  const minute = me.getUTCMinutes();
  return Time.fromHourAndMinuteOrThrow(hour, minute);
};

export const tillOrZero = (lhs: DateTimeT, rhs: DateTimeT): Duration.TDuration => {
  const lhsTimestamp = lhs.getTime();
  const rhsTimestamp = rhs.getTime();

  if (lhsTimestamp < rhsTimestamp) {
    return Duration.fromMillisecondsOrThrow(rhsTimestamp - lhsTimestamp);
  } else {
    return Duration.zero();
  }
};

export const sinceOrZero = (lhs: DateTimeT, rhs: DateTimeT): Duration.TDuration => {
  const lhsTimestamp = lhs.getTime();
  const rhsTimestamp = rhs.getTime();

  if (lhsTimestamp > rhsTimestamp) {
    return Duration.fromMillisecondsOrThrow(lhsTimestamp - rhsTimestamp);
  } else {
    return Duration.zero();
  }
};

// export const equality = Equality.implement<DateTime>({
//   isEqualTo(lhs, rhs) {
//     return lhs.inner.getTime() === rhs.inner.getTime();
//   },
// });

export const timestamp = (me: DateTimeT): number => {
  return me.getTime();
};

// JS Date supports roughly ±8.64e15 ms
const MIN_TIMESTAMP = -8.64e15;
const MAX_TIMESTAMP = 8.64e15;

export const fromTimestamp = (timestamp: number): Tried.Tried<DateTimeT, Error> => {
  if (!Number.isInteger(timestamp)) {
    return Tried.Failure(new Error(`Creating DateTime from timestamp: Timestamp is not integer. Timestamp: ${timestamp}`));
  }

  if (timestamp < MIN_TIMESTAMP) {
    return Tried.Failure(new Error(`Creating DateTime from timestamp: Timestamp is less than the minimum value. Timestamp: ${timestamp}. Minimum value: ${MIN_TIMESTAMP}`))
  }
  
  if (timestamp > MAX_TIMESTAMP) {
    return Tried.Failure(new Error(`Creating DateTime from timestamp: Timestamp is greater than the maximum value. Timestamp: ${timestamp}. Maximum value: ${MAX_TIMESTAMP}`))
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return Tried.Failure(new Error(`Creating DateTime from timestamp: Timestamp didn't produce a valid DateTime for some reason 😭. Timestamp: ${timestamp}`));
  }

  return Tried.Success(Branded(BRAND, date));
};

export const toString = (me: DateTimeT): string => {
  return me.toISOString();
};