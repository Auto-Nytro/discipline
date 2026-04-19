import { PositiveInteger, Unique } from "@internal/prelude";

const BRAND = Symbol();

type RawRulesStats = {
  maximumRulesCount: PositiveInteger,
  rulesCount: PositiveInteger,
};

export type RulesStats = Unique<typeof BRAND, "RulesStats", RawRulesStats>;

const construct = (
  maximumRulesCount: PositiveInteger,
  rulesCount: PositiveInteger,
): RulesStats => {
  return {
    maximumRulesCount,
    rulesCount,
  } satisfies RawRulesStats as RulesStats;
};

const reconstruct = construct;

const create = (
  maximumRulesCount: PositiveInteger,
): RulesStats => {
  return construct(
    maximumRulesCount,
    PositiveInteger.uncheckedFromNumber(0),
  );
};

const updateAfterAlwaysRuleCreatedOrNoOp = (
  it: RulesStats,
) => {
  it.rulesCount = PositiveInteger.saturatingIncrement(
    it.rulesCount
  );
};

const updateAfterAlwaysRuleDeletedOrNoOp = (
  it: RulesStats,
) => {
  it.rulesCount = PositiveInteger.saturatingDecrement(
    it.rulesCount
  );
};

const updateAfterTimeRangeRuleCreatedOrNoOp = (
  it: RulesStats,
) => {
  it.rulesCount = PositiveInteger.saturatingIncrement(
    it.rulesCount
  );
};

const updateAfterTimeRangeRuleDeletedOrNoOp = (
  it: RulesStats,
) => {
  it.rulesCount = PositiveInteger.saturatingDecrement(
    it.rulesCount
  );
};

const updateAfterTimeAllowanceRuleCreatedOrNoOp = (
  it: RulesStats,
) => {
  it.rulesCount = PositiveInteger.saturatingIncrement(
    it.rulesCount
  );
};

const updateAfterTimeAllowanceRuleDeletedOrNoOp = (
  it: RulesStats,
) => {
  it.rulesCount = PositiveInteger.saturatingDecrement(
    it.rulesCount
  );
};

export const RulesStats = {
  reconstruct,
  create,
  updateAfterAlwaysRuleCreatedOrNoOp,
  updateAfterAlwaysRuleDeletedOrNoOp,
  updateAfterTimeAllowanceRuleCreatedOrNoOp,
  updateAfterTimeAllowanceRuleDeletedOrNoOp,
  updateAfterTimeRangeRuleCreatedOrNoOp,
  updateAfterTimeRangeRuleDeletedOrNoOp,
};