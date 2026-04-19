import { TimeAllowanceRule, TimeAllowanceRuleId, Unique, Nullable } from "@internal/prelude";

const BRAND = Symbol();

type RawTimeAllowanceRules = Map<TimeAllowanceRuleId, TimeAllowanceRule>;

export type TimeAllowanceRules = Unique<typeof BRAND, "TimeAllowanceRules", RawTimeAllowanceRules>;

const construct = (rules: RawTimeAllowanceRules): TimeAllowanceRules => {
  return rules satisfies RawTimeAllowanceRules as TimeAllowanceRules;
};

const reconstruct = construct;

const createDefault = (): TimeAllowanceRules => {
  return construct(new Map());
};

const containsById = (
  it: TimeAllowanceRules,
  ruleId: TimeAllowanceRuleId,
): boolean => {
  return it.has(ruleId);
};

const getById = (
  it: TimeAllowanceRules,
  ruleId: TimeAllowanceRuleId,
): Nullable<TimeAllowanceRule> => {
  return it.get(ruleId) ?? null;
};

const addOrReplace = (
  it: TimeAllowanceRules,
  ruleId: TimeAllowanceRuleId,
  rule: TimeAllowanceRule,
) => {
  it.set(ruleId, rule);
};

const ensureRemoved = (
  it: TimeAllowanceRules,
  ruleId: TimeAllowanceRuleId,
) => {
  it.delete(ruleId);
};

export const TimeAllowanceRules = {
  createDefault,
  reconstruct,
  getById,
  addOrReplace,
  containsById,
  ensureRemoved,
};