package com.example.app.procedures

import com.example.app.*

class CountdownConditionalApi {
  sealed class Location {
    class MainUserProfileScreenRegulationAlwaysRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileScreenRegulationTimeRangeRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileScreenRegulationDailyTimeAllowanceRuleEnabler(val ruleId: UuidV4) : Location() {}

    class MainUserProfileApplicationRegulationAlwaysRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileApplicationRegulationTimeRangeRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileApplicationRegulationDailyTimeAllowanceRuleEnabler(val ruleId: UuidV4) : Location() {}

    class MainUserProfileVaultProtector(val vaultId: UuidV4) : Location() {}
  }

  sealed class LocateError {
    class NoSuchApplicationRegulation() : LocateError() {}
    class NoSuchRule() : LocateError() {}
    class WrongRuleEnablerType() : LocateError() {}
    class WrongVaultProtectorType() : LocateError() {}
  }

  typealias ReactivateReturn = Either<LocateError, procedures.countdownconditional.ReactivateReturn>
}

class CountdownAfterPleaConditionalApi {
  sealed class Location {
    class MainUserProfileScreenRegulationAlwaysRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileScreenRegulationTimeRangeRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileScreenRegulationDailyTimeAllowanceRuleEnabler(val ruleId: UuidV4) : Location() {}

    class MainUserProfileApplicationRegulationAlwaysRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileApplicationRegulationTimeRangeRuleEnabler(val ruleId: UuidV4) : Location() {}
    class MainUserProfileApplicationRegulationDailyTimeAllowanceRuleEnabler(val ruleId: UuidV4) : Location() {}

    class MainUserProfileVaultProtector(val vaultId: UuidV4) : Location() {}
  }

  sealed class LocateError {
    class NoSuchApplicationRegulation() : LocateError() {}
    class NoSuchRule() : LocateError() {}
    class WrongRuleEnablerType() : LocateError() {}
    class WrongVaultProtectorType() : LocateError() {}
  }

  typealias ReactivateReturn = Either<LocateError, procedures.countdownafterpleaconditional.ReactivateReturn>
  typealias ReDeactivateReturn = Either<LocateError, procedures.countdownafterpleaconditional.ReDeactivateReturn>
}

class AlwaysRuleApi {
  sealed class LocateError {
    class NoSuchApplicationRegulation() : LocateError() {}
  }

  sealed class Location {
    class MainUserProfileScreenRegulation() AlwaysRuleApi() {}
    class MainUserProfileApplicationRegulation(val applicationName: ApplicationName) AlwaysRuleApi() {}
  }

  typealias CreateReturn = Either<LocateError, procedures.alwaysrule.CreateReturn>
  typealias DeleteReturn = Either<LocateError, procedures.alwaysrule.DeleteReturn>
}

class TimeRangeRuleApi {
  sealed class LocateError {
    class NoSuchApplicationRegulation() : LocateError() {}
  }

  sealed class Location {
    class MainUserProfileScreenRegulation() TimeRangeRuleApi() {}
    class MainUserProfileApplicationRegulation(val applicationName: ApplicationName) TimeRangeRuleApi() {}
  }

  typealias CreateReturn = Either<LocateError, procedures.timerangerule.CreateReturn>
  typealias DeleteReturn = Either<LocateError, procedures.timerangerule.DeleteReturn>
}

class TimeAllowanceRuleApi {
  sealed class LocateError {
    class NoSuchApplicationRegulation() : LocateError() {}
  }

  sealed class Location {
    class MainUserProfileScreenRegulationDailyTimeAllowance() : Location() {}
    class MainUserProfileApplicationRegulationDailyTimeAllowance() : Location() {}
  }

  typealias CreateReturn = Either<LocateError, procedures.timeallowancerule.CreateReturn>
  typealias DeleteReturn = Either<LocateError, procedures.timeallowancerule.DeleteReturn>
}

class ApplicationRegulationApi {
  sealed class LocateError() {
    
  }

  sealed class Location() {
    class MainUserProfile() : Location() {}
  }

  typealias CreateReturn = Either<LocateError, procedures.applicationregulation.CreateReturn>
  typealias DeleteReturn = Either<LocateError, procedures.applicationregulation.DeleteReturn>
}

class VaultApi {
  sealed class LocateError() {}

  sealed class Location() {
    class MainUserProfile() : Location() {}
  }

  typealias CreateReturn = Either<LocateError, procedures.vault.CreateReturn>
  typealias DeleteReturn = Either<LocateError, procedures.vault.DeleteReturn>
}