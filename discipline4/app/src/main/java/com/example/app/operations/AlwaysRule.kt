package com.example.app

<<<<<<< HEAD
import com.example.app.database.*

object AlwaysRuleProcedures {
  sealed class CreateReturn {
    class PermissionError(val value: GetCreateRulePermissionError) : CreateReturn() {}
    class GetGroupInfo(val value: GetAlwaysRuleGroupInfoError) : CreateReturn() {}
=======
object AlwaysRuleProcedure {
  sealed class CreateReturn {
    class TooManyRules() : CreateReturn() {}
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
    class InternalError(val error: Throwable) : CreateReturn() {}
    class Success(val id: AlwaysRuleId, val rule: AlwaysRule) : CreateReturn() {}
  }

  fun create(
    state: State,
    database: Database,
    ruleGroupId: AlwaysRuleGroupId,
    ruleEnablerCreator: RuleEnabler.Creator,
  ): CreateReturn {
<<<<<<< HEAD
    val ruleGroupLocation = state.getAlwaysRuleGroupLocation(ruleGroupId).let {
      when (it) {
        is Tried.Failure -> {
          return CreateReturn.GetGroupInfo(it.error)
        }
        is Tried.Success -> {
          it.value
        }
      }
=======
    val ruleGroupInfo = state.getAlwaysRuleGroupInfo(ruleGroupId)
    
    val statsPermission = state.rulesStats.mayCreateAlwaysRuleInRuleGroup(ruleGroupInfo, ruleGroupId).
    if statsPermission is RulesStats.Permission.No {
      return CreateReturn.TooManyRules(statsPermission.reason)
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
    }

    val rule = AlwaysRule.create(
      enabler = ruleEnablerCreator.create()
    )

    val ruleId = try {
<<<<<<< HEAD
      database.createAlwaysRule(ruleGroupLocation, ruleGroupId, rule)
    } catch (exception: Throwable) {
      return CreateReturn.InternalError(exception)
    }

    state.createAlwaysRuleOrNoop(ruleGroupLocation, ruleId, rule)
=======
      database.createAlwaysRuleOrThrow(ruleGroupInfo, ruleGroupId, rule)
    } catch (exception: Throwable) {
      return CreateReturn.InternalError(exception)
    }
    
    state.addAlwaysRuleOrNoop(ruleGroupInfo, ruleGroupId, ruleId, rule)
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
    return CreateReturn.Success(ruleId, rule)
  }

  sealed class DeleteReturn {
    class RuleEnabled() : DeleteReturn() {}
    class NoSuchRuleGroup(val value: GetAlwaysRuleGroupInfoError) : DeleteReturn() {}
    class NoSuchRule(val value: GetAlwaysRuleError) : DeleteReturn() {}
    class InternalError(val error: Throwable) : DeleteReturn() {}
    class Success(val rule: AlwaysRule) : DeleteReturn() {}
  }

  fun delete(
    state: State,
    database: Database,
    ruleGroupId: AlwaysRuleGroupId,
<<<<<<< HEAD
    ruleId: AlwaysRuleId,
  ): DeleteReturn {
    val ruleGroupLocation = state.getAlwaysRuleGroupLocation(ruleGroupId).let {
      when (it) {
        is Tried.Success -> {
          it.value
        }
        is Tried.Failure -> {
          return DeleteReturn.NoSuchRuleGroup(it.error)
        }
      }
    }

    val rule = state.getAlwaysRule(ruleGroupLocation, ruleId).let {
      when (it) {
        is Tried.Success -> {
          it.value
        }
        is Tried.Failure -> {
          return DeleteReturn.NoSuchRule(it.error)
        }
=======
    ruleId: UuidV4,
  ): DeleteReturn {
    val ruleGroupInfo = state.getAlwaysRuleGroupInfo(ruleGroupId)

    val ruleOrError = state.getAlwaysRule(ruleGroupInfo, ruleGroupId)
    val rule = when (ruleOrError) {
      is Tried.Success -> {
        ruleOrError.value
      }
      is Tried.Failure -> {
        return return DeleteReturn.NoSuchRule(ruleOrError.error)
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
      }
    }

    val now = state.getMonotonicNow()
    if (rule.isEnabled(now)) {
<<<<<<< HEAD
      return DeleteReturn.RuleEnabled()
    }

    try {
      database.deleteAlwaysRule(ruleGroupLocation, ruleGroupId, ruleId)
    } catch (exception: Throwable) {
      return DeleteReturn.InternalError(exception)
    }
    
    state.deleteAlwaysRuleOrNoop(ruleGroupLocation, ruleId)
=======
      return DeleteReturn.PermissionDenied()
    }

    try {
      database.deleteAlwaysRuleOrThrow(ruleGroupInfo, ruleGroupId, ruleId)
    } catch (exception: Throwable) {
      return DeleteReturn.InternalError(exception)
    }

    state.removeAlwaysRuleOrNoop(ruleGroupInfo, ruleGroupId, ruleId)
>>>>>>> 8b1f320411c2b2cff804356a322506bd0237525a
    return DeleteReturn.Success(rule)
  }
}