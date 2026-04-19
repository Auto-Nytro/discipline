import { TimeRange, Unique, RuleEnabler } from "@internal/prelude";

const BRAND = Symbol();

type RawTimeRangeRule = {
  enabler: RuleEnabler,
  condition: TimeRange,
};

export type TimeRangeRule = Unique<typeof BRAND, "TimeRangeRule", RawTimeRangeRule>;

const construct = (
  enabler: RuleEnabler,
  condition: TimeRange,
): TimeRangeRule => {
  return {
    enabler,
    condition,
  } satisfies RawTimeRangeRule as TimeRangeRule;
};

const reconstruct = construct;

const create = construct;

const getEnabler = (it: TimeRangeRule): RuleEnabler => {
  return it.enabler;
};

const getCondition = (it: TimeRangeRule): TimeRange => {
  return it.condition;
};

export const TimeRangeRule = {
  reconstruct,
  create,
  getEnabler,
  getCondition,
};