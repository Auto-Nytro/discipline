package com.example.app.database

import com.example.app.*

class RuleLocationsTable {
  class Id() {}
}

class AlwaysRulesTable {
  companion object {
    const val TABLE = "AlwaysRules"

    const val ID = "id"
    const val ENABLER_TYPE = "enabler_type"
    const val ENABLER_DATA_1 = "enabler_data_1"
    const val ENABLER_DATA_2 = "enabler_data_2"
    const val ENABLER_DATA_3 = "enabler_data_3"
    const val ENABLER_DATA_4 = "enabler_data_4"
    const val LOCATION_ID = "location_id"

    // const val ENABLER_COUNTDOWN_DURATION = ENABLER_DATA_1
    // const val ENABLER_COUNTDOWN_COUNTDOWN_FROM = ENABLER_DATA_2
    // const val ENABLER_COUNTDOWN_COUNTDOWN_TILL = ENABLER_DATA_3

    // const val ENABLER_COUNTDOWN_AFTER_PLEA_DURATION = ENABLER_DATA_1
    // const val ENABLER_COUNTDOWN_AFTER_PLEA_COUNTDOWN_FROM = ENABLER_DATA_2
    // const val ENABLER_COUNTDOWN_AFTER_PLEA_COUNTDOWN_TILL = ENABLER_DATA_3


    const val ID_INDEX = 0
    const val ENABLER_TYPE_INDEX = 1
    // CountdownConditional.duration: INTEGER NOT NULL
    // CountdownAfterPleaConditional.duration: INTEGER NOT NULL
    const val ENABLER_DATA_1_INDEX = 2
    // CountdownConditional.option<Countdown>.variant: INTEGER NOT NULL
    // CountdownAfterPleaConditional.option<Countdown>.variant: INTEGER NOT NULL
    const val ENABLER_DATA_2_INDEX = 3
    // CountdownConditional.Option<Countdown>.Some.Instant(from): INTEGER
    // CountdownAfterPleaConditional.Option<Countdown>.Some.Instant(from): INTEGER
    const val ENABLER_DATA_3_INDEX = 4
    // CountdownConditional.Option<Countdown>.Some.Countdown.Duration(duration): INTEGER
    // CountdownAfterPleaConditional.Option<Countdown>.Some.Countdown.Duration(duration): INTEGER
    const val ENABLER_DATA_4_INDEX = 5
    const val LOCATION_ID_INDEX = 6

    const val ENABLER_COUNTDOWN_DURATION_INDEX = ENABLER_DATA_1_INDEX
    const val ENABLER_COUNTDOWN_COUNTDOWN_FROM_INDEX = ENABLER_DATA_2_INDEX
    const val ENABLER_COUNTDOWN_COUNTDOWN_TILL_INDEX = ENABLER_DATA_3_INDEX

    const val ENABLER_COUNTDOWN_AFTER_PLEA_DURATION_INDEX = ENABLER_DATA_1_INDEX
    const val ENABLER_COUNTDOWN_AFTER_PLEA_COUNTDOWN_FROM_INDEX = ENABLER_DATA_2_INDEX
    const val ENABLER_COUNTDOWN_AFTER_PLEA_COUNTDOWN_TILL_INDEX = ENABLER_DATA_3_INDEX

    val ruleIndexes = AlwaysRuleIndexes(
      enabler = RuleEnablerIndexes(
        variant = ENABLER_TYPE_INDEX, 
        countdownConditional = CountdownConditionalIndexes(
          duratioin = ENABLER_DATA_1_INDEX, 
          countdown = OptionIndexes(
            ENABLER_DATA_2_INDEX,
            CountdownIndexes(
              from = ENABLER_DATA_3_INDEX,
              duration = ENABLER_DATA_4_INDEX,
            ),
          ),
        ), 
        countdownAfterPleaConditional = CountdownAfterPleaConditionalIndexes(
          duration = ENABLER_DATA_1_INDEX, 
          countdown = OptionIndexes(
            ENABLER_DATA_2_INDEX,
            CountdownIndexes(
              from = ENABLER_DATA_3_INDEX,
              duration = ENABLER_DATA_4_INDEX,
            ),
          ),
        ),
      )
    )
  }

  fun writeCreateTable(
    code: Buffer,
  ) {
    code.write("""
      CREATE TABLE IF NOT EXISTS $TABLE (
        $ID TEXT PRIMARY KEY,
        $ENABLER_TYPE INTEGER NOT NULL,
        $ENABLER_DATA_1 INTEGER NOT NULL,
        $ENABLER_DATA_2 INTEGER NOT NULL,
        $ENABLER_DATA_3 INTEGER,
        $ENABLER_DATA_4 INTEGER,
        $LOCATION_ID TEXT NOT NULL
      ) STRICT, WITHOUT ROWID;
    """)
  }

  fun writeInsertRule(
    buffer: Buffer,
    ruleId: AlwaysRules.Id,
    rule: AlwaysRule,
    locationId: RuleLocationsTable.Id,
  ) {
    buffer.apply {
      write("INSERT INTO $TABLE VALUES (")
      writeAlwaysRuleId(ruleId)
      write(", ")
      writeAlwaysRule(rule)
      write(", ")
      writeRuleLocationId(locationId)
      write(");")
    }
  }

  fun writeDeleteRule(
    buffer: Buffer,
    ruleId: AlwaysRules.Id,
  ) {
    buffer.apply {
      write("DELETE FROM $TABLE WHERE $ID = ")
      writeAlwaysRuleId(ruleId)
      write(";")
    }
  }
}

class TimeRangeRulesTable {
  companion object {
    const val TABLE = "TimeRangeRules"

    const val ID = "id"
    const val CONDITION_FROM = "condition_from"
    const val CONDITION_TILL = "condition_till"
    const val ENABLER_TYPE = "enabler_variant"
    const val ENABLER_DATA_1 = "enabler_data_1"
    const val ENABLER_DATA_2 = "enabler_data_2"
    const val ENABLER_DATA_3 = "enabler_data_3"
    const val ENABLER_DATA_4 = "enabler_data_4"
    const val LOCATION_ID = "location_id"

    const val ENABLER_COUNTDOWN_DURATION = ENABLER_DATA_1
    const val ENABLER_COUNTDOWN_COUNTDOWN_FROM = ENABLER_DATA_2
    const val ENABLER_COUNTDOWN_COUNTDOWN_TILL = ENABLER_DATA_3

    const val ID_INDEX = 0
    const val CONDITION_FROM_INDEX = 1
    const val CONDITION_TILL_INDEX = 2
    const val ENABLER_TYPE_INDEX = 3
    const val ENABLER_DATA_1_INDEX = 4
    const val ENABLER_DATA_2_INDEX = 5
    const val ENABLER_DATA_3_INDEX = 6
    const val ENABLER_DATA_4_INDEX = 7
    const val LOCATION_ID_INDEX = 8

    val ruleIndexes = TimeRangeRuleIndexes(
      enabler = RuleEnablerIndexes(
        variant = ENABLER_TYPE_INDEX,
        countdownConditional = CountdownConditionalIndexes(
          duratioin = ENABLER_DATA_1_INDEX, 
          countdown = OptionIndexes(
            ENABLER_DATA_2_INDEX,
            CountdownIndexes(
              from = ENABLER_DATA_3_INDEX,
              duration = ENABLER_DATA_4_INDEX,
            ),
          ),
        ), 
        countdownAfterPleaConditional = CountdownAfterPleaConditionalIndexes(
          duration = ENABLER_DATA_1_INDEX, 
          countdown = OptionIndexes(
            ENABLER_DATA_2_INDEX,
            CountdownIndexes(
              from = ENABLER_DATA_3_INDEX,
              duration = ENABLER_DATA_4_INDEX,
            ),
          ),
        ),
      ), 
      condition = TimeRangeIndexes(
        from = CONDITION_FROM_INDEX, 
        till = CONDITION_TILL_INDEX,
      ),
    )
  }

  fun writeCreateTable(
    buffer: Buffer,
  ) {
    buffer.apply { 
      write("""
        CREATE TABLE IF NOT EXISTS $TABLE (
          $ID INTEGER PRIMARY KEY,
          $CONDITION_FROM INTEGER NOT NULL,
          $CONDITION_TILL INTEGER NOT NULL,
          $ENABLER_TYPE INTEGER NOT NULL,
          $ENABLER_DATA_1 INTEGER NOT NULL,
          $ENABLER_DATA_2 INTEGER NOT NULL,
          $ENABLER_DATA_3 INTEGER,
          $ENABLER_DATA_4 INTEGER,
          $LOCATION_ID INTEGER NOT NULL
        ) STRICT, WITHOUT ROWID;
      """)
    }
  }

  fun writeInsertRule(
    buffer: Buffer,
    ruleId: TimeRangeRules.Id,
    rule: TimeRangeRule,
    locationId: RuleLocationsTable.Id,
  ) {
    buffer.apply {
      write("INSERT INTO $TABLE VALUES (")
      writeTimeRangeRuleId(ruleId)
      writeTimeRangeRule(rule)
      writeRuleLocationId(locationId)
      write(");")
    }
  }

  fun writeDeleteRule(
    buffer: Buffer,
    ruleId: TimeRangeRules.Id,
  ) {
    buffer.apply {
      write("DELETE FROM $TABLE WHERE $ID = ")
      writeTimeRangeRuleId(ruleId)
      write(");")
    }
  }
}

class TimeAllowanceRulesTable {
  companion object {
    const val TABLE = "TimeAllowanceRules"

    const val ID = "id"
    const val ALLOWANCE = "allowance"
    const val ENABLER_TYPE = "enabler_tag"
    const val ENABLER_DATA_1 = "enabler_data_1"
    const val ENABLER_DATA_2 = "enabler_data_2"
    const val ENABLER_DATA_3 = "enabler_data_3"
    const val ENABLER_DATA_4 = "enabler_data_4"
    const val ENABLER_DATA_5 = "enabler_data_5"
    const val LOCATION_ID = "location_id"

    const val ID_INDEX = 0
    const val ALLOWANCE_INDEX = 1
    const val ENABLER_TYPE_INDEX = 2
    const val ENABLER_DATA_1_INDEX = 3
    const val ENABLER_DATA_2_INDEX = 4
    const val ENABLER_DATA_3_INDEX = 5
    const val ENABLER_DATA_4_INDEX = 6
    const val ENABLER_DATA_5_INDEX = 7
    const val LOCATION_ID_INDEX = 8

    val ruleIndexes = TimeAllowanceRuleIndexes(
      allowance = ALLOWANCE_INDEX,
      enabler = RuleEnablerIndexes(
        variant = ENABLER_TYPE_INDEX,
        countdownConditional = CountdownConditionalIndexes(
          duratioin = ENABLER_DATA_1_INDEX, 
          countdown = OptionIndexes(
            ENABLER_DATA_2_INDEX,
            CountdownIndexes(
              from = ENABLER_DATA_3_INDEX,
              duration = ENABLER_DATA_4_INDEX,
            ),
          ),
        ), 
        countdownAfterPleaConditional = CountdownAfterPleaConditionalIndexes(
          duration = ENABLER_DATA_1_INDEX, 
          countdown = OptionIndexes(
            ENABLER_DATA_2_INDEX,
            CountdownIndexes(
              from = ENABLER_DATA_3_INDEX,
              duration = ENABLER_DATA_4_INDEX,
            ),
          ),
        ),
      ), 
    )
  }

  fun writeCreateTable(buffer: Buffer) {
    buffer.write("""
      CREATE TABLE IF NOT EXISTS $TABLE (
        $ID INTEGER PRIMARY KEY,
        $ALLOWANCE INTEGER NOT NULL,
        $ENABLER_TYPE INTEGER NOT NULL,
        $ENABLER_DATA_1 INTEGER NOT NULL,
        $ENABLER_DATA_2 INTEGER NOT NULL,
        $ENABLER_DATA_3 INTEGER,
        $ENABLER_DATA_4 INTEGER,
        $LOCATION_ID INTEGER NOT NULL
      ) STRICT, WITHOUT ROWID;
    """)
  }

  fun writeInsertRule(
    buffer: Buffer,
    ruleId: TimeAllowanceRules.Id,
    rule: TimeAllowanceRule,
    locationId: RuleLocationsTable.Id,
  ) {
    buffer.apply {
      write("INSERT INTO $TABLE VALUES (")
      writeTimeAllowanceRuleId(ruleId)
      write(", ")
      writeTimeAllowanceRule(rule)
      write(", ")
      writeRuleLocationId(locationId)
      write(");")
    }
  }

  fun writeDeleteRule(
    buffer: Buffer,
    ruleId: TimeAllowanceRules.Id,
  ) {
    buffer.apply {
      write("DELETE FROM $TABLE WHERE $ID = ")
      writeTimeAllowanceRuleId(ruleId)
      write(";")
    }
  }
}

class CountdownConditionalDbAdapter {
  fun reactivateOrThrow(
    database: Database,
    location: CountdownConditionalLocation,
    reactivateState: CountdownConditional.ReactivateState,
  ) {
    when (location) {
      is CountdownConditionalLocation.MainUserProfileScreenRegulationAlwaysRuleEnabler -> {
        val buffer = Buffer()
        buffer.write("UPDATE ${AlwaysRulesTable.TABLE} SET ")
        buffer.reactivateCountdownConditional(
          countdownFromColumn,
          countdownDurationColumn, 
          reactivateState,
        )
      }
      is CountdownConditionalLocation.MainUserProfileScreenRegulationTimeRangeRuleEnabler -> {

      }
      is CountdownConditionalLocation.MainUserProfileScreenRegulationDailyTimeAllowanceRuleEnabler -> {

      }
      is CountdownConditionalLocation.MainUserProfileApplicationRegulationAlwaysRuleEnabler -> {

      }
      is CountdownConditionalLocation.MainUserProfileApplicationRegulationTimeRangeRuleEnabler -> {

      }
      is CountdownConditionalLocation.MainUserProfileApplicationRegulationDailyTimeAllowanceRuleEnabler -> {

      }
      is CountdownConditionalLocation.MainUserProfileVaultProtector -> {

      }
    }
  }
}


class CountdownAfterPleaConditionalDbAdapter {
  fun reactivateOrThrow(
    database: Database,
    location: CountdownAfterPleaConditionalLocation,
  ) {}

  fun reDeactivateOrThrow(
    database: Database,
    location: CountdownAfterPleaConditionalLocation,
    reDeactivateState: CountdownAfterPleaConditional.ReDeactivateState
  ) {}
}

class AlwaysRuleDbAdapter {
  fun createOrThrow(
    database: Database,
    location: AlwaysRuleLocation,
    ruleId: UuidV4,
    rule: AlwaysRule,
  ) {

  }

  fun deleteOrThrow(
    database: Database,
    location: AlwaysRuleLocation,
    ruleId: UuidV4,
  ) {

  }
}

class TimeRangeRuleDbAdapter {
  fun createOrThrow(
    database: Database,
    location: TimeRangeRuleLocation,
    ruleId: UuidV4,
    rule: TimeRangeRule,
  ) {

  }

  fun deleteOrThrow(
    database: Database,
    location: TimeRangeRuleLocation,
    ruleId: UuidV4,
  ) {

  }
}

class TimeAllowanceRuleDbAdapter {
  fun createOrThrow(
    database: Database,
    location: TimeAllowanceRuleLocation,
    ruleId: UuidV4,
    rule: TimeAllowanceRule,
  ) {

  }

  fun deleteOrThrow(
    database: Database,
    location: TimeAllowanceRuleLocation,
    ruleId: UuidV4,
  ) {

  }
}

class ApplicationRegulationDbAdapter {
  fun createOrThrow(
    database: Database,
    location: ApplicationRegulationLocation,
    applicationName: ApplicationName,
    regulation: ApplicationRegulation,
  ) {

  }

  fun deleteOrThrow(
    database: Database,
    location: ApplicationRegulationLocation,
    applicationName: ApplicationName,
  ) {

  }
}