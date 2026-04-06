package com.example.app

import com.example.app.*

public sealed class TimeAllowanceRuleOperation {
  class Create(
    val idOrNull: UuidV4?, 
    val enablerCreator: RuleEnablerCreator,
    val totalAllowance: Duration,
  ) : TimeAllowanceRuleOperation() {
    sealed class Return {
      class TooManyRules() : Return() {}
      class DuplicateRuleId() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val id: UuidV4, val rule: TimeAllowanceRule) : Return() {}
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

      if (context.stats.isFull()) {
        return Return.TooManyRules()
      }

      val id = idOrNull ?: UuidV4.generateOrThrow()
      
      if (context.rules.has(id)) {
        return Return.DuplicateRuleId()
      }

      val rule = TimeAllowanceRule(
        enabler = enablerCreator.create(),
        allowance = totalAllowance,
      )

      try {
        database.addTimeAllowanceRuleOrThrow(id, rule, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.rules.add(id, rule)
      context.stats.rulesNumber += 1
      context.afterCreate()
      return Return.Success(id, rule)
    }
  }

  class Delete(val id: UuidV4) : TimeAllowanceRuleOperation() {
    sealed class Return {
      class NoSuchRule() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
      class PermissionDenied() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val rule: TimeAllowanceRule) : Return() {}
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

      val rule = context.rules.get(id)
        ?: return Return.NoSuchRule()

      val now = context.clock.getNow()
      if (rule.isEnabled(now)) {
        return Return.PermissionDenied()
      }

      try {
        database.deleteTimeAllowanceRuleOrThrow(id, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.rules.remove(id)
      context.stats.rulesNumber -= 1
      context.afterDelete()
      return Return.Success(rule)
    }
  }

  class Context(
    val rules: TimeAllowanceRules,
    val stats: RulesStats,
    val clock: MonotonicClock,
  ) {
    fun afterCreate() {}
    fun afterDelete() {}
    fun afterEnable() {}
    fun afterDisable() {}
  }
  
  sealed class LocateReturn {
    class Success(val context: Context) : LocateReturn() {}
    class NoSuchApplicationRegulation() : LocateReturn() {}
  }

  sealed class Location {
    abstract fun locate(state: State): LocateReturn

    class MainUserProfileScreenRegulationDaily : Location() {
      override fun locate(state: State): LocateReturn {
        return LocateReturn.Success(Context(
          rules = state.mainUserProfile.screenRegulation.dailyTimeAllowanceRules,
          stats = state.rulesStats,
          clock = state.monotonicClock,
        ))
      }
    }

    class MainUserProfileApplicationRegulationDaily(val app: AppName) : Location() {
      override fun locate(state: State): LocateReturn {
        val appRegulation = state.mainUserProfile.applicationRegulations.get(app)
          ?: return LocateReturn.NoSuchApplicationRegulation()

        return LocateReturn.Success(Context(
          rules = appRegulation.dailyTimeAllowanceRules,
          clock = state.monotonicClock,
          stats = state.rulesStats,
        ))
      }
    }
  }
}
