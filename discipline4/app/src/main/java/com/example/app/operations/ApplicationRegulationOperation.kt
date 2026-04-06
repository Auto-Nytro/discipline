package com.example.app

import com.example.app.*

public sealed class ApplicationRegulationOperation {
  class Create(val app: AppName) : ApplicationRegulationOperation() {
    sealed class Return {
      class TooManyRegulations() : Return() {}
      class DuplicateRegulationId() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val app: AppName, val regulation: ApplicationRegulation) : Return() {}
    }

    fun execute(state: State, database: Database, location: Location): Return {
      val context = location.locate(state)

      if (context.stats.isFull()) {
        return Return.TooManyRegulations()
      }
      
      if (context.regulations.has(app)) {
        return Return.DuplicateRegulationId()
      }

      val regulation = ApplicationRegulation.createDefault()

      try {
        database.addApplicationRegulationOrThrow(app, regulation, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.regulations.add(app, regulation)
      context.stats.applicationRegulationsNumber += 1
      context.afterCreate()
      return Return.Success(app, regulation)
    }
  }

  class Delete(val app: AppName) : ApplicationRegulationOperation() {
    sealed class Return {
      class NoSuchApplicationRegulation() : Return() {}
      class PermissionDenied() : Return() {}
      class InternalError(val error: Throwable) : Return() {}
      class Success(val rule: ApplicationRegulation) : Return() {}
    }

    fun execute(state: State, database: Database, location: Location): Return {
      val context = location.locate(state)

      val regulation = context.regulations.get(app)
        ?: return Return.NoSuchApplicationRegulation()

      val now = context.clock.getNow()
      if (regulation.isEnabled(now)) {
        return Return.PermissionDenied()
      }

      try {
        database.deleteApplicationRegulationOrThrow(app, location)
      } catch (exception: Throwable) {
        return Return.InternalError(exception)
      }

      context.regulations.remove(app)
      context.stats.applicationRegulationsNumber -= 1
      context.afterDelete()
      return Return.Success(regulation)
    }
  }

  class Context(
    val regulations: ApplicationRegulations,
    val stats: ApplicationRegulationsStats,
    val clock: MonotonicClock,
  ) {
    fun afterCreate() {}
    fun afterDelete() {}
    fun afterEnable() {}
    fun afterDisable() {}
  }

  sealed class Location {
    abstract fun locate(state: State): Context

    class MainUserProfile : Location() {
      override fun locate(state: State): Context {
        return Context(
          regulations = state.mainUserProfile.applicationRegulations,
          stats = state.appRegulationsStats,
          clock = state.monotonicClock,
        )
      }
    }
  }
}
