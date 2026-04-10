

fun Buffer.updateCountdown(
  fromColumn: String,
  durationColumn: String,
  countdown: Countdown,
) {
  write("$fromColumn = ")
  writeInstant(countdown.from)
  write(", ")
  write("$durationColumn = ")
  writeDuration(countdown.duration)
}

fun Buffer.updateCountdownNull(
  fromColumn: String,
  durationColumn: String,
) {
  write("$fromColumn = ")
  write("NULL, ")
  write("$durationColumn = ")
  write("NULL")
}

fun Buffer.reactivateCountdownConditional(
  countdownFromColumn: String,
  countdownDurationColumn: String,
  reactivateState: CountdownConditional.ReactivateState,
) {
  updateCountdown(
    countdownFromColumn,
    countdownDurationColumn,
    reactivateState.countdown,
  )
}

fun Buffer.reactivateCountdownAfterPleaConditional(
  countdownTillDeactivationFromColumn: String,
  countdownTillDeactivationDurationColumn: String,
) {
  updateCountdownNull(
    countdownTillDeactivationFromColumn,
    countdownTillDeactivationDurationColumn,
  )
}

fun Buffer.reDeactivateCountdownAfterPleaConditional(
  countdownFromColumn: String,
  countdownDurationColumn: String,
  reDeactivateState: CountdownAfterPleaConditional.ReDeactivateState,
) {
  updateCountdown(
    countdownFromColumn,
    countdownDurationColumn,
    reDeactivateState.countdown,
  )
}

fun Buffer.writeInt(int: Int) {
  write(int.toString())
}

fun Buffer.writeLong(long: Long) {
  write(long.toString())
}

fun Buffer.writeString(string: String) {
  // TODO:
  // write(long.toString())
}

fun Buffer.writeUuidV4(uuidV4: UuidV4) {
  writeString(uuidV4.asString())
}
fun Buffer.writeRuleLocationId(id: RuleLocationsTable.Id) {
  // writeString(uuidV4.asString())
}
fun Buffer.writeAlwaysRuleId(id: AlwaysRules.Id) {
  // writeString(uuidV4.asString())
}
fun Buffer.writeTimeRangeRuleId(id: TimeRangeRules.Id) {
  // writeString(uuidV4.asString())
}
fun Buffer.writeTimeAllowanceRuleId(id: TimeAllowanceRules.Id) {
  // writeString(uuidV4.asString())
}

fun Buffer.writeTime(time: Time) {
  writeInt(time.toTimestamp())
}

fun Buffer.writeTimeRange(timeRange: TimeRange) {
  writeTime(timeRange.getFrom())
  write(", ")
  writeTime(timeRange.getTill())
}

fun Buffer.writeDuration(duration: Duration) {
  writeLong(duration.toTotalMilliseconds())
}

fun Buffer.writeInstant(instant: Instant) {
  writeDuration(instant.toElapsedTime())
}

fun Buffer.writeCountdown(countdown: Countdown): Unit {
  writeInstant(countdown.from)
  write(", ")
  writeDuration(countdown.duration)
}

fun Buffer.writeCountdownConditional(conditional: CountdownConditional) {
  writeDuration(conditional.duration)
  write(", ")
  conditional.countdown?.let { 
    writeCountdown(it)
  } ?: run {
    write(" NULL")
    write(", ")
    write(" NULL")
  }
}

fun Buffer.writeCountdownAfterPleaConditional(conditional: CountdownAfterPleaConditional) {
  writeDuration(conditional.intervalFromPleaTillDeactivation)
  write(", ")
  conditional.countdownTillDeactivation?.let { 
    writeCountdown(it)
  } ?: {
    write(" NULL")
    write(", ")
    write(" NULL")
  }
}

fun Buffer.writeRuleEnablerVariant(variant: RuleEnabler.Variant) {
  when (variant) {
    RuleEnabler.Variant.Countdown -> {
      writeInt(0)
    }
    RuleEnabler.Variant.CountdownAfterPlea -> {
      writeInt(1)
    }
  }
}

fun Buffer.writeRuleEnabler(enabler: RuleEnabler) {
  when (enabler) {
    is RuleEnabler.Countdown -> {
      writeRuleEnablerVariant(RuleEnabler.Variant.Countdown)
      write(", ")
      writeCountdownConditional(enabler.it)
    }

    is RuleEnabler.CountdownAfterPlea -> {
      writeRuleEnablerVariant(RuleEnabler.Variant.CountdownAfterPlea)
      write(", ")
      writeCountdownAfterPleaConditional(enabler.it)
    }
  }
}

fun Buffer.writeAlwaysRule(rule: AlwaysRule) {
  writeRuleEnabler(rule.enabler)
}

fun Buffer.writeTimeRangeRule(rule: TimeRangeRule) {
  writeTimeRange(rule.condition)
  write(", ")
  writeRuleEnabler(rule.enabler)
}

fun Buffer.writeTimeAllowanceRule(rule: TimeAllowanceRule) {
  writeDuration(rule.allowance)
  write(", ")
  writeRuleEnabler(rule.enabler)
}

fun <Value> Buffer.writeUpdateScalar(
  column: String,
  value: Value,
  writeValue: (value: Value) -> Unit,
) {
  write("$column = ")
  writeValue(value)
}

fun Buffer.writeNameEqualValue(name: String, value: () -> Unit) {
  write("$name = ")
  value()
}
