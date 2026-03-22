import { Duration, DateTime } from "../x.ts";

export class UptimeClock {
  private dailyUptime: Duration;
  private previousSynchronizationTime: DateTime;

  private constructor(
    dailyUptime: Duration,
    previousSynchronizationTime: DateTime,
  ) {
    this.dailyUptime = dailyUptime;
    this.previousSynchronizationTime = previousSynchronizationTime;
  }

  static create(now: DateTime) {
    return new UptimeClock(
      Duration.zero(),
      now,
    );
  }

  static construct(
    dailyUptime: Duration,
    previousSynchronizationTime: DateTime,
  ) {
    return new UptimeClock(dailyUptime, previousSynchronizationTime);
  }

  synchronize(
    now: DateTime,
    synchronizationInterval: Duration,
    didSynchronizeSinceDevicePowerUp: boolean,
  ) {
    if (now.getDate().isLaterThan(this.previousSynchronizationTime.getDate())) {
      this.dailyUptime = Duration.zero();
      this.previousSynchronizationTime = now;
      return;
    }

    if (!didSynchronizeSinceDevicePowerUp) {
      this.previousSynchronizationTime = now;
      return;
    }

    const timeSincePreviousSynchronization = this
      .previousSynchronizationTime
      .tillOrZero(now)
      .max(synchronizationInterval);

    this.dailyUptime = this
      .dailyUptime
      .plusOrMax(timeSincePreviousSynchronization);
      
    this.previousSynchronizationTime = now;
  }

  getDailyUptime() {
    return this.dailyUptime;
  }

  getPreviousSynchronizationTime(): DateTime {
    return this.previousSynchronizationTime;
  }
}