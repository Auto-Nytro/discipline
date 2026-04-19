import { AlwaysRule, AlwaysRuleId, Unique, Nullable } from "@internal/prelude";

const BRAND = Symbol();

type RawAlwaysRules = Map<AlwaysRuleId, AlwaysRule>;

export type AlwaysRules = Unique<typeof BRAND, "AlwaysRules", RawAlwaysRules>;

const construct = (rules: RawAlwaysRules): AlwaysRules => {
  return rules satisfies RawAlwaysRules as AlwaysRules;
};

const reconstruct = construct;

const createDefault = (): AlwaysRules => {
  return construct(new Map());
};

const containsById = (
  it: AlwaysRules,
  ruleId: AlwaysRuleId,
): boolean => {
  return it.has(ruleId);
};

const getById = (
  it: AlwaysRules,
  ruleId: AlwaysRuleId,
): Nullable<AlwaysRule> => {
  return it.get(ruleId) ?? null;
};

const addOrReplace = (
  it: AlwaysRules,
  ruleId: AlwaysRuleId,
  rule: AlwaysRule,
) => {
  it.set(ruleId, rule);
};

const ensureRemoved = (
  it: AlwaysRules,
  ruleId: AlwaysRuleId,
) => {
  it.delete(ruleId);
};

export const AlwaysRules = {
  createDefault,
  reconstruct,
  getById,
  addOrReplace,
  containsById,
  ensureRemoved,
};