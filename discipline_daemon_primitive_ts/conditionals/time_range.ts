import { ConditionalTag, TimeRange, Countdown, ConditionalTypeTimeRange } from "../x.ts";

export class TimeRangeConditional {
  readonly tag = ConditionalTag.TimeRange;
  readonly type = ConditionalTypeTimeRange.it;

  timeRange: TimeRange;
  lifetime: Countdown;

  private constructor(
    timeRange: TimeRange,
    lifetime: Countdown,
  ) {
    this.timeRange = timeRange;
    this.lifetime = lifetime;
  }

  static construct(
    timeRange: TimeRange,
    lifetime: Countdown,
  ) {
    return new TimeRangeConditional(timeRange, lifetime);
  }

  static create(
    timeRange: TimeRange,
    lifetime: Countdown,
  ) {
    return new TimeRangeConditional(timeRange, lifetime);
  }
}
