import { Unique, AlwaysRules, TimeAllowanceRules, TimeRangeRules } from "@internal/prelude";

const BRAND = Symbol();

type RawApplicationRegulation = {
  alwaysRules: AlwaysRules,
  timeRangeRules: TimeRangeRules,
  dailyTimeAllowanceRules: TimeAllowanceRules,
};

export type ApplicationRegulation = Unique<typeof BRAND, "ApplicationRegulation", RawApplicationRegulation>;

const construct = (
  alwaysRules: AlwaysRules,
  timeRangeRules: TimeRangeRules,
  dailyTimeAllowanceRules: TimeAllowanceRules,  
): ApplicationRegulation => {
  return {
    alwaysRules,
    timeRangeRules,
    dailyTimeAllowanceRules,
  } satisfies RawApplicationRegulation as ApplicationRegulation;
};

const reconstruct = construct;

const craeteDefault = (): ApplicationRegulation => {
  return construct(
    AlwaysRules.createDefault(),
    TimeRangeRules.createDefault(),
    TimeAllowanceRules.createDefault(),
  );
};

export const ApplicationRegulation = {
  reconstruct,
  craeteDefault,
};