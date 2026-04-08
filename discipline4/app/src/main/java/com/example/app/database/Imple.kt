package com.example.app.database

import com.example.app.database.*
import com.example.app.*

fun Buffer.writeInt(int: Int) {
  write(int.toString())
}

fun Buffer.writeLong(long: Long) {
  write(long.toString())
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

import android.database.Cursor

// ============ Base Read Functions ============

fun Cursor.isInteger(index: Int): Boolean {
  return getType(index) == Cursor.FIELD_TYPE_INTEGER
}

fun Cursor.readInt(index: Int): Int {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading an Int")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading an Int")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getInt(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading an Int")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading an Int")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading an Int")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading an Int")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading an Int")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readIntOrNull(index: Int): Int? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading an Int?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getInt(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading an Int?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading an Int?")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading an Int?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading an Int?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading an Int?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readLong(index: Int): Long {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Long")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a Long")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getLong(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Long")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Long")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Long")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Long")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Long")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readLongOrNull(index: Int): Long? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Long?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getLong(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Long?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Long?")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Long?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Long?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Long?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readFloat(index: Int): Float {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Float")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a Float")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a Float")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      try {
        return getFloat(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Float")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Float")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Float")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Float")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readFloatOrNull(index: Int): Float? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Float?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a Float?")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      try {
        return getFloat(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Float?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Float?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Float?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Float?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readDouble(index: Int): Double {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Double")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a Double")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a Double")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      try {
        return getDouble(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Double")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Double")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Double")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Double")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readDoubleOrNull(index: Int): Double? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Double?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a Double?")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      try {
        return getDouble(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Double?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Double?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Double?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Double?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readString(index: Int): String {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a String")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a String")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a String")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a String")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      try {
        return getString(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a String")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a String")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a String")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readStringOrNull(index: Int): String? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a String?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a String?")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a String?")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      try {
        return getString(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a String?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a String?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a String?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readBlob(index: Int): ByteArray {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Blob")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a Blob")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a Blob")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Blob")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Blob")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      try {
        return getBlob(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Blob")
          .addErrorAttachment("Exception", exception)
      }
    }
    else -> {
      throw TextualError
        .create("Reading a Blob")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readBlobOrNull(index: Int): ByteArray? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Blob?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      throw TextualError
        .create("Reading a Blob?")
        .addMessage("SQLite value was INTEGER")
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Blob?")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Blob?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      try {
        return getBlob(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Blob?")
          .addErrorAttachment("Exception", exception)
      }
    }
    else -> {
      throw TextualError
        .create("Reading a Blob?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readShort(index: Int): Short {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Short")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a Short")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getShort(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Short")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Short")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Short")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Short")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Short")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readShortOrNull(index: Int): Short? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Short?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getShort(index)
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Short?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Short?")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Short?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Short?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Short?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readBoolean(index: Int): Boolean {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Boolean")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      throw TextualError
        .create("Reading a Boolean")
        .addMessage("SQLite value was NULL")
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getInt(index) == 1
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Boolean")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Boolean")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Boolean")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Boolean")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Boolean")
        .addMessage("Unknown SQLite value type")
    }
  }
}

fun Cursor.readBooleanOrNull(index: Int): Boolean? {
  val fieldType = try {
    getType(index)
  } catch (exception: Throwable) {
    throw TextualError
      .create("Getting field type")
      .addErrorAttachment("Exception", exception)
      .changeContext("Reading a Boolean?")
  }

  when (fieldType) {
    Cursor.FIELD_TYPE_NULL -> {
      return null
    }
    Cursor.FIELD_TYPE_INTEGER -> {
      try {
        return getInt(index) == 1
      } catch (exception: Throwable) {
        throw TextualError
          .create("Reading a Boolean?")
          .addErrorAttachment("Exception", exception)
      }
    }
    Cursor.FIELD_TYPE_FLOAT -> {
      throw TextualError
        .create("Reading a Boolean?")
        .addMessage("SQLite value was FLOAT")
    }
    Cursor.FIELD_TYPE_STRING -> {
      throw TextualError
        .create("Reading a Boolean?")
        .addMessage("SQLite value was STRING")
    }
    Cursor.FIELD_TYPE_BLOB -> {
      throw TextualError
        .create("Reading a Boolean?")
        .addMessage("SQLite value was BLOB")
    }
    else -> {
      throw TextualError
        .create("Reading a Boolean?")
        .addMessage("Unknown SQLite value type")
    }
  }
}

// ============ Indexes Data Classes ============

data class TimeRangeIndexes(
  val from: Int,
  val till: Int,
)

data class CountdownIndexes(
  val from: Int,
  val duration: Int,
)

data class CountdownConditionalIndexes(
  val duratioin: Int,
  val countdown: CountdownIndexes,
)

data class CountdownAfterPleaConditionalIndexes(
  val duration: Int,
  val countdown: CountdownIndexes,
)

data class RuleEnablerIndexes(
  val variant: Int,
  val countdownConditional: CountdownConditionalIndexes,
  val countdownAfterPleaConditional: CountdownAfterPleaConditionalIndexes,
)

data class AlwaysRuleIndexes(
  val enabler: RuleEnablerIndexes,
)

data class TimeRangeRuleIndexes(
  val enabler: RuleEnablerIndexes,
  val condition: TimeRangeIndexes,
)

data class TimeAllowanceRuleIndexes(
  val enabler: RuleEnablerIndexes,
  val allowance: Int,
)

// ============ Composite Read Functions ============

fun Cursor.readTime(index: Int): Time {
  try {
    return Time.fromTimestampOrThrow(readInt(index))
  } catch (error: TextualError) {
    throw error.changeContext("Reading a Time")
  }
}

enum class OptionVariant {
  None,
  Some;

  companion object {
    fun fromNumberOrThrow(number: Int): OptionVariant {
      return when (number) {
        0 -> None
        1 -> Some
        else -> throw TextualError.create("Unknown OptionVariant number: $number")
      }
    }
  }
}

fun Cursor.readOptionalVariant(index: Int): OptionVariant {
  return OptionVariant.fromNumberOrThrow(readInt(index))
}

fun <Value> Cursor.readOptional(index: Int, readSome: (index: Int) -> Value): Value? {
  val variantIndex = index
  return when (readOptionalVariant(variantIndex)) {
    OptionVariant.None -> null
    OptionVariant.Some -> readSome(variantIndex + 1)
  }
}

fun Cursor.readTimeRange(indexes: TimeRangeIndexes): TimeRange {
  try {
    return TimeRange.fromTimes(
      readTime(indexes.from),
      readTime(indexes.till),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeRange")
  }
}

fun Cursor.readDuration(index: Int): Duration {
  try {
    return Duration.fromMillisecondsOrThrow(readLong(index))
  } catch (error: TextualError) {
    throw error.changeContext("Reading a Duration")
  }
}

fun Cursor.readInstant(index: Int): Instant {
  try {
    return Instant.fromElapsedTime(readDuration(index))
  } catch (error: TextualError) {
    throw error.changeContext("Reading an Instant")
  }
}

fun Cursor.readCountdown(indexes: CountdownIndexes): Countdown {
  try {
    return Countdown.construct(
      readInstant(indexes.from),
      readDuration(indexes.duration),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a Countdown")
  }
}

fun Cursor.readCountdownConditional(indexes: CountdownConditionalIndexes): CountdownConditional {
  try {
    return CountdownConditional.construct(
      readDuration(indexes.duratioin),
      readOptional(indexes.countdown) { startIndex ->
        readCountdown(CountdownIndexes(startIndex, startIndex + 1))
      }
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a CountdownConditional")
  }
}

fun Cursor.readCountdownAfterPleaConditional(indexes: CountdownAfterPleaConditionalIndexes): CountdownAfterPleaConditional {
  try {
    return CountdownAfterPleaConditional.construct(
      readDuration(indexes.duration),
      readOptional(indexes.countdownIndexes) { startIndex ->
        readCountdown(CountdownIndexes(startIndex, startIndex + 1))
      }
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a CountdownAfterPleaConditional")
  }
}

fun Cursor.readRuleEnablerVariant(index: Int): RuleEnabler.Variant {
  try {
    return RuleEnabler.Variant.fromNumberOrThrow(readInt(index))
  } catch (error: TextualError) {
    throw error.changeContext("Reading a RuleEnablerVariant")
  }
}

fun Cursor.readRuleEnabler(indexes: RuleEnablerIndexes): RuleEnabler {
  try {
    return when (readRuleEnablerVariant(indexes.variant)) {
      RuleEnabler.Variant.Countdown -> {
        RuleEnabler.Countdown(readCountdownConditional(indexes.countdownConditionalIndexes))
      }
      RuleEnabler.Variant.CountdownAfterPlea -> {
        RuleEnabler.CountdownAfterPlea(readCountdownAfterPleaConditional(indexes.countdownAfterPleaConditionalIndexes))
      }
    }
  } catch (error: TextualError) {
    throw error.changeContext("Reading a RuleEnabler")
  }
}

fun Cursor.readAlwaysRule(indexes: AlwaysRuleIndexes): AlwaysRule {
  try {
    return AlwaysRule.construct(readRuleEnabler(indexes.enablerIndexes))
  } catch (error: TextualError) {
    throw error.changeContext("Reading an AlwaysRule")
  }
}

fun Cursor.readTimeRangeRule(indexes: TimeRangeRuleIndexes): TimeRangeRule {
  try {
    return TimeRangeRule.construct(
      readRuleEnabler(indexes.enablerIndexes),
      readTimeRange(indexes.rangeIndexes),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeRangeRule")
  }
}

fun Cursor.readTimeAllowanceRule(indexes: TimeAllowanceRuleIndexes): TimeAllowanceRule {
  try {
    return TimeAllowanceRule.construct(
      readRuleEnabler(indexes.enablerIndexes),
      readDuration(indexes.allowance),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeAllowanceRule")
  }
}