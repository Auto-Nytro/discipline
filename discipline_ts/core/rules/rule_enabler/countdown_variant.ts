import { Unique } from "../../utilities/unique.ts";
import { CountdownConditional, RuleEnablerVariantEnum } from "@internal/prelude";

const BRAND = Symbol();

type RawRuleEnablerCountdown = {
  readonly variant: RuleEnablerVariantEnum.Countdown,
  readonly conditional: CountdownConditional,
};

export type RuleEnablerCountdown = Unique<typeof BRAND, "RuleEnablerCountdown", RawRuleEnablerCountdown>;

const construct = (
  conditional: CountdownConditional,
): RuleEnablerCountdown => {
  return {
    variant: RuleEnablerVariantEnum.Countdown,
    conditional,
  } satisfies RawRuleEnablerCountdown as RuleEnablerCountdown;
};

const reconstruct = construct;

const create = construct;

const getConditional = (
  it: RuleEnablerCountdown
): CountdownConditional => {
  return it.conditional;
};

export const RuleEnablerCountdown = {
  reconstruct,
  create,
  getConditional,
};