package com.example.app

import com.example.app.*

public sealed class TimeRangeRuleOperation {
  class Create(
    val idOrNull: UuidV4?, 
    val condition: TimeRange,
    val enabledDuration: Duration,
  ) : TimeRangeRuleOperation() {
    sealed class Return {
      class TooManyRules() : Return() {}
      class DuplicateRuleId() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val id: UuidV4, val rule: TimeRangeRule) : Return() {}
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

      val rule = TimeRangeRule.create(
        condition,
        Countdown.create(
          context.clock.getNow(),
          enabledDuration,
        )
      )

      try {
        database.addTimeRangeRuleOrThrow(id, rule, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.rules.add(id, rule)
      context.stats.rulesNumber += 1
      context.afterCreate()
      return Return.Success(id, rule)
    }
  }

  class Delete(val id: UuidV4) : TimeRangeRuleOperation() {
    sealed class Return {
      class NoSuchRule() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
      class PermissionDenied() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val rule: TimeRangeRule) : Return() {}
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
        database.deleteTimeRangeRuleOrThrow(id, location)
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
    val rules: TimeRangeRules,
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

    class MainUserScreen : Location() {
      override fun locate(state: State): LocateReturn {
        return LocateReturn.Success(Context(
          rules = state.mainUserProfile.screenRegulation.timeRangeRules,
          stats = state.rulesStats,
          clock = state.monotonicClock,
        ))
      }
    }

    class MainUserApplicationRegulation(val app: AppName) : Location() {
      override fun locate(state: State): LocateReturn {
        val appRegulation = state.mainUserProfile.applicationRegulations.get(app)
          ?: return LocateReturn.NoSuchApplicationRegulation()

        return LocateReturn.Success(Context(
          rules = appRegulation.timeRangeRules,
          clock = state.monotonicClock,
          stats = state.rulesStats,
        ))
      }
    }
  }
}
