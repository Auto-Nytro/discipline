package com.example.app

import com.example.app.failure

public sealed class RuleEnablerCountdownOperation {
  class EnablerCountdownReactivate(val id: UuidV4) : RuleEnablerCountdownOperation() {
    sealed class Return {
      class NonExisting(val error: LocateError) : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success() : Return() {}
    }

    fun execute(state: State, database: Database, location: Location): Return {
      val context = location.locate(state).let {
        when (it) {
          is Tried.Success -> {
            it.value
          }
          is Tried.Failure {
            return Return.NonExisting(it.error)
          }
        }
      }

      val now = context.clock.getNow()
      val reactivateState = context.conditional.createReactivateState(now)

      try {
        database.ruleEnablerCountdownReactivateOrThrow(location, reactivateState)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      conditional.reactivateFromState(reactivateState)
      context.afterEnable()
      return Return.Success()
    }
  }

  class EnablerCountdownAfterPleaReactivate(val id: UuidV4) : RuleEnablerCountdownOperation() {
    sealed class Return {
      class NoSuchApplicationRegulation() : Return() {}
      class NoSuchRule() : Return() {}
      class WrongEnablerType() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success() : Return() {}
    }

    fun execute(state: State, database: Database, location: Location): Return {
      val context = location.locate(state).let {
        when (it) {
          is LocateReturn.Success -> {
            it.context
          }
          is LocateReturn.NoSuchApplicationRegulation -> {
            return Return.NoSuchApplicationRegulation()
          }
        }
      }

      val rule = context.rules.get(id) ?: return Return.NoSuchRule()
      if (rule.enabler !is RuleEnabler.CountdownAfterPlea) {
        return Return.WrongEnablerType()
      }

      try {
        database.alwaysRuleEnablerCountdownAfterPleaReactivateOrThrow(id, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      rule.enabler.it.reactivate()
      return Return.Success()
    }
  }

  class EnablerCountdownAfterPleaReDeactivate(val id: UuidV4) : RuleEnablerCountdownOperation() {
    sealed class Return {
      class NoSuchApplicationRegulation() : Return() {}
      class NoSuchRule() : Return() {}
      class WrongEnablerType() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success() : Return() {}
    }

    fun execute(state: State, database: Database, location: Location): Return {
      val context = location.locate(state).let {
        when (it) {
          is LocateReturn.Success -> {
            it.context
          }
          is LocateReturn.NoSuchApplicationRegulation -> {
            return Return.NoSuchApplicationRegulation()
          }
        }
      }

      val rule = context.rules.get(id) ?: return Return.NoSuchRule()
      if (rule.enabler !is RuleEnabler.CountdownAfterPlea) {
        return Return.WrongEnablerType()
      }

      val now = context.clock.getNow()
      val reDeactivateState = rule.enabler.it.createReDeactivateState(now)

      try {
        database.alwaysRuleEnablerCountdownAfterPleaReDeactivateOrThrow(id, location, reDeactivateState)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      rule.enabler.it.reactivate()
      return Return.Success()
    }
  }

  class Context(
    val conditional: CountdownConditional,
    val clock: MonotonicClock,
  ) {}
  
  sealed class LocateError {
    class NoSuchApplicationRegulation() : LocateError() {}
    class NoSuchRule() : LocateError() {}
    class WrongEnablerType() : LocateError() {}
  }

  sealed class Location {
    class MainUserProfileScreenRegulationCountdownRule(val ruleId: UuidV4) : Location() {}
    class MainUserProfileScreenRegulationTimeRangeRule(val ruleId: UuidV4) : Location() {}
    class MainUserProfileScreenRegulationDailyTimeAllowanceRule(val ruleId: UuidV4) : Location() {}
    class MainUserProfileApplicationRegulationRegulationCountdownRule(val ruleId: UuidV4, val app: AppName) : Location() {}
    class MainUserProfileApplicationRegulationTimeRangeRule(val ruleId: UuidV4, val app: AppName) : Location() {}
    class MainUserProfileApplicationRegulationDailyTimeAllowanceRule(val ruleId: UuidV4, val app: AppName) : Location() {}

    fun locate(state: State): Tried<Context, LocateError> {
      return when (this) {
        is MainUserProfileScreenRegulationCountdownRule -> {
          val rule = state.mainUserProfile.screenRegulation.alwaysRules.get(ruleId)
            ?: return Tried.failure(LocateError.NoSuchRule())

          if (rule.enabler !is RuleEnabler.Countdown) {
            return Tried.failure(LocateError.WrongEnablerType())
          }

          return Tried.success(Context(
            rule.enabler.it, 
            state.monotonicClock,
          ))
        }
        is MainUserProfileScreenRegulationTimeRangeRule -> {
          val rule = state.mainUserProfile.screenRegulation.timeRangeRules.get(ruleId)
            ?: return Tried.failure(LocateError.NoSuchRule())

          if (rule.enabler !is RuleEnabler.Countdown) {
            return Tried.failure(LocateError.WrongEnablerType())
          }

          return Tried.success(Context(
            rule.enabler.it, 
            state.monotonicClock,
          ))
        }
        is MainUserProfileScreenRegulationDailyTimeAllowanceRule -> {
          val rule = state.mainUserProfile.screenRegulation.dailyTimeAllowanceRules.get(ruleId)
            ?: return Tried.failure(LocateError.NoSuchRule())

          if (rule.enabler !is RuleEnabler.Countdown) {
            return Tried.failure(LocateError.WrongEnablerType())
          }

          return Tried.success(Context(
            rule.enabler.it, 
            state.monotonicClock,
          ))
        }
        is MainUserProfileApplicationRegulationRegulationCountdownRule -> {
          val regulation = state.mainUserProfile.applicationRegulations.get(app)
            ?: return Tried.failure(LocateError.NoSuchApplicationRegulation())

          val rule = regulation.alwaysRules.get(ruleId)
            ?: return Tried.failure(LocateError.NoSuchRule())

          if (rule.enabler !is RuleEnabler.Countdown) {
            return Tried.failure(LocateError.WrongEnablerType())
          }

          return Tried.success(Context(
            rule.enabler.it,
            state.monotonicClock,
          ))
        }
        is MainUserProfileApplicationRegulationTimeRangeRule -> {
          val regulation = state.mainUserProfile.applicationRegulations.get(app)
            ?: return Tried.failure(LocateError.NoSuchApplicationRegulation())

          val rule = regulation.timeRangeRules.get(ruleId)
            ?: return Tried.failure(LocateError.NoSuchRule())

          if (rule.enabler !is RuleEnabler.Countdown) {
            return Tried.failure(LocateError.WrongEnablerType())
          }

          return Tried.success(Context(
            rule.enabler.it,
            state.monotonicClock,
          ))
        }
        is MainUserProfileApplicationRegulationDailyTimeAllowanceRule -> {
          val regulation = state.mainUserProfile.applicationRegulations.get(app)
            ?: return Tried.failure(LocateError.NoSuchApplicationRegulation())

          val rule = regulation.dailyTimeAllowanceRules.get(ruleId)
            ?: return Tried.failure(LocateError.NoSuchRule())

          if (rule.enabler !is RuleEnabler.Countdown) {
            return Tried.failure(LocateError.WrongEnablerType())
          }

          return Tried.success(Context(
            rule.enabler.it,
            state.monotonicClock,
          ))
        }
      }
    }

  }
}
