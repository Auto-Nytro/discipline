import { Duration } from "../x.ts";

export class Instant {
  private elapsedTime: Duration;
  
  private constructor(elapsedTime: Duration) {
    this.elapsedTime = elapsedTime;
  }

  static fromElapsedTime(elapsedTime: Duration) {
    return new Instant(elapsedTime);
  }

  isAt(rhs: Instant) {
    return this.elapsedTime.toTotalMilliseconds() === rhs.elapsedTime.toTotalMilliseconds();
  }
  
  isEarilerThan(rhs: Instant) {
    return this.elapsedTime.toTotalMilliseconds() < rhs.elapsedTime.toTotalMilliseconds();
  }
  
  isEarilerThanOrAt(rhs: Instant) {
    return this.elapsedTime.toTotalMilliseconds() <= rhs.elapsedTime.toTotalMilliseconds();
  }
  
  isLaterThan(rhs: Instant) {
    return this.elapsedTime.toTotalMilliseconds() > rhs.elapsedTime.toTotalMilliseconds();
  }

  isLaterThanOrAt(rhs: Instant) {
    return this.elapsedTime.toTotalMilliseconds() >= rhs.elapsedTime.toTotalMilliseconds();
  }
  
  tillOrZero(rhs: Instant): Duration {
    const lhsTimestamp = this.elapsedTime.toTotalMilliseconds();
    const rhsTimestamp = rhs.elapsedTime.toTotalMilliseconds();
  
    if (lhsTimestamp < rhsTimestamp) {
      return Duration.fromMillisecondsOrThrow(rhsTimestamp - lhsTimestamp);
    } else {
      return Duration.zero();
    }
  }
  
  sinceOrZero(rhs: Instant): Duration {
    const lhsTimestamp = this.elapsedTime.toTotalMilliseconds();
    const rhsTimestamp = rhs.elapsedTime.toTotalMilliseconds();
  
    if (lhsTimestamp > rhsTimestamp) {
      return Duration.fromMillisecondsOrThrow(lhsTimestamp - rhsTimestamp);
    } else {
      return Duration.zero();
    }
  }

  minusOrZero(rhs: Duration): Instant {
    return new Instant(this.elapsedTime.minusOrZero(rhs));
  }
  
  plusOrMax(rhs: Duration): Instant {
    return new Instant(this.elapsedTime.plusOrMax(rhs));
  }

  toElapsedTime() {
    return this.elapsedTime;
  }
}