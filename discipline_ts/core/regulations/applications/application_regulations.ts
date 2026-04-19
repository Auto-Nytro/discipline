import { ApplicationName, ApplicationRegulation, Unique } from "@internal/prelude";

const BRAND = Symbol();

type RawApplicationRegulations = Map<ApplicationName, ApplicationRegulation>;

export type ApplicationRegulations = Unique<typeof BRAND, "ApplicationRegulations", RawApplicationRegulations>;

const construct = (
  regulations: Map<ApplicationName, ApplicationRegulation>,
): ApplicationRegulations => {
  return regulations satisfies RawApplicationRegulations as ApplicationRegulations;
};

const reconstruct = construct;

const createDefault = () => {
  return construct(new Map());
};

export const ApplicationRegulations = {
  reconstruct,
  createDefault,
};