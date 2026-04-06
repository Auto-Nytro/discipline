use crate::x::{AlwaysRule, AlwaysRules, Duration, MonotonicClock, RuleEnabler, RulesStats, UuidV4, Database, IsTextualError};
use crate::x::procedures::{AlwaysRuleLocation};
use crate::x::database::always_rule_table;

pub enum RuleEnablerCreator {
  Countdown(Duration),
  CountdownAfterPlea(Duration),
}

impl RuleEnablerCreator {
  pub fn create(self) -> RuleEnabler {
    todo!()
  }
}

pub enum CreateReturn {
  TooManyRules,
  NoSuchUserProfile,
  DuplicateRuleId,
  InternalError,
  Success,
}

pub fn create(
  database: &Database,
  rule_location: &AlwaysRuleLocation,
  rules: &mut AlwaysRules,
  stats: &mut RulesStats,
  rule_id: Option<UuidV4>,
  rule_enabler: RuleEnablerCreator,
  textual_error: &mut impl IsTextualError,
) -> CreateReturn {
  if stats.reached_maximum_allowed_always_rules() {
    return CreateReturn::TooManyRules;
  }
  
  let client_created_rule_id = rule_id.is_some();
  let rule_id = rule_id.unwrap_or_else(UuidV4::generate);
  let rule = AlwaysRule::create(rule_enabler.create());

  if let Err(error) = always_rule_table::insert_rule(
    database, 
    rule_location, 
    &rule_id, 
    &rule, 
    textual_error,
  ) {
    return match error {
      always_rule_table::InsertError::DuplicateRuleId if client_created_rule_id => {
        CreateReturn::DuplicateRuleId
      }
      always_rule_table::InsertError::DuplicateRuleId => {
        CreateReturn::InternalError
      }
      always_rule_table::InsertError::Other => {
        CreateReturn::InternalError
      }
    };
  }

  stats.update_after_always_rule_created();
  rules.rules.insert(rule_id, rule);
  CreateReturn::Success
}

pub enum DeleteReturn {
  NoSuchUserProfile,
  NoSuchRule,
  PermissionDenied,
  InternalError,
  Success,
}

pub fn execute(
  database: &Database,
  rule_location: &AlwaysRuleLocation,
  rules: &mut AlwaysRules,
  stats: &mut RulesStats,
  rule_id: &UuidV4,
  clock: &MonotonicClock,
  textual_error: &mut impl IsTextualError,
) -> DeleteReturn {
  let Some(rule) = rules.rules.get(rule_id) else {
    return DeleteReturn::NoSuchRule;
  };

  let now = clock.now();
  if rule.is_enabled(now) {
    return DeleteReturn::PermissionDenied;
  }

  if let Err(error) = always_rule_table::delete_rule(
    database, 
    rule_location,
    rule_id, 
    textual_error,
  ) {
    return match error {
      always_rule_table::DeleteRule::NoSuchRule => {
        DeleteReturn::NoSuchRule
      }
      always_rule_table::DeleteRule::Other => {
        DeleteReturn::InternalError
      }
    }
  }

  stats.update_after_always_rule_deleted();
  rules.rules.remove(rule_id);
  DeleteReturn::Success
}

