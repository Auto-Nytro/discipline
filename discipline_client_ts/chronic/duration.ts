import { Tried, withVirtualKey } from "../mod.ts";

const BRAND = Symbol();

export type TDuration = number & {
  readonly [BRAND]: "Duration"
};

export const MAXIMUM_MILLISECONDS = Number.MAX_SAFE_INTEGER;
export const MAXIMUM_SECONDS = MAXIMUM_MILLISECONDS / 1000;
export const MAXIMUM_MINUTES = MAXIMUM_SECONDS / 60;
export const MAXIMUM_HOURS = MAXIMUM_MINUTES / 60;

export const MILLISECONDS_PER_SECOND = 1000;
export const MILLISECONDS_PER_MINUTE = MILLISECONDS_PER_SECOND * 60;
export const MILLISECONDS_PER_HOUR = MILLISECONDS_PER_MINUTE * 60;
export const MILLISECONDS_PER_DAY = MILLISECONDS_PER_HOUR * 24;
export const MILLISECONDS_PER_WEEK = MILLISECONDS_PER_DAY * 7;

const construct = (inner: number): TDuration => {
  return withVirtualKey(BRAND, inner);
};

export const fromMilliseconds = (milliseconds: number): Tried.Tried<TDuration, Error> => {
  if (Number.isInteger(milliseconds)) {
    return Tried.Failure(new Error("Creating Duration from milliseconds: Argument 'milliseconds' is integer"));
  }
  if (milliseconds < 0) {
    return Tried.Failure(new Error("Creating Duration from milliseconds: Argument 'milliseconds' is less than minium value which is zero"));
  }
  if (milliseconds > MAXIMUM_MILLISECONDS) {
    return Tried.Failure(new Error(`Creating Duration from milliseconds: Argument 'milliseconds' is greater than maximum value which is ${MAXIMUM_MILLISECONDS}`));
  }
  return Tried.Success(construct(milliseconds));
};

export const fromMillisecondsOrThrow = (milliseconds: number): TDuration => {
  if (!Number.isInteger(milliseconds)) {
    throw new Error("Creating Duration from milliseconds: Argument 'milliseconds' is not an integer");
  }
  if (milliseconds < 0) {
    throw new Error("Creating Duration from milliseconds: Argument 'milliseconds' is less than minium value which is zero");
  }
  if (milliseconds > MAXIMUM_MILLISECONDS) {
    throw new Error(`Creating Duration from milliseconds: Argument 'milliseconds' is greater than maximum value which is ${MAXIMUM_MILLISECONDS}`);
  }
  return construct(milliseconds);
}

export const fromHoursOrThrow = (hours: number): TDuration => {
  if (!Number.isInteger(hours)) {
    throw new Error("Creating Duration from hours: Argument 'hours' is not an integer");
  }
  if (hours < 0) {
    throw new Error("Creating Duration from hours: Argument 'hours' is less than minium value which is zero");
  }
  if (hours > MAXIMUM_HOURS) {
    throw new Error(`Creating Duration from hours: Argument 'hours' is greater than maximum value which is ${MAXIMUM_HOURS}`);
  }
  return construct(hours * MILLISECONDS_PER_HOUR);
}

export const zero = (): TDuration => {
  return construct(0);
};

export const isZero = (me: TDuration): boolean => {
  return toTotalMilliseconds(me) === 0;
};

export const toTotalMilliseconds = (me: TDuration): number => {
  return me;
};

export const toTotaMinutes = (me: TDuration): number => {
  return Math.floor(toTotalMilliseconds(me) / MILLISECONDS_PER_MINUTE);
};

export const minusOrZero = (lhs: TDuration, rhs: TDuration): TDuration => {
  if (toTotalMilliseconds(lhs) > toTotalMilliseconds(rhs)) {
    return construct(toTotalMilliseconds(lhs) - toTotalMilliseconds(rhs));
  } else {
    return zero();
  }
};

export const plusOrMax = (lhs: TDuration, rhs: TDuration): TDuration => {
  const result = toTotalMilliseconds(lhs) + toTotalMilliseconds(rhs);
  if (result <= MAXIMUM_MILLISECONDS) {
    return construct(result);
  } else {
    return construct(MAXIMUM_MILLISECONDS);
  }
};

export const isGreaterThan = (lhs: TDuration, rhs: TDuration): boolean => {
  return lhs > rhs;
};

export const isGreaterThanOrEqualTo = (lhs: TDuration, rhs: TDuration): boolean => {
  return lhs >= rhs;
};

export const isLessThan = (lhs: TDuration, rhs: TDuration): boolean => {
  return lhs < rhs;
};

export const isLessThanOrEqualTo = (lhs: TDuration, rhs: TDuration): boolean => {
  return lhs <= rhs;
};

export const min = (lhs: TDuration, rhs: TDuration): TDuration => {
  return isLessThan(lhs, rhs) ? lhs : rhs; 
}

export const toString = (me: TDuration): string => {
  const parts: string[] = [];

  let totalMilliseconds = toTotalMilliseconds(me);
  
  const totalDays = Math.floor(totalMilliseconds / MILLISECONDS_PER_DAY);
  totalMilliseconds %= MILLISECONDS_PER_DAY;
  parts.push(`${totalDays} D`);
  
  const totalHours = Math.floor(totalMilliseconds / MILLISECONDS_PER_HOUR);
  totalMilliseconds %= MILLISECONDS_PER_HOUR;
  parts.push(`${totalHours} H`);
  
  const totalMinutes = Math.floor(totalMilliseconds / MILLISECONDS_PER_MINUTE);
  totalMilliseconds %= MILLISECONDS_PER_MINUTE;
  parts.push(`${totalMinutes} M`);
  
  return parts.join(' ');
}

export const toString2 = (me: TDuration): string => {
  const milliseconds = toTotaMinutes(me);

  if (milliseconds === 0) {
    return '0s';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const seconds = totalSeconds % 60;
  const minutes = totalMinutes % 60;
  const hours = totalHours % 24;
  const days = totalDays;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days}d`);
  }
  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0) {
    parts.push(`${minutes}m`);
  }
  if (seconds > 0 || parts.length === 0) {
    parts.push(`${seconds}s`);
  }

  return parts.join(' ');
}