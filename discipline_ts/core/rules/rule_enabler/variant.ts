import { Integer, TextualError } from "@internal/prelude";

export const enum RuleEnablerVariantEnum {
  Countdown,
  CountdownAfterPlea,
}

const COUNTDOWN_AS_NUMBER = Integer.uncheckedFromNumber(0);
const COUNTDOWN_AFTER_PLEA_AS_NUMBER = Integer.uncheckedFromNumber(1);

const fromIntegerOrThrow = (integer: Integer): RuleEnablerVariantEnum => {
  switch (integer) {
    case COUNTDOWN_AS_NUMBER: {
      return RuleEnablerVariantEnum.Countdown;
    }
    case COUNTDOWN_AFTER_PLEA_AS_NUMBER: {
      return RuleEnablerVariantEnum.CountdownAfterPlea;
    }
    default: {
      const textualError = TextualError.create("Creating RuleEnablerVariant from integer");
      TextualError.addMessage(textualError, `Unrecognized value. Expected ${COUNTDOWN_AS_NUMBER} for Countdown or ${COUNTDOWN_AFTER_PLEA_AS_NUMBER} for CountdownAfterPlea, but found something else`)
      TextualError.addNumberAttachment(textualError, "Integer", integer);
      throw TextualError.toJsError(textualError);
    }
  }
};

const toInteger = (it: RuleEnablerVariantEnum): Integer => {
  switch (it) {
    case RuleEnablerVariantEnum.Countdown: {
      return COUNTDOWN_AS_NUMBER;
    }
    case RuleEnablerVariantEnum.CountdownAfterPlea: {
      return COUNTDOWN_AFTER_PLEA_AS_NUMBER;
    }
  }
};

const match = <R1, R2>(
  it: RuleEnablerVariantEnum,
  onCountdown: (it: RuleEnablerVariantEnum.Countdown) => R1,
  onCountdownAfterPlea: (it: RuleEnablerVariantEnum.CountdownAfterPlea) => R2,
) => {
  switch (it) {
    case RuleEnablerVariantEnum.Countdown: {
      return onCountdown(it);
    }
    case RuleEnablerVariantEnum.CountdownAfterPlea: {
      return onCountdownAfterPlea(it);
    }
  }
};

export const RuleEnablerVariant = {
  fromIntegerOrThrow,
  toInteger,
  match,
};