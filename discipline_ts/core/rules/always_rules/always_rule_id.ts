import { Integer, Unique } from "@internal/prelude";

const BRAND = Symbol();

export type AlwaysRuleId = Unique<typeof BRAND, "AlwaysRuleId", Integer>;

const wrap = (integer: Integer): AlwaysRuleId => {
  return integer as AlwaysRuleId;
};

const getValue = (it: AlwaysRuleId): Integer => {
  return it;
};

const isEqualTo = (lhs: AlwaysRuleId, rhs: AlwaysRuleId): boolean => {
  return lhs === rhs;
};

export const AlwaysRuleId = {
  wrap,
  getValue,
  isEqualTo,
};