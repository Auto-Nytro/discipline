import { Duration, Instant } from "../x.ts";

export const enum CountdownStatus {
  Pending,
  Running,
  Finished,
}

const status = Symbol();

type CountdownPending = Countdown & { 
  [status]: CountdownStatus.Pending 
};
type CountdownRunning = Countdown & { 
  [status]: CountdownStatus.Running 
};
type CountdownFinished = Countdown & { 
  [status]: CountdownStatus.Finished 
};

export class Countdown {
  declare [status]: CountdownStatus;

  private constructor(
    private from: Instant,
    private duration: Duration,
  ) {}

  static construct(from: Instant, duration: Duration): Countdown {
    // if (from.isLaterThan(till)) {
    //   return TextualError
    //     .create("Constructing 'Countdown' from 'from' and 'till' arguments")
    //     .addStringAttachment("'from' argument", from.toElapsedTime().toString2())
    //     .addStringAttachment("'till' argument", till.toElapsedTime().toString2());
    // }
    // if (from.isAt(till)) {
    //   return new Error("Creating Countdown from 'from' and 'till' arguments: 'from' is equal to 'till'");
    // }
    return new Countdown(from, duration);
  }

  static create(from: Instant, duration: Duration) {
    return this.construct(from, duration);
  }

  getFrom() {
    return this.from;
  }
  
  getTill() {
    return this.from.plusOrMax(this.duration);
  }

  /**
   * Returns the total duration this Countdown runs for.
   */
  getTotalDuration(): Duration {
    return this.duration;
  }

  setTotalDuration(duration: Duration)  {
    this.duration = duration;
  }
  /**
   * Returns zero if not pending.
   */
  getTimeTillStartOrZero(now: Instant): Duration {
    return now.tillOrZero(this.from);
  }
  /**
   * Returns zero if pending.
   */
  getTimeSinceStartOrZero(now: Instant): Duration {
    return now.sinceOrZero(this.from);
  }
  /**
   * Returns zero if pending.
   * Returns `this.getTotalDuration()` if finished. 
   */
  getElapsedTimeOrZero(now: Instant): Duration {
    return this.getTimeSinceStartOrZero(now).min(this.duration)
  }
  /**
   * if pending, returns `Duration.zero()`.
   * if running, returns how much more time the countdown will run for.
   * if finished, returns `Duration.zero().
   */
  getRemainingTimeOrZero(now: Instant): Duration {
    return this
      .getTotalDuration()
      .minusOrZero(this.getElapsedTimeOrZero(now))
  }
  /**
   * if pending, returns the time from @param now till `this.getTill()`.
   * if running, returns the time from @param now till `this.getTill()`.
   * if finished, returns `Duration.zero()`.
   */
  getTimeTillFinishOrZero(now: Instant) {
    return now.tillOrZero(this.getTill());
  }

  getStatus(now: Instant) {
    if (now.isEarilerThan(this.from)) {
      return CountdownStatus.Pending;
    }

    const elapsedTime = this.from.tillOrZero(now);
    if (elapsedTime.isShorterThanOrEqualTo(this.duration)) {
      return CountdownStatus.Running;
    }

    return CountdownStatus.Finished;
  }

  isPending(now: Instant): boolean {
    return this.getStatus(now) === CountdownStatus.Pending;
  }

  isRunning(now: Instant): boolean {
    return this.getStatus(now) === CountdownStatus.Running;
  }

  isFinished(now: Instant): boolean {
    return this.getStatus(now) === CountdownStatus.Finished;
  }

  extendByOrSetToMax(factor: Duration) {
    this.duration = this.duration.plusOrMax(factor); 
  }

  match<A, B, C>(now: Instant, cases: {
    Pending: (it: CountdownPending) => A,
    Running: (it: CountdownRunning) => B,
    Finished: (it: CountdownFinished) => C,
  }): A | B | C {
    switch (this.getStatus(now)) {
      case CountdownStatus.Pending: return cases.Pending(this as CountdownPending);
      case CountdownStatus.Running: return cases.Running(this as CountdownRunning);
      case CountdownStatus.Finished: return cases.Finished(this as CountdownFinished);
    }
  }
}

