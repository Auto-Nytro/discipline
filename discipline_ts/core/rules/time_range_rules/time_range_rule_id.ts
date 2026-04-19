import { Integer, Unique } from "@internal/prelude";

const BRAND = Symbol();

export type TimeRangeRuleId = Unique<typeof BRAND, "TimeRangeRuleId", Integer>;

const wrap = (integer: Integer): TimeRangeRuleId => {
  return integer as TimeRangeRuleId;
};

const getValue = (it: TimeRangeRuleId): Integer => {
  return it;
};

const isEqualTo = (lhs: TimeRangeRuleId, rhs: TimeRangeRuleId): boolean => {
  return lhs === rhs;
};

export const TimeRangeRuleId = {
  wrap,
  getValue,
  isEqualTo,
};