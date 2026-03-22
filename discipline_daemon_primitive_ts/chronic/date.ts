import { Duration } from "../x.ts";

export class Date {
  constructor(private readonly date: globalThis.Date) {}

  static now(): Date {
    const date = new globalThis.Date();
    date.setUTCHours(0, 0, 0, 0);
    return new Date(date);
  }
  
  getTimestamp(): number {
    return this.date.getTime();
  }

  tillOrZero(rhs: Date): Duration {
    const lhsTimestamp = this.date.getTime();
    const rhsTimestamp = rhs.date.getTime();
  
    if (lhsTimestamp < rhsTimestamp) {
      return Duration.fromMillisecondsOrThrow(rhsTimestamp - lhsTimestamp);
    } else {
      return Duration.zero();
    }
  }
  
  sinceOrZero(rhs: Date): Duration {
    const lhsTimestamp = this.date.getTime();
    const rhsTimestamp = rhs.date.getTime();
  
    if (lhsTimestamp > rhsTimestamp) {
      return Duration.fromMillisecondsOrThrow(lhsTimestamp - rhsTimestamp);
    } else {
      return Duration.zero();
    }
  }
  
  
  // JS Date supports roughly ±8.64e15 ms
  private static readonly MIN_TIMESTAMP = -8.64e15;
  private static readonly MAX_TIMESTAMP = 8.64e15;
  
  static fromTimestamp(timestamp: number): Date | Error {
    if (!Number.isInteger(timestamp)) {
      return new Error(`Creating Date from timestamp: Timestamp is not integer. Timestamp: ${timestamp}`);
    }
  
    if (timestamp < Date.MIN_TIMESTAMP) {
      return new Error(`Creating Date from timestamp: Timestamp is less than the minimum value. Timestamp: ${timestamp}. Minimum value: ${Date.MIN_TIMESTAMP}`)
    }
    
    if (timestamp > Date.MAX_TIMESTAMP) {
      return new Error(`Creating Date from timestamp: Timestamp is greater than the maximum value. Timestamp: ${timestamp}. Maximum value: ${Date.MAX_TIMESTAMP}`)
    }
  
    const date = new globalThis.Date(timestamp);
  
    if (Number.isNaN(date.getTime())) {
      return new Error(`Creating Date from timestamp: Timestamp didn't produce a valid Date for some reason 😭. Timestamp: ${timestamp}`);
    }
    if (
      date.getUTCHours() !== 0
      ||
      date.getUTCMinutes() !== 0
      ||
      date.getUTCSeconds() !== 0
      ||
      date.getUTCMilliseconds() !== 0
    ) {
      // TODO: Add an error message
      return new Error("");
    }
  
    return new Date(date);
  }
  
  toString(): string {
    return this.date.toISOString();
  }
  
  getDayStart() {
    const clone = new globalThis.Date(this.date);
    clone.setUTCHours(24, 0, 0, 0);
    return new Date(clone);
  }

  getDurationTillMidnight() {
    const clone = new globalThis.Date(this.date);
    clone.setUTCHours(24, 0, 0, 0);

    const fromTimestamp = this.date.getTime();
    const tillTimestamp = clone.getTime();
    const difference = tillTimestamp - fromTimestamp;

    return Duration.fromMillisecondsOrThrow(difference);
  }

  // withTime(time: Time): DateTime {
  //   throw ""
  // }

  // plusOrMax(duration: Duration): Date {
  //   throw "";
  // }

  isLaterThan(rhs: Date) {
    return this.getTimestamp() > rhs.getTimestamp();
  }
}