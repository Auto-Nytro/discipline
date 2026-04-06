package com.example.procedures.countdownafterpleaconditional

import com.example.app.Database
import com.example.app.MonotonicClock
import com.example.app.CountdownAfterPleaConditional

class CountdownAfterPleaConditionalLocation {}
class CountdownAfterPleaConditionalDbAdapter {
  fun reactivateOrThrow(
    database: Database,
    location: CountdownAfterPleaConditionalLocation,
  ) {}

  fun reDeactivateOrThrow(
    database: Database,
    location: CountdownAfterPleaConditionalLocation,
    reDeactivateState: CountdownAfterPleaConditional.ReDeactivateState
  ) {

  }
}

sealed class ReactivateReturn {
  class Database(val error: Throwable) : ReactivateReturn() {}
  class Success() : ReactivateReturn() {}
}

fun reactivate(
  database: Database,
  adapter: CountdownAfterPleaConditionalDbAdapter,
  location: CountdownAfterPleaConditionalLocation,
  conditional: CountdownAfterPleaConditional,
): ReactivateReturn {
  try {
    adapter.reactivateOrThrow(database, location)
  } catch (exception: Throwable) {
    return ReactivateReturn.Database(exception)
  }

  conditional.reactivate()
  return ReactivateReturn.Success()
}

sealed class ReDeactivateReturn {
  class Database(val error: Throwable) : ReDeactivateReturn() {}
  class Success() : ReDeactivateReturn() {}
}

fun reDeactivate(
  database: Database,
  adapter: CountdownAfterPleaConditionalDbAdapter,
  location: CountdownAfterPleaConditionalLocation,
  conditional: CountdownAfterPleaConditional,
  clock: MonotonicClock,
): ReDeactivateReturn {
  val now = clock.getNow()
  val reDeactivateState = conditional.createReDeactivateState(now)

  try {
    database.alwaysRuleEnablerCountdownAfterPleaReDeactivateOrThrow(id, location, reDeactivateState)
  } catch (exception: Throwable) {
    return Return.Database(exception)
  }

  rule.enabler.it.reactivate()
  return Return.Success()
}

// class Context(
//   val conditional: CountdownConditional,
//   val clock: MonotonicClock,
// ) {}

// sealed class LocateError {
//   class NoSuchApplicationRegulation() : LocateError() {}
//   class NoSuchRule() : LocateError() {}
//   class WrongEnablerType() : LocateError() {}
// }

// sealed class Location {
//   class MainUserProfileScreenRegulationCountdownRule(val ruleId: UuidV4) : Location() {}
//   class MainUserProfileScreenRegulationTimeRangeRule(val ruleId: UuidV4) : Location() {}
//   class MainUserProfileScreenRegulationDailyTimeAllowanceRule(val ruleId: UuidV4) : Location() {}
//   class MainUserProfileApplicationRegulationRegulationCountdownRule(val ruleId: UuidV4, val app: AppName) : Location() {}
//   class MainUserProfileApplicationRegulationTimeRangeRule(val ruleId: UuidV4, val app: AppName) : Location() {}
//   class MainUserProfileApplicationRegulationDailyTimeAllowanceRule(val ruleId: UuidV4, val app: AppName) : Location() {}

//   fun locate(state: State): Tried<Context, LocateError> {
//     return when (this) {
//       is MainUserProfileScreenRegulationCountdownRule -> {
//         val rule = state.mainUserProfile.screenRegulation.alwaysRules.get(ruleId)
//           ?: return Tried.failure(LocateError.NoSuchRule())

//         if (rule.enabler !is RuleEnabler.Countdown) {
//           return Tried.failure(LocateError.WrongEnablerType())
//         }

//         return Tried.success(Context(
//           rule.enabler.it, 
//           state.monotonicClock,
//         ))
//       }
//       is MainUserProfileScreenRegulationTimeRangeRule -> {
//         val rule = state.mainUserProfile.screenRegulation.timeRangeRules.get(ruleId)
//           ?: return Tried.failure(LocateError.NoSuchRule())

//         if (rule.enabler !is RuleEnabler.Countdown) {
//           return Tried.failure(LocateError.WrongEnablerType())
//         }

//         return Tried.success(Context(
//           rule.enabler.it, 
//           state.monotonicClock,
//         ))
//       }
//       is MainUserProfileScreenRegulationDailyTimeAllowanceRule -> {
//         val rule = state.mainUserProfile.screenRegulation.dailyTimeAllowanceRules.get(ruleId)
//           ?: return Tried.failure(LocateError.NoSuchRule())

//         if (rule.enabler !is RuleEnabler.Countdown) {
//           return Tried.failure(LocateError.WrongEnablerType())
//         }

//         return Tried.success(Context(
//           rule.enabler.it, 
//           state.monotonicClock,
//         ))
//       }
//       is MainUserProfileApplicationRegulationRegulationCountdownRule -> {
//         val regulation = state.mainUserProfile.applicationRegulations.get(app)
//           ?: return Tried.failure(LocateError.NoSuchApplicationRegulation())

//         val rule = regulation.alwaysRules.get(ruleId)
//           ?: return Tried.failure(LocateError.NoSuchRule())

//         if (rule.enabler !is RuleEnabler.Countdown) {
//           return Tried.failure(LocateError.WrongEnablerType())
//         }

//         return Tried.success(Context(
//           rule.enabler.it,
//           state.monotonicClock,
//         ))
//       }
//       is MainUserProfileApplicationRegulationTimeRangeRule -> {
//         val regulation = state.mainUserProfile.applicationRegulations.get(app)
//           ?: return Tried.failure(LocateError.NoSuchApplicationRegulation())

//         val rule = regulation.timeRangeRules.get(ruleId)
//           ?: return Tried.failure(LocateError.NoSuchRule())

//         if (rule.enabler !is RuleEnabler.Countdown) {
//           return Tried.failure(LocateError.WrongEnablerType())
//         }

//         return Tried.success(Context(
//           rule.enabler.it,
//           state.monotonicClock,
//         ))
//       }
//       is MainUserProfileApplicationRegulationDailyTimeAllowanceRule -> {
//         val regulation = state.mainUserProfile.applicationRegulations.get(app)
//           ?: return Tried.failure(LocateError.NoSuchApplicationRegulation())

//         val rule = regulation.dailyTimeAllowanceRules.get(ruleId)
//           ?: return Tried.failure(LocateError.NoSuchRule())

//         if (rule.enabler !is RuleEnabler.Countdown) {
//           return Tried.failure(LocateError.WrongEnablerType())
//         }

//         return Tried.success(Context(
//           rule.enabler.it,
//           state.monotonicClock,
//         ))
//       }
//     }
//   }

// }
// }
