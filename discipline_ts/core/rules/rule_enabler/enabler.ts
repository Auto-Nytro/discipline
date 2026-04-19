import { RuleEnablerCountdown, RuleEnablerCountdownAfterPlea, RuleEnablerVariantEnum } from "@internal/prelude";

export type RuleEnabler = (
  | RuleEnablerCountdown
  | RuleEnablerCountdownAfterPlea
);

const isCountdown = (
  it: RuleEnabler,
): it is RuleEnablerCountdown => {
  return it.variant === RuleEnablerVariantEnum.Countdown;
};

const isCountdownAfterPlea = (
  it: RuleEnabler,
): it is RuleEnablerCountdownAfterPlea => {
  return it.variant === RuleEnablerVariantEnum.CountdownAfterPlea;
};

const match = <R1, R2>(
  it: RuleEnabler,
  onCountdown: (it: RuleEnablerCountdown) => R1,
  onCountdownAfterPlea: (it: RuleEnablerCountdownAfterPlea) => R2,
): R1 | R2 => {
  switch (it.variant) {
    case RuleEnablerVariantEnum.Countdown: {
      return onCountdown(it);
    }
    case RuleEnablerVariantEnum.CountdownAfterPlea: {
      return onCountdownAfterPlea(it);
    }
  }
};

export const RuleEnabler = {
  isCountdown,
  isCountdownAfterPlea,
  match,
};