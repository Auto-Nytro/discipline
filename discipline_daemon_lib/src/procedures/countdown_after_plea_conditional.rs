use crate::x::{CountdownAfterPleaConditional, Database, IsTextualError, MonotonicClock};
use crate::x::database::{CountdownAfterPleaConditionalDbAdapter, CountdownAfterPleaConditionalDbAdapterError};
use crate::x::procedures::CountdownAfterPleaConditionalLocation;

pub enum ReactivateReturn {
  AlreadyActive,
  Database(CountdownAfterPleaConditionalDbAdapterError),
  Success,
}

pub fn reactivate(
  database: &Database,
  adapter: &CountdownAfterPleaConditionalDbAdapter,
  location: &CountdownAfterPleaConditionalLocation,
  conditional: &mut CountdownAfterPleaConditional,
  clock: &MonotonicClock,
  textual_error: &mut impl IsTextualError,
) -> ReactivateReturn {
  let now = clock.now();
  if conditional.is_active(now) {
    return ReactivateReturn::AlreadyActive; 
  }

  if let Err(error) = adapter.activate(
    database, 
    location,
    textual_error,
  ) {
    return ReactivateReturn::Database(error);
  }

  conditional.activate();
  ReactivateReturn::Success
}

pub enum ReDeactivateReturn {
  AlreadyDeactivated,
  Database(CountdownAfterPleaConditionalDbAdapterError),
  Success,
}

pub fn re_deactivate(
  database: &Database,
  adapter: &CountdownAfterPleaConditionalDbAdapter,
  location: &CountdownAfterPleaConditionalLocation,
  conditional: &mut CountdownAfterPleaConditional,
  clock: &MonotonicClock,
  textual_error: &mut impl IsTextualError,
) -> ReDeactivateReturn {
  let now = clock.now();
  if conditional.is_deactivated(now) {
    return ReDeactivateReturn::AlreadyDeactivated;
  }

  let re_deactivate_state = conditional.create_deactivating_state(now);

  if let Err(error) = adapter.redactivate(
    database, 
    location, 
    &re_deactivate_state, 
    textual_error,
  ) {
    return ReDeactivateReturn::Database(error);
  }

  conditional.deactivate(now);
  ReDeactivateReturn::Success
}
