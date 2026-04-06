package com.example.app.procedures.countdownconditional

import com.example.app.Database
import com.example.app.MonotonicClock
import com.example.app.CountdownConditional
import com.example.app.procedures.countdownconditional.ReactivateReturn

class CountdownConditionalLocation() {
  fun reactivateOrThrow(
    database: Database,
    location: CountdownConditionalLocation,
    reactivateState: CountdownConditional.ReactivateState,
  ) {

  }
}

class CountdownConditionalDbAdapter {}

sealed class ReactivateReturn {
  class Database(val error: Throwable) : ReactivateReturn() {}
  class Success() : ReactivateReturn() {}
}

fun reactivate(
  database: Database,
  adapter: CountdownConditionalDbAdapter,
  location: CountdownConditionalLocation,
  conditional: CountdownConditional,
  clock: MonotonicClock,
): ReactivateReturn {
  val now = clock.getNow()
  val reactivateState = conditional.createReactivateState(now)

  try {
    adapter.reactivateOrThrow(database, location, reactivateState)
  } catch (exception: Throwable) {
    return ReactivateReturn.Database(exception)
  }

  conditional.reactivateFromState(reactivateState)
  return ReactivateReturn.Success()
}
