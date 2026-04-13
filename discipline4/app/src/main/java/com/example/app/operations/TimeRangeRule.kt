package com.example.app

<<<<<<< HEAD
import com.example.app.database.*

object TimeRangeRuleProcedures {
  sealed class CreateReturn {
    class PermissionError(val value: GetCreateRulePermissionError) : CreateReturn() {}
    class GetGroupInfo(val value: GetTimeRangeRuleGroupInfoError) : CreateReturn() {}
    class InternalError(val error: Throwable) : CreateReturn() {}
    class Success(val id: TimeRangeRuleId, val rule: TimeRangeRule) : CreateReturn() {}
=======
object TimeRangeRuleProcedure {
  sealed class CreateReturn {
    class TooManyRules() : CreateReturn() {}
    class Database(val error: Throwable) : CreateReturn() {}
    class Success(val id: UuidV4, val rule: TimeRangeRule) : CreateReturn() {}
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
  }

  fun create(
    state: State,
    database: Database,
    ruleGroupId: TimeRangeRuleGroupId,
<<<<<<< HEAD
    ruleEnablerCreator: RuleEnabler.Creator,
    ruleCondition: TimeRange,
  ): CreateReturn {
    val ruleGroupLocation = state.getTimeRangeRuleGroupLocation(ruleGroupId).let {
      when (it) {
        is Tried.Failure -> {
          return CreateReturn.GetGroupInfo(it.error)
        }
        is Tried.Success -> {
          it.value
        }
      }
    }

    val rule = TimeRangeRule.create(
      enabler = ruleEnablerCreator.create(),
      timeRange = ruleCondition,
    )

    val ruleId = try {
      database.createTimeRangeRule(ruleGroupLocation, ruleGroupId, rule)
    } catch (exception: Throwable) {
      return CreateReturn.InternalError(exception)
    }

    state.createTimeRangeRuleOrNoop(ruleGroupLocation, ruleId, rule)
    return CreateReturn.Success(ruleId, rule)
  }

  sealed class DeleteReturn {
    class RuleEnabled() : DeleteReturn() {}
    class NoSuchRuleGroup(val value: GetTimeRangeRuleGroupInfoError) : DeleteReturn() {}
    class NoSuchRule(val value: GetTimeRangeRuleError) : DeleteReturn() {}
    class InternalError(val error: Throwable) : DeleteReturn() {}
=======
    ruleCondition: TimeRange,
    ruleEnablerCreator: RuleEnabler.Creator
  ): CreateReturn {
    val ruleGroupInfo = state.getTimeRangeRuleGroupInfo(ruleGroupId)

    val statsPermission = state.rulesStats.mayCreateAlwaysRuleInRuleGroup(ruleGroupInfo, ruleGroupId)
    if statsPermission is RulesStatsPermission.No {
      return CreateReturn.TooManyRules(statsPermission.reason)
    }
    

    val ruleId = optionalRuleId ?: UuidV4.generateOrThrow()
    if (rules.has(ruleId)) {
      return CreateReturn.DuplicateRuleId()
    }

    val rule = TimeRangeRule.create(
      ruleCondition,
      ruleEnablerCreator.create(),
    )

    try {
      adapter.createOrThrow(database, location, ruleId, rule)
    } catch (exception: Throwable) {
      return CreateReturn.Database(exception)
    }

    rules.add(id, rule)
    stats.updateAfterTimeRangeRuleCreated()
    return CreateReturn.Success(id, rule)
  }

  sealed class DeleteReturn {
    class NoSuchRule() : DeleteReturn() {}
    class PermissionDenied() : DeleteReturn() {}
    class Database(val error: Throwable) : DeleteReturn() {}
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
    class Success(val rule: TimeRangeRule) : DeleteReturn() {}
  }

  fun delete(
<<<<<<< HEAD
    state: State,
    database: Database,
    ruleGroupId: TimeRangeRuleGroupId,
    ruleId: TimeRangeRuleId,
  ): DeleteReturn {
    val ruleGroupLocation = state.getTimeRangeRuleGroupLocation(ruleGroupId).let {
      when (it) {
        is Tried.Success -> {
          it.value
        }
        is Tried.Failure -> {
          return DeleteReturn.NoSuchRuleGroup(it.error)
        }
      }
    }

    val rule = state.getTimeRangeRule(ruleGroupLocation, ruleId).let {
      when (it) {
        is Tried.Success -> {
          it.value
        }
        is Tried.Failure -> {
          return DeleteReturn.NoSuchRule(it.error)
        }
      }
    }

    val now = state.getMonotonicNow()
    if (rule.isEnabled(now)) {
      return DeleteReturn.RuleEnabled()
    }

    try {
      database.deleteTimeRangeRule(ruleGroupLocation, ruleGroupId, ruleId)
    } catch (exception: Throwable) {
      return DeleteReturn.InternalError(exception)
    }
    
    state.deleteTimeRangeRuleOrNoop(ruleGroupLocation, ruleId)
=======
    database: DatabaseConnection, 
    adapter: TimeRangeRuleDbAdapter,
    location: Location,
    rules: TimeRagneRules,
    stats: RulesStats,
    ruleId: UuidV4,
    clock: MonotonicClock,
  ): DeleteReturn {
    val rule = rules.get(ruleId)
      ?: return DeleteReturn.NoSuchRule()

    val now = clock.getNow()
    if (rule.isEnabled(now)) {
      return DeleteReturn.PermissionDenied()
    }

    try {
      adapter.deleteOrThrow(database, location, ruleId)
    } catch (exception: Throwable) {
      return DeleteReturn.Database(exception)
    }

    rules.remove(ruleId)
    stats.updateAfterTimeRangeRuleDeleted()
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
    return DeleteReturn.Success(rule)
  }
}