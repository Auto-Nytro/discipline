package com.example.app

import com.example.app.database.*

object AlwaysRuleProcedures {
  sealed class CreateReturn {
    class PermissionError(val value: GetCreateRulePermissionError) : CreateReturn() {}
    class GetGroupInfo(val value: GetAlwaysRuleGroupInfoError) : CreateReturn() {}
    class InternalError(val error: Throwable) : CreateReturn() {}
    class Success(val id: AlwaysRuleId, val rule: AlwaysRule) : CreateReturn() {}
  }

  fun create(
    state: State,
    database: Database,
    ruleGroupId: AlwaysRuleGroupId,
    ruleEnablerCreator: RuleEnabler.Creator,
  ): CreateReturn {
    val ruleGroupLocation = state.getAlwaysRuleGroupLocation(ruleGroupId).let {
      when (it) {
        is Tried.Failure -> {
          return CreateReturn.GetGroupInfo(it.error)
        }
        is Tried.Success -> {
          it.value
        }
      }
    }

    val rule = AlwaysRule.create(
      enabler = ruleEnablerCreator.create()
    )

    val ruleId = try {
      database.createAlwaysRule(ruleGroupLocation, ruleGroupId, rule)
    } catch (exception: Throwable) {
      return CreateReturn.InternalError(exception)
    }

    state.createAlwaysRuleOrNoop(ruleGroupLocation, ruleId, rule)
    return CreateReturn.Success(ruleId, rule)
  }

  sealed class DeleteReturn {
    class NoSuchRule() : DeleteReturn() {}
    class PermissionDenied() : DeleteReturn() {}
    class InternalError(val error: Throwable) : DeleteReturn() {}
    class Success(val rule: AlwaysRule) : DeleteReturn() {}
  }

  fun delete(
    state: State,
    database: Database,
    ruleGroupId: AlwaysRuleGroupId,
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
      }
    }

    val now = state.getMonotonicNow()
    if (rule.isEnabled(now)) {
      return DeleteReturn.PermissionDenied()
    }

    try {
      database.deleteAlwaysRuleOrThrow(ruleGroupInfo, ruleGroupId, ruleId)
    } catch (exception: Throwable) {
      return DeleteReturn.InternalError(exception)
    }

    state.removeAlwaysRuleOrNoop(ruleGroupInfo, ruleGroupId, ruleId)
    return DeleteReturn.Success(rule)
  }
}