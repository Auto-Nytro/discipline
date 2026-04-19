import { Duration, RuleEnabler, Unique } from "@internal/prelude";

const BRAND = Symbol();

type RawTimeAllowanceRule = {
  enabler: RuleEnabler,
  totalAllowance: Duration,
}

export type TimeAllowanceRule = Unique<typeof BRAND, "TimeAllowanceRule", RawTimeAllowanceRule>;;

// const MINIMUM_ALLOWANCE = Tried.experimental_unwrap(Duration.fromHours(1));
// const MAXIMUM_ALLOWANCE = Tried.experimental_unwrap(Duration.fromHours(24));
// const MAXIMUM_LIFETIME = Tried.experimental_unwrap(Duration.fromHours(24 * 3));

const construct = (
  enabler: RuleEnabler,
  totalAllowance: Duration,
): TimeAllowanceRule => {
  return {
    enabler,
    totalAllowance,
  } satisfies RawTimeAllowanceRule as TimeAllowanceRule;
};

const reconstruct = construct;

const create = construct;
// const create = (
//   allowance: Duration,
//   lifetime: Countdown,
// ): Tried<TimeAllowanceRule, TextualError> => {
//   if (Duration.isShorterThan(allowance, MINIMUM_ALLOWANCE)) {
//     const it = TextualError.create("Creating a ScreenTimeAllowanceRule");
//     TextualError.addMessage(it, "Allowance is too short");
//     TextualError.addStringAttachment(it, "Minimum allowance", Duration.toString2(MINIMUM_ALLOWANCE));
//     TextualError.addStringAttachment(it, "Provided allowance", Duration.toString2(allowance));
//     return Tried.Failure(it);
//   }

//   if (Duration.isLongerThan(allowance, MAXIMUM_ALLOWANCE)) {
//     const it = TextualError.create("Creating a ScreenTimeAllowanceRule");
//     TextualError.addMessage(it, "Allowance is too long");
//     TextualError.addStringAttachment(it, "Maximum allowance", Duration.toString2(MAXIMUM_ALLOWANCE));
//     TextualError.addStringAttachment(it, "Provided allowance", Duration.toString2(allowance));
//     return Tried.Failure(it);
//   }

//   if (Duration.isLongerThan(Countdown.getTotalDuration(lifetime), MAXIMUM_LIFETIME)) {
//     const it = TextualError.create("Creating a ScreenTimeAllowanceRule");
//     TextualError.addMessage(it, "Lifetime is too long");
//     TextualError.addStringAttachment(it, "Maximum lifetime", Duration.toString2(MAXIMUM_LIFETIME))
//     TextualError.addStringAttachment(it, "Provided lifetime", Duration.toString2(Countdown.getTotalDuration(lifetime)));
//   }

//   return Tried.Success(construct(
//     false, 
//     allowance, 
//     lifetime,
//   ));
// };

const getEnabler = (it: TimeAllowanceRule): RuleEnabler => {
  return it.enabler;
};

const getTotalAllowance = (it: TimeAllowanceRule): Duration => {
  return it.totalAllowance;
};

const getRemainingAllowance = (it: TimeAllowanceRule, dailyUptime: Duration): Duration => {
  return Duration.saturatingSub(it.totalAllowance, dailyUptime);
};

const isAllowanceUp = (it: TimeAllowanceRule, dailyUptime: Duration): boolean => {
  return Duration.isLongerThan(dailyUptime, it.totalAllowance);
};

export const TimeAllowanceRule = {
  reconstruct,
  create,
  getTotalAllowance,
  getRemainingAllowance,
  isAllowanceUp,
  getEnabler,
};