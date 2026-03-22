import { Date, Time, Duration, Branded, Tried, TextualError } from "../x.ts";

const formatter = new Intl.DateTimeFormat("ar-SA", {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
  calendar: "gregory",
  formatMatcher: "best fit",
});

const BRAND = Symbol();

export type DateTime = Branded<typeof BRAND, globalThis.Date>;

export const MINIMUM_TIMESTAMP = -8.64e15;
export const MAXIMUM_TIMESTAMP = 8.64e15;

export const construct = (date: globalThis.Date): DateTime => {
  return Branded(BRAND, date);
};

export const now = (): DateTime => {
  return construct(new globalThis.Date());
};

export const fromTimestamp = (timestamp: number): Tried<DateTime, TextualError> => {
  if (!Number.isInteger(timestamp)) {
    const it = TextualError.create("Creating a DateTime from a millisecond timestamp since the unix epoch");
    TextualError.addMessage(it, "Argument 'timestamp' is not an integer");
    TextualError.addNumberAttachment(it, "Argument 'timestamp'", timestamp);
    return Tried.Failure(it);
  }

  if (timestamp < MINIMUM_TIMESTAMP) {
    const it = TextualError.create("Creating a DateTime from a millisecond timestamp since the unix epoch");
    TextualError.addMessage(it, "Argument 'timestamp' is less than the minimum valid value");
    TextualError.addNumberAttachment(it, "Argument 'timestamp'", timestamp);
    TextualError.addNumberAttachment(it, "Minimum valid value", MINIMUM_TIMESTAMP);
    return Tried.Failure(it);
  }
  
  if (timestamp > MAXIMUM_TIMESTAMP) {
    const it = TextualError.create("Creating a DateTime from a millisecond timestamp since the unix epoch");
    TextualError.addMessage(it, "Argument 'timestamp' is greater than the maximum valid value");
    TextualError.addNumberAttachment(it, "Argument 'timestamp'", timestamp);
    TextualError.addNumberAttachment(it, "Maximum valid value", MAXIMUM_TIMESTAMP);
    return Tried.Failure(it);
  }

  const date = new globalThis.Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    const it = TextualError.create("Creating a DateTime from a millisecond timestamp since the unix epoch");
    TextualError.addMessage(it, "Argument 'timestamp' is valid but didn't produce a valid JavaScript Date");
    TextualError.addNumberAttachment(it, "Argument 'timestamp'", timestamp);
    return Tried.Failure(it);
  }

  return Tried.Success(construct(date));
};

export const getTime = (it: DateTime): Time => {
  const hour = it.getUTCHours();
  const minute = it.getUTCMinutes();
  return Tried.unwrap(Time.fromHourAndMinute(hour, minute));
};

export const toTimestamp = (it: DateTime): number => {
  return it.getTime();
};

export const tillOrZero = (it: DateTime, rhs: DateTime): Duration => {
  const lhsTimestamp = it.getTime();
  const rhsTimestamp = rhs.getTime();

  if (lhsTimestamp < rhsTimestamp) {
    return Duration.fromMillisecondsOrThrow(rhsTimestamp - lhsTimestamp);
  } else {
    return Duration.zero();
  }
};

export const sinceOrZero = (lhs: DateTime, rhs: DateTime): Duration => {
  const lhsTimestamp = lhs.getTime();
  const rhsTimestamp = rhs.getTime();

  if (lhsTimestamp > rhsTimestamp) {
    return Duration.fromMillisecondsOrThrow(lhsTimestamp - rhsTimestamp);
  } else {
    return Duration.zero();
  }
};

export const toString = (it: DateTime): string => {
  return it.toISOString();
};

export const getDate = (it: DateTime): Date => {
  const clone = new globalThis.Date(it);
  clone.setUTCHours(0, 0, 0, 0);
  return Date.construct(clone);
};

export const isAt = (lhs: DateTime, rhs: DateTime): boolean => {
  return toTimestamp(lhs) === toTimestamp(rhs);
};

export const isEarilerThan = (lhs: DateTime, rhs: DateTime): boolean => {
  return toTimestamp(lhs) < toTimestamp(rhs);
};

export const isEarilerThanOrAt = (lhs: DateTime, rhs: DateTime): boolean => {
  return toTimestamp(lhs) <= toTimestamp(rhs);
};

export const isLaterThan = (lhs: DateTime, rhs: DateTime): boolean => {
  return toTimestamp(lhs) > toTimestamp(rhs);
};

export const isLaterThanOrAt = (lhs: DateTime, rhs: DateTime): boolean => {
  return toTimestamp(lhs) >= toTimestamp(rhs);
};

export const toString2 = (it: DateTime): string => {
  return formatter.format(toTimestamp(it));
};

export const DateTime = {
  MINIMUM_TIMESTAMP,
  MAXIMUM_TIMESTAMP,
  now,
  getTime,
  toTimestamp,
  tillOrZero,
  sinceOrZero,
  fromTimestamp,
  toString,
  getDate,
  isAt,
  isEarilerThan,
  isEarilerThanOrAt,
  isLaterThan,
  isLaterThanOrAt,
  toString2,
};