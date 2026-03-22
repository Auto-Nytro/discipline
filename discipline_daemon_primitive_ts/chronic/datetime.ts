import { Date, Time, Duration } from "../x.ts";

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

export class DateTime {
  private constructor(private readonly date: globalThis.Date) {}

  static now(): DateTime {
    return new DateTime(new globalThis.Date());
  }
  
  getTime(): Time {
    const hour = this.date.getUTCHours();
    const minute = this.date.getUTCMinutes();
    return Time.fromHourAndMinuteOrThrow(hour, minute);
  }
  
  toTimestamp(): number {
    return this.date.getTime();
  }

  tillOrZero(rhs: DateTime): Duration {
    const lhsTimestamp = this.date.getTime();
    const rhsTimestamp = rhs.date.getTime();
  
    if (lhsTimestamp < rhsTimestamp) {
      return Duration.fromMillisecondsOrThrow(rhsTimestamp - lhsTimestamp);
    } else {
      return Duration.zero();
    }
  }
  
  sinceOrZero(rhs: DateTime): Duration {
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
  
  static fromTimestamp(timestamp: number): DateTime | Error {
    if (!Number.isInteger(timestamp)) {
      return new Error(`Creating DateTime from timestamp: Timestamp is not integer. Timestamp: ${timestamp}`);
    }
  
    if (timestamp < DateTime.MIN_TIMESTAMP) {
      return new Error(`Creating DateTime from timestamp: Timestamp is less than the minimum value. Timestamp: ${timestamp}. Minimum value: ${DateTime.MIN_TIMESTAMP}`)
    }
    
    if (timestamp > DateTime.MAX_TIMESTAMP) {
      return new Error(`Creating DateTime from timestamp: Timestamp is greater than the maximum value. Timestamp: ${timestamp}. Maximum value: ${DateTime.MAX_TIMESTAMP}`)
    }
  
    const date = new globalThis.Date(timestamp);
  
    if (Number.isNaN(date.getTime())) {
      return new Error(`Creating DateTime from timestamp: Timestamp didn't produce a valid DateTime for some reason 😭. Timestamp: ${timestamp}`);
    }
  
    return new DateTime(date);
  }
  
  toString(): string {
    return this.date.toISOString();
  }

  getDate() {
    const x = new globalThis.Date(this.date);
    x.setUTCHours(0, 0, 0, 0);
    return new Date(x);
  }

  isAt(rhs: DateTime) {
    return this.toTimestamp() === rhs.toTimestamp();
  }
  
  isEarilerThan(rhs: DateTime) {
    return this.toTimestamp() < rhs.toTimestamp();
  }
  
  isEarilerThanOrAt(rhs: DateTime) {
    return this.toTimestamp() <= rhs.toTimestamp();
  }
  
  isLaterThan(rhs: DateTime) {
    return this.toTimestamp() > rhs.toTimestamp();
  }

  isLaterThanOrAt(rhs: DateTime) {
    return this.toTimestamp() >= rhs.toTimestamp();
  }

  toString2() {
    return formatter.format(this.toTimestamp());
  }
}