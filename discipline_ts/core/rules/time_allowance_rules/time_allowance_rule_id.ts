import { Integer, Unique } from "@internal/prelude";

const BRAND = Symbol();

export type TimeAllowanceRuleId = Unique<typeof BRAND, "TimeAllowanceRuleId", Integer>;

const wrap = (integer: Integer): TimeAllowanceRuleId => {
  return integer as TimeAllowanceRuleId;
};

const getValue = (it: TimeAllowanceRuleId): Integer => {
  return it;
};

const isEqualTo = (lhs: TimeAllowanceRuleId, rhs: TimeAllowanceRuleId): boolean => {
  return lhs === rhs;
};

export const TimeAllowanceRuleId = {
  wrap,
  getValue,
  isEqualTo,
};