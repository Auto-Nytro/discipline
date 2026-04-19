import { PositiveInteger, Unique } from "@internal/prelude";

const BRAND = Symbol();

type RawApplicationRegulationsStats = {
  maximumRegulationsCount: PositiveInteger,
  regulationsCount: PositiveInteger,
};

export type ApplicationRegulationsStats = Unique<
  typeof BRAND, 
  "ApplicationRegulationsStats",
  RawApplicationRegulationsStats
>;

const construct = (
  maximumRegulationsCount: PositiveInteger,
  regulationsCount: PositiveInteger,
): ApplicationRegulationsStats => {
  return {
    maximumRegulationsCount,
    regulationsCount,
  } satisfies RawApplicationRegulationsStats as ApplicationRegulationsStats;
};

const reconstruct = construct;

const create = (
  maximumRegulationsCount: PositiveInteger,
): ApplicationRegulationsStats => {
  return construct(
    maximumRegulationsCount,
    PositiveInteger.uncheckedFromNumber(0),
  );
};

const updateAfterRegulationCreatedOrNoOp = (
  it: ApplicationRegulationsStats,
) => {
  it.regulationsCount = PositiveInteger.saturatingIncrement(
    it.regulationsCount,
  );
};

const updateAfterRegulationDeletedOrNoOp = (
  it: ApplicationRegulationsStats,
) => {
  it.regulationsCount = PositiveInteger.saturatingDecrement(
    it.regulationsCount,
  );
};

const isFull = (
  it: ApplicationRegulationsStats,
): boolean => {
  return it.regulationsCount >= it.maximumRegulationsCount;
};

export const ApplicationRegulationsStats = {
  reconstruct,
  create,
  updateAfterRegulationCreatedOrNoOp,
  updateAfterRegulationDeletedOrNoOp,
  isFull,
};