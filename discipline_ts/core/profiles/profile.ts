import { Unique, ScreenRegulation, ApplicationRegulations, UptimeClock, VaultsStats, RulesStats, ApplicationRegulationsStats } from "@internal/prelude";

const BRAND = Symbol();

type RawUserProfile = {
  screenRegulation: ScreenRegulation,
  applicationRegulations: ApplicationRegulations,
  uptimeClock: UptimeClock,
  vaultsStats: VaultsStats,
  rulesStats: RulesStats,
  applicationRegulationsStats: ApplicationRegulationsStats,
};

export type UserProfile = Unique<typeof BRAND, "UserProfile", RawUserProfile>;

const construct = (
  screenRegulation: ScreenRegulation,
  applicationRegulations: ApplicationRegulations,
  uptimeClock: UptimeClock,
  vaultsStats: VaultsStats,
  rulesStats: RulesStats,
  applicationRegulationsStats: ApplicationRegulationsStats,
): UserProfile => {
  return {
    screenRegulation,
    applicationRegulations,
    uptimeClock,
    vaultsStats,
    rulesStats,
    applicationRegulationsStats,
  } satisfies RawUserProfile as UserProfile;
};

const reconstruct = construct;

const create = construct;

export const UserProfile = {
  reconstruct,
  create,
};