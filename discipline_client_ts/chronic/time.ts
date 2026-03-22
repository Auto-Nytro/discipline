import { Branded, Duration, Option, withVirtualKey } from "../mod.ts";

const BRAND = Symbol();

export type Time = Branded<typeof BRAND, number>;

const construct = (inner: number): Time => {
  return withVirtualKey(BRAND, inner);
};

export const Time = {
  fromTimestampOrNone(timestamp: number): Option.Option<Time> => {
    if (
      Number.isInteger(timestamp) 
      && 
      timestamp >= MINIMUM_TIMESTAMP
      &&
      timestamp <= MAXIMUM_TIMESTAMP
    ) {
      return Option.Some(construct(timestamp));
    }
  
    return Option.None();
  };
  
  export const fromTimestampOrThrow = (timestamp: number): Time => {
    if (
      Number.isInteger(timestamp) 
      && 
      timestamp >= MINIMUM_TIMESTAMP
      &&
      timestamp <= MAXIMUM_TIMESTAMP
    ) {
      return construct(timestamp);
    }
  
    throw new Error(`Creating Time from a millisecond-based timestamp since midnight: Timestamp is invalid. Timestamp: ${JSON.stringify(timestamp)}`)
  };
  
  export const fromHourAndMinuteAmOrThrow = (hour: number, minute: number): Time => {
    if (!Number.isInteger(hour)) {
      throw new Error("Creating Time from hour (AM) and minute: Hour is not integer");
    }
    if (hour < 0) {
      throw new Error("Creating Time from hour (AM) and minute: Hour is less than zero");
    }
    if (hour > 11) {
      throw new Error("Creating Time from hour (AM) and minute: Hour is greater than 11");
    }
    if (!Number.isInteger(minute)) {
      throw new Error("Creating Time from hour (AM) and minute: Minute is not integer");
    }
    if (minute < 0) {
      throw new Error("Creating Time from hour (AM) and minute: Minute less than zero");
    }
    if (minute > 59) {
      throw new Error("Creating Time from hour (AM) and minute: Minute is greater than 59");
    }
  
    return construct(
      hour * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    )
  };
  
  export const fromHourAndMinutePmOrThrow = (hour: number, minute: number): Time => {
    if (!Number.isInteger(hour)) {
      throw new Error("Creating Time from hour (PM) and minute: Hour is not integer");
    }
    if (hour < 0) {
      throw new Error("Creating Time from hour (PM) and minute: Hour is less than zero");
    }
    if (hour > 11) {
      throw new Error("Creating Time from hour (PM) and minute: Hour is greater than 11");
    }
    if (!Number.isInteger(minute)) {
      throw new Error("Creating Time from hour (PM) and minute: Minute is not integer");
    }
    if (minute < 0) {
      throw new Error("Creating Time from hour (PM) and minute: Minute less than zero");
    }
    if (minute > 59) {
      throw new Error("Creating Time from hour (PM) and minute: Minute is greater than 59");
    }
  
    return construct(
      (12 + hour) * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    );
  };
  
  export const fromHourAndMinuteOrThrow = (hour: number, minute: number): Time => {
    if (!Number.isInteger(hour)) {
      throw new Error("Creating Time from hour and minute: Hour is not integer");
    }
    if (hour < 0) {
      throw new Error("Creating Time from hour and minute: Hour is less than zero");
    }
    if (hour > 23) {
      throw new Error("Creating Time from hour and minute: Hour is greater than 23");
    }
    if (!Number.isInteger(minute)) {
      throw new Error("Creating Time from hour and minute: Minute is not integer");
    }
    if (minute < 0) {
      throw new Error("Creating Time from hour and minute: Minute less than zero");
    }
    if (minute > 59) {
      throw new Error("Creating Time from hour and minute: Minute is greater than 59");
    }
  
    return construct(
      hour * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    );
  };
  
  export const timestamp = (me: Time): number => {
    return me;
  };
  
  /**
   * @param me 
   * @returns a number from 0 to 23, inclusive both.
   */
  export const getHour = (me: Time): number => {
    return Math.floor(
      timestamp(me) 
      /
      Duration.MILLISECONDS_PER_HOUR
    );
  };
  /**
   * 
   * @param me 
   * @returns a number from 0 to 59, inclusive both.
   */
  export const getMinute = (me: Time): number => {
    return Math.floor(
      timestamp(me) 
      % 
      Duration.MILLISECONDS_PER_HOUR 
      / 
      Duration.MILLISECONDS_PER_MINUTE
    );
  };
  /**
   * 
   * @param me 
   * @returns a number from 0 to 59, inclusive both.
   */
  export const getSecond = (me: Time): number => {
    return Math.floor(
      timestamp(me) 
      % 
      Duration.MILLISECONDS_PER_HOUR 
      %
      Duration.MILLISECONDS_PER_MINUTE
      /
      Duration.MILLISECONDS_PER_SECOND
    );
  };
  
  export const toString = (me: Time): string => {
    return `${
      getHour(me).toString()
    }:${
      getMinute(me).toString()
    }:${
      getSecond(me).toString
    }`;
  },
}
export const MINIMUM_TIMESTAMP = 0;
export const MAXIMUM_TIMESTAMP = 1000 * 60 * 60 * 24 - 1;
