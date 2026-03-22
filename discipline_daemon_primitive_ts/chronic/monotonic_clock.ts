import { Duration, DateTime, Instant } from "../x.ts";

export class MonotonicClock {
  private elapsedTime: Duration;
  private previousSynchronizationTime: DateTime;

  private constructor(
    elapsedTime: Duration,
    previousSynchronizationTime: DateTime,
  ) {
    this.elapsedTime = elapsedTime;
    this.previousSynchronizationTime = previousSynchronizationTime;
  }

  static create(now: DateTime) {
    return new MonotonicClock(
      Duration.zero(),
      now,
    );
  }

  static construct(
    elapsedTime: Duration,
    previousSynchronizationTime: DateTime,
  ) {
    return new MonotonicClock(
      elapsedTime,
      previousSynchronizationTime,
    );
  }

  synchronize(now: DateTime) {
    const interval = this.previousSynchronizationTime.tillOrZero(now);
    this.elapsedTime = this.elapsedTime.plusOrMax(interval);
    this.previousSynchronizationTime = now;
  }

  getElapsedTime(): Duration {
    return this.elapsedTime;
  }

  getPreviousSynchronizationTime(): DateTime {
    return this.previousSynchronizationTime;
  }

  getNow() {
    return Instant.fromElapsedTime(this.elapsedTime);
  }

  getNowAsDateTime() {
    const now = DateTime.now();
    if (now.isEarilerThan(this.previousSynchronizationTime)) {
      return now;
    } else {
      return this.previousSynchronizationTime;
    }
  }
}