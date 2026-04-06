package com.example.app

public sealed class AlwaysRuleOperation {
  class Create(
    val idOrNull: UuidV4?, 
    val enablerCreator: RuleEnablerCreator,
  ) : AlwaysRuleOperation() {
    sealed class Return {
      class TooManyRules() : Return() {}
      class DuplicateRuleId() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val id: UuidV4, val rule: AlwaysRule) : Return() {}
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

      val rule = AlwaysRule.create(
        enabler = enablerCreator.create()
      )

      try {
        database.addAlwaysRuleOrThrow(id, rule, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.rules.add(id, rule)
      context.stats.updateAfterAlwaysRuleCreated()
      context.afterCreate()
      return Return.Success(id, rule)
    }
  }

  class Delete(val id: UuidV4) : AlwaysRuleOperation() {
    sealed class Return {
      class NoSuchRule() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
      class PermissionDenied() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val rule: AlwaysRule) : Return() {}
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
      if (rule.isActive(now)) {
        return Return.PermissionDenied()
      }

      try {
        database.deleteAlwaysRuleOrThrow(id, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.rules.remove(id)
      context.stats.updateAfterAlwaysRuleDeleted()
      context.afterDelete()
      return Return.Success(rule)
    }
  }

  class EnablerCountdownReactivate(val id: UuidV4) : AlwaysRuleOperation() {
    sealed class Return {
      class NoSuchRule() : Return() {}
      class NoSuchApplicationRegulation() : Return() {}
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

      val enabler = when (rule.enabler) {
        is RuleEnabler.Countdown -> {
          rule.enabler
        }
        else -> {
          return Return.WrongEnablerType()
        }
      }

      val now = context.clock.getNow()
      val reactivateState = enabler.it.createReactivateState(now)

      try {
        database.alwaysRuleEnablerCountdownReactivateOrThrow(id, location, reactivateState)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      enabler.it.reactivateFromState(reactivateState)
      context.afterEnable()
      return Return.Success()
    }
  }

  class EnablerCountdownAfterPleaReactivate(val id: UuidV4) : AlwaysRuleOperation() {
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

  class EnablerCountdownAfterPleaReDeactivate(val id: UuidV4) : AlwaysRuleOperation() {
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
    val rules: AlwaysRules,
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
          rules = state.mainUserProfile.screenRegulation.alwaysRules,
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
          rules = appRegulation.alwaysRules,
          clock = state.monotonicClock,
          stats = state.rulesStats,
        ))
      }
    }
  }
}
