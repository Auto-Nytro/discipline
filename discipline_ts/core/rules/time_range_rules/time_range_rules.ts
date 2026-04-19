import { TimeRangeRule, TimeRangeRuleId, Unique, Nullable } from "@internal/prelude";

const BRAND = Symbol();

type RawTimeRangeRules = Map<TimeRangeRuleId, TimeRangeRule>;

export type TimeRangeRules = Unique<typeof BRAND, "TimeRangeRules", RawTimeRangeRules>;

const construct = (rules: RawTimeRangeRules): TimeRangeRules => {
  return rules satisfies RawTimeRangeRules as TimeRangeRules;
};

const reconstruct = construct;

const createDefault = (): TimeRangeRules => {
  return construct(new Map());
};

const containsById = (
  it: TimeRangeRules,
  ruleId: TimeRangeRuleId,
): boolean => {
  return it.has(ruleId);
};

const getById = (
  it: TimeRangeRules,
  ruleId: TimeRangeRuleId,
): Nullable<TimeRangeRule> => {
  return it.get(ruleId) ?? null;
};

const addOrReplace = (
  it: TimeRangeRules,
  ruleId: TimeRangeRuleId,
  rule: TimeRangeRule,
) => {
  it.set(ruleId, rule);
};

const ensureRemoved = (
  it: TimeRangeRules,
  ruleId: TimeRangeRuleId,
) => {
  it.delete(ruleId);
};

export const TimeRangeRules = {
  createDefault,
  reconstruct,
  getById,
  addOrReplace,
  containsById,
  ensureRemoved,
};