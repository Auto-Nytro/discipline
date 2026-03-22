import { ConditionalTag, ConditionalTypeCountdown, Countdown } from "../x.ts"; 

export class CountdownConditional {
  readonly tag = ConditionalTag.Countdown;
  readonly type = ConditionalTypeCountdown.it;

  countdown: Countdown;

  private constructor(countdown: Countdown) {
    this.countdown = countdown;
  }

  static construct(countdown: Countdown) {
    return new CountdownConditional(countdown);
  }

  static create(countdown: Countdown) {
    return new CountdownConditional(countdown);
  }
}