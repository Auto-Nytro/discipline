import { Unique } from "../../utilities/unique.ts";
import { CountdownAfterPleaConditional, RuleEnablerVariantEnum } from "@internal/prelude";

const BRAND = Symbol();

type RawRuleEnablerCountdownAfterPlea = {
  readonly variant: RuleEnablerVariantEnum.CountdownAfterPlea,
  readonly conditional: CountdownAfterPleaConditional,
};

export type RuleEnablerCountdownAfterPlea = Unique<typeof BRAND, "RuleEnablerCountdownAfterPlea", RawRuleEnablerCountdownAfterPlea>;

const construct = (
  conditional: CountdownAfterPleaConditional,
): RuleEnablerCountdownAfterPlea => {
  return {
    variant: RuleEnablerVariantEnum.CountdownAfterPlea,
    conditional,
  } satisfies RawRuleEnablerCountdownAfterPlea as RuleEnablerCountdownAfterPlea;
};

const reconstruct = construct;

const create = construct;

const getConditional = (
  it: RuleEnablerCountdownAfterPlea
): CountdownAfterPleaConditional => {
  return it.conditional;
};

export const RuleEnablerCountdownAfterPlea = {
  reconstruct,
  create,
  getConditional,
};