import { Unique, AlwaysRules, TimeRangeRules, TimeAllowanceRules } from "@internal/prelude";

const BRAND = Symbol();

type RawScreenRegulation = {
  alwaysRules: AlwaysRules,
  timeRangeRules: TimeRangeRules,
  dailyTimeAllowanceRules: TimeAllowanceRules,
};

export type ScreenRegulation = Unique<typeof BRAND, "ScreenRegulation", RawScreenRegulation>;

const construct = (
  alwaysRules: AlwaysRules,
  timeRangeRules: TimeRangeRules,
  dailyTimeAllowanceRules: TimeAllowanceRules,
): ScreenRegulation => {
  return {
    alwaysRules,
    timeRangeRules,
    dailyTimeAllowanceRules,
  } satisfies RawScreenRegulation as ScreenRegulation;
};

const reconstruct = construct;

const createDefault = () => {
  return construct(
    AlwaysRules.createDefault(),
    TimeRangeRules.createDefault(),
    TimeAllowanceRules.createDefault(),
  )
};

export const ScreenRegulation = {
  reconstruct,
  createDefault,
};