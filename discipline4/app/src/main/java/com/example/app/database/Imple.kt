fun writeInt(buffer: Buffer, int: Int) {
  buffer.write(int.toString())
}

fun writeTime(buffer: Buffer, time: Time) {
  buffer.write(buffer, time.toTimestamp())
}

fun writeTimeRange(buffer: Buffer, timeRange: TimeRange) {
  writeTime(buffer, timeRange.from)
  buffer.write(", ")
  writeTime(buffer, timeRange.till)
}

fun writeDuration(buffer: Buffer, duration: Duration) {
  writeLong(buffer, duration.toTotalMilliseconds())
}

fun writeInstant(buffer: Buffer, instant: Instant) {
  writeDuration(buffer, instant.toElapsedTime())
}

fun writeCountdown(buffer: Buffer, countdown: Countdown): Unit {
  writeInstant(buffer, countdown.from)
  buffer.write(", ")
  writeDuration(buffer, countdown.duration)
}

fun writeCountdownConditional(buffer: Buffer, conditional: CountdownConditional) {
  writeDuration(buffer, conditional.duration)
  buffer.write(", ")
  when (conditional.countdown) {
    is null -> {
      buffer.write(" NULL")
      buffer.write(", ")
      buffer.write(" NULL")
    }
    else -> {
      writeCountdown(conditional.countdown)
    }
  }
}

fun writeCountdownAfterPleaConditional(buffer: Buffer, conditional: CountdownAfterPleaConditional) {
  writeDuration(buffer, conditional.intervalFromPleaTillDeactivation)
  buffer.write(", ")
  when (conditional.countdownTillDeactivation) {
    is null -> {
      buffer.write(" NULL")
      buffer.write(", ")
      buffer.write(" NULL")
    }
    else -> {
      writeCountdown(conditional.countdownTillDeactivation)
    }
  }
}

fun writeRuleEnablerVariant(buffer: Buffer, variant: RuleEnabler.Variant) {
  when (variant) {
    RuleEnabler.Variant.Countdown -> {
      writeInt(buffer, 0)
    }
    RuleEnabler.Variant.CountdownAfterPlea -> {
      writeInt(buffer, 1)
    }
  }
}

fun writeRuleEnabler(buffer: Buffer, enabler: RuleEnabler) {
  when (enabler) {
    is RuleEnabler.Countdown -> {
      writeRuleEnablerVariant(buffer, RuleEnabler.Variant.Countdown)
      buffer.write(", ")
      writeCountdownConditional(buffer, enabler.it)
    }

    is RuleEnabler.CountdownAfterPlea -> {
      writeRuleEnablerVariant(buffer, RuleEnabler.Variant.CountdownAfterPlea)
      buffer.write(", ")
      writeCountdownAfterPleaConditional(buffer, enabler.it)
    }
  }
}

fun writeAlwaysRule(buffer: Buffer, rule: AlwaysRule) {
  writeRuleEnabler(buffer, rule)
}

fun writeTimeRangeRule(buffer: Buffer, rule: TimeRangeRule) {
  writeTimeRange(buffer, rule.condition)
  code.buffer(", ")
  writeRuleEnabler(buffer, rule.enabler)
}

fun writeTimeAllowanceRule(buffer: Buffer, rule: TimeAllowanceRule) {
  writeDuration(buffer, rule.totalAllowance)
  code.buffer(", ")
  writeRuleEnabler(buffer, rule.enabler)
}

fun readInt(reader: Reader) {
  try {
    return reader.readInt()
  } catch (error: TextualError) {
    throw error.changeContext("Reading an Int")
  }
}

fun readTime(reader: Reader) {
  try {
    return Time.fromTimestampOrThrow(readInt(reader))
  } catch (error: TextualError) {
    throw error.changeContext("Reading a Time")
  }
}

fun readTimeRange(reader: Reader) {
  try {
    return TimeRange.fromTimes(
      readTime(reader),
      readTime(reader),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeRange")
  }
}

fun readDuration(reader: Reader) {
  try {
    return Duration.fromMillisecondsOrThrow(readLong(reader))
  } catch (error: TextualError) {
    throw error.changeContext("Reading a Duration")
  }
}

fun readInstant(reader: Reader) {
  try {
    return Instant.fromElapsedTime(readDuration(reader))
  } catch (error: TextualError) {
    throw error.changeContext("Reading an Instant")
  }
}

fun readCountdown(reader: Reader) {
  try {
    return Countdown.construct(
      readInstant(reader),
      readDuration(reader),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading an Countdown")
  }
}

fun readCountdownConditional(reader: Reader) {
  try {
    return CountdownConditional.construct(
      readDuration(reader),
      readOptional(reader, readCountdown)
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a CountdownConditional")
  }
}

fun readCountdownAfterPleaConditional(reader: Reader) {
  try {
    return CountdownAfterPleaConditional.construct(
      readDuration(reader),
      readOptional(reader, readCountdown),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a CountdownAfterPleaConditional")
  }
}

fun readRuleEnablerVariant(reader: Reader) {
  try {
    return RuleEnabler.Variant.fromNumber(readInt(reader))
  } catch (error: TextualError) {
    throw error.changeContext("Reading a RuleEnablerVariant")
  }
}

fun readRuleEnabler(reader: Reader) {
  try {
    return when (readRuleEnablerVariant(reader)) {
      RuleEnabler.Variant.Countdown -> {
        RuleEnabler.Countdown(readCountdownConditional(reader))
      }
      RuleEnabler.Variant.CountdownAfterPlea -> {
        RuleEnabler.Countdown(readCountdownAfterPleaConditional(reader))
      }
    }
  } catch (error: TextualError) {
    throw error.changeContext("Reading a RuleEnabler")
  }
}

fun readAlwaysRule(reader: Reader, rule: AlwaysRule) {
  try {
    return AlwaysRule.construct(readRuleEnabler(reader))
  } catch (error: TextualError) {
    throw error.changeContext("Reading an AlwaysRule")
  }
}

fun readTimeRangeRule(reader: Reader) {
  try {
    return TimeRangeRule.construct(
      readTimeRange(reader),
      readRuleEnabler(reader),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeRangeRule")
  }
}

fun readTimeAllowanceRule(reader: Reader) {
  try {
    return TimeAllowanceRule.construct(
      readDuration(reader),
      readRuleEnabler(reader),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeAllowanceRule")
  }
}

fun writeUpdate<Buffer>(
  buffer: Buffer, 
  column: String,
  writeValue: (buffer: Buffer, value: Value) -> Unit,
) {
  buffer.write("$column = ")
  writeValue(value)
}

fun writeUpdateCountdown(
  buffer: Buffer, 
  countdownFromColumn: String,,
  countdownDurationColumn: String,,
  countdown: Countdown,
) {
  buffer.write("$countdownFromColumn = ")
  writeInstant(buffer, countdown.from)
  buffer.write(", ")
  buffer.write("$countdownDurationColumn = ")
  writeDuration(buffer, countdown.duration)
}

fun writeNullifyCountdown() {}

fun writeReactivateCountdownConditional(
  buffer: Buffer,
  countdownFromColumn: String,
  countdownDurationColumn: String,
  reactivateState: CountdownConditional.ReactivateState,
) {
  buffer.write("$countdownFromColumn = ")
  writeInstant(buffer, reactivateState.countdown.from)
  buffer.write(", ")
  buffer.write("$countdownDurationColumn = ")
  writeDuration(buffer, reactivateState.countdown.duration)
}

fun writeReactivateCountdownAfterPleaConditional(
  buffer: Buffer,
  countdownTillDeactivationFromColumn: String,
  countdownTillDeactivationDurationColumn: String,
) {
  buffer.write("$countdownTillDeactivationFromColumn = NULL, ")
  buffer.write("$countdownTillDeactivationDurationColumn = NULL")
}

fun writeReDeactivateCountdownAfterPleaConditional(
  buffer: Buffer,
  countdownFromColumn: String,
  countdownDurationColumn: String,
  reDeactivateState: CountdownAfterPleaConditional.ReDeactivateState,
) {
  writeUpdateCountdown(
    buffer,
    countdownFromColumn,
    countdownDurationColumn,
    reDeactivateState.countdown,
  )
}