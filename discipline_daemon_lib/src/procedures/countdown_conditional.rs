use crate::x::{CountdownConditional, Database, MonotonicClock, IsTextualError};
use crate::x::database::{CountdownConditionalDbAdapter, CountdownConditionalDbAdapterError};
use crate::x::procedures::CountdownConditionalLocation;

pub enum ReactivateReturn {
  Database(CountdownConditionalDbAdapterError),
  Success,
}

pub fn reactivate(
  database: &Database,
  adapter: &CountdownConditionalDbAdapter,
  location: &CountdownConditionalLocation,
  conditional: &mut CountdownConditional,
  clock: &MonotonicClock,
  textual_error: &mut impl IsTextualError,
) -> ReactivateReturn {
  let now = clock.now();
  let activate_state = conditional.create_activate_state(now);

  if let Err(error) = adapter.activate(
    database, 
    location, 
    &activate_state,
    textual_error,
  ) {
    return ReactivateReturn::Database(error);
  }

  conditional.activate_from_activate_state(activate_state);
  ReactivateReturn::Success
}