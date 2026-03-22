import { Duration, Time } from "../x.ts";

export class TimeRange {
  private constructor(
    private readonly from: number, 
    private readonly till: number, 
  ) {}

  static readonly MINIMUM_FROM_TIMESTAMP = 0;
  static readonly MAXIMUM_FROM_TIMESTAMP = 1000 * 60 * 60 * 24 - 1;
  
  static readonly MINIMUM_TILL_TIMESTAMP = 0;
  static readonly MAXIMUM_TILL_TIMESTAMP = 1000 * 60 * 60 * 24 * 2 - 1;
  
  static fromHour12AndMinuteOrNone(from: number, till: number): TimeRange | null {
    if (
      Number.isInteger(from)
      &&
      from >= TimeRange.MINIMUM_FROM_TIMESTAMP
      &&
      from <= TimeRange.MAXIMUM_FROM_TIMESTAMP
      &&
      Number.isInteger(till)
      &&
      till >= TimeRange.MINIMUM_TILL_TIMESTAMP
      &&
      till <= TimeRange.MAXIMUM_TILL_TIMESTAMP
      &&
      from <= till
      &&
      (till - from) <= Duration.MILLISECONDS_PER_DAY
    ) {
      return new TimeRange(from, till);
    }
  
    return null;
  };
  
  static fromTimes(from: Time, till: Time): TimeRange {
    const fromTimestamp = from.getTimestamp();
    const tillTimestamp = till.getTimestamp();
  
    if (fromTimestamp <= tillTimestamp) {
      return new TimeRange(fromTimestamp, tillTimestamp);
    } else {
      return new TimeRange(fromTimestamp, tillTimestamp + Duration.MILLISECONDS_PER_DAY);
    }
  }
  
  contains(time: Time): boolean {
    return (
      time.getTimestamp() >= this.from
      &&
      time.getTimestamp() <= this.till
    );
  }
  
  getFrom(): Time {
    return Time.fromTimestampOrThrow(this.from);
  }
  
  getTill(): Time {
    return Time.fromTimestampOrThrow(
      this.till <= TimeRange.MAXIMUM_FROM_TIMESTAMP 
        ? this.till
        : this.till - TimeRange.MAXIMUM_FROM_TIMESTAMP
    );
  }
  
  getFromTimestamp(): number {
    return this.from;
  }
  
  getTillTimestamp(): number {
    return this.till;
  }
  
  toString(): string {
    const from = this.getFrom().toString();
    const till = this.getTill().toString();
    return `${from} .. ${till}`;
  }
}