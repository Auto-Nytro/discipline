import { Countdown, RuleEnabler, Unique } from "@internal/prelude";

const BRAND = Symbol();

type RawAlwaysRule = {
  readonly enabler: RuleEnabler,
  readonly condition: Countdown,
};

export type AlwaysRule = Unique<typeof BRAND, "AlwaysRule", RawAlwaysRule>;

const construct = (
  enabler: RuleEnabler, 
  condition: Countdown,
): AlwaysRule => {
  return {
    enabler,
    condition,
  } satisfies RawAlwaysRule as AlwaysRule;
};

const reconstruct = construct;

const create = construct;

const getEnabler = (it: AlwaysRule): RuleEnabler => {
  return it.enabler;
};

const getCondition = (it: AlwaysRule): Countdown => {
  return it.condition;
};

export const AlwaysRule = {
  reconstruct,
  create,
  getEnabler,
  getCondition,
};