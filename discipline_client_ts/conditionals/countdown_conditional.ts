import { Countdown, DateTime, Duration, Option, withVirtualKey } from "../mod.ts";

const BRAND = Symbol();

export type CountdownConditional = {
  readonly [BRAND]: "CountdownConditional",
  readonly duration: Duration.TDuration,
  countdown: Option.Option<Countdown.TCountdown>,
};

const construct = (
  duration: Duration.TDuration, 
  countdown: Option.Option<Countdown.TCountdown>,
): CountdownConditional => {
  return withVirtualKey(BRAND, {
    duration,
    countdown,
  });
};

export const create = (duration: Duration.TDuration): CountdownConditional => {
  return construct(duration, Option.None());
};

export const synchronize = (me: CountdownConditional, now: DateTime.DateTimeT) => {
  if (Option.isSome(me.countdown)) {
    const countdown = Option.value(me.countdown);

    Countdown.synchronize(countdown, now);

    if (Countdown.isFinished(countdown)) {
      me.countdown = Option.None();
    }
  }
};

export const isCountdownRunning = (me: CountdownConditional): boolean => {
  return Option.isSome(me.countdown);
};