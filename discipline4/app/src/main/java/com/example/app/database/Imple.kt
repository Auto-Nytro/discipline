package com.example.app.database

import com.example.app.database.*
import com.example.app.*

 // fun writeSql(slice: String) {}

@JvmInline
value class ScalarWriteDestination(val buffer: Buffer) {
  fun writeInt(value: Int) {}
  fun writeLong(value: Long) {}
  fun writeString(value: String) {}
  fun writeBoolean(value: Boolean) {}
}

class NamedWriteDestination() {
  fun writeNull(name: String) {}
  fun writeInt(name: String, value: Int) {}
  fun writeLong(name: String, value: Long) {}
  fun writeString(name: String, value: String) {}
  fun writeBoolean(name: String, value: Boolean) {}
  // fun write(name: String) {}
}

class OrderedWriteDestination(
  var buffer: Buffer,
  var comma: Boolean,
) {
  fun writeNull() {}
  fun writeInt(value: Int) {}
  fun writeLong(value: Long) {}
  fun writeString(value: String) {}
  fun writeBoolean(value: Boolean) {}
}

// ----------------------------------------------------------
fun Int.scalarWrite(destination: ScalarWriteDestination) {
  destination.writeInt(this)
}

fun Long.scalarWrite(destination: ScalarWriteDestination) {
  destination.writeLong(this)
}

fun String.scalarWrite(destination: ScalarWriteDestination) {
  destination.writeString(this)
}

fun Boolean.scalarWrite(destination: ScalarWriteDestination) {
  destination.writeBoolean(this)
}

fun UuidV4.scalarWrite(destination: ScalarWriteDestination) {
  toString().scalarWrite(destination)
}

fun Time.scalarWrite(destination: ScalarWriteDestination) {
  toTimestamp().scalarWrite(destination)
}

fun Duration.scalarWrite(destination: ScalarWriteDestination) {
  toTotalMilliseconds().scalarWrite(destination)
}

fun Instant.scalarWrite(destination: ScalarWriteDestination) {
  toElapsedTime().scalarWrite(destination)
}

fun RuleEnabler.Variant.scalarWrite(destination: ScalarWriteDestination) {
  toNumber().scalarWrite(destination)
}
// ----------------------------------------------------------------


// write named for insert
// write ordered for insert
// read indexed 

// ----------------------------------------------------------------
// class Buffer(val buffer: Buffer) {
//   // fun write(slice: String) {}
//   fun writeNull() {}
//   fun writeInt(value: Int) {}
//   fun writeLong(value: Long) {}
//   fun writeString(value: String) {}
//   fun writeBoolean(value: Boolean) {}
// }

fun Countdown.Companion.orderedWriteNull(destination: OrderedWriteDestination) {
  destination.writeNull()
  destination.writeNull()
}

// ----------------------------------------------------------------

fun <T> T?.optionalOrderedWrite(destination: OrderedWriteDestination, orderedWriteNull: T.() -> Unit) {

}

fun Int.orderedWrite(destination: OrderedWriteDestination) {
  destination.writeInt(this)
}

fun Long.orderedWrite(destination: OrderedWriteDestination) {
  destination.writeLong(this)
}

fun String.orderedWrite(destination: OrderedWriteDestination) {
  destination.writeString(this)
}

fun Boolean.orderedWrite(destination: OrderedWriteDestination) {
  destination.writeBoolean(this)
}

fun UuidV4.orderedWrite(destination: OrderedWriteDestination) {
  toString().orderedWrite(destination)
}

fun Time.orderedWrite(destination: OrderedWriteDestination) {
  toTimestamp().orderedWrite(destination)
}

fun Duration.orderedWrite(destination: OrderedWriteDestination) {
  toTotalMilliseconds().orderedWrite(destination)
}

fun Instant.orderedWrite(destination: OrderedWriteDestination) {
  toElapsedTime().orderedWrite(destination)
}

fun RuleEnabler.Variant.orderedWrite(destination: OrderedWriteDestination) {
  toNumber().orderedWrite(destination)
}

fun TimeRange.orderedWrite(destination: OrderedWriteDestination) {
  fromTimestamp.orderedWrite(destination)
  tillTimestamp.orderedWrite(destination)
}

fun Countdown.orderedWrite(destination: OrderedWriteDestination) {
  from.orderedWrite(destination)
  duration.orderedWrite(destination)
}

fun CountdownConditional.orderedWrite(destination: OrderedWriteDestination) {
  duration.orderedWrite(destination)
  countdown.optionalOrderedWrite(destination) { 
    Countdown.orderedWriteNull(destination) 
  }
}

fun CountdownAfterPleaConditional.orderedWrite(destination: OrderedWriteDestination) {
  intervalFromPleaTillDeactivation.orderedWrite(destination)
  countdownTillDeactivation.optionalOrderedWrite(destination) { 
    Countdown.orderedWriteNull(destination) 
  }
}

fun RuleEnabler.orderedWrite(destination: OrderedWriteDestination) {
  when (this) {
    is RuleEnabler.Countdown -> {
      RuleEnabler.Variant.Countdown.orderedWrite(destination)
      it.orderedWrite(destination)
    }
    is RuleEnabler.CountdownAfterPlea -> {
      RuleEnabler.Variant.CountdownAfterPlea.orderedWrite(destination)
      it.orderedWrite(destination)
    }
  }
}

fun AlwaysRule.orderdWrite(destination: OrderedWriteDestination) {
  enabler.orderedWrite(destination)
}

fun AlwaysRules.Id.orderdWrite(destination: OrderedWriteDestination) {
  id.orderedWrite(destination)
}

fun TimeRangeRule.orderedWrite(destination: OrderedWriteDestination) {
  enabler.orderedWrite(destination)
  condition.orderedWrite(destination)
}

fun TimeRangeRules.Id.orderedWrite(destination: OrderedWriteDestination) {
  id.orderedWrite(destination)
}

fun TimeAllowanceRule.orderedWrite(destination: OrderedWriteDestination) {
  enabler.orderedWrite(destination)
  allowance.orderedWrite(destination)
}

fun TimeAllowanceRules.Id.orderedWrite(destination: OrderedWriteDestination) {
  id.orderedWrite(destination)
}

// ----------------------------------------------------------------
fun Int.namedWrite(name: String, destination: NamedWriteDestination) {
  destination.writeInt(name, this)
}

fun Long.namedWrite(name: String, destination: NamedWriteDestination) {
  destination.writeLong(name, this)
}

fun String.namedWrite(name: String, destination: NamedWriteDestination) {
  destination.writeString(name, this)
}

fun Boolean.namedWrite(name: String, destination: NamedWriteDestination) {
  destination.writeBoolean(name, this)
}

fun UuidV4.namedWrite(name: String, destination: NamedWriteDestination) {
  toString().namedWrite(name: String, destination)
}

fun Time.namedWrite(name: String, destination: NamedWriteDestination) {
  toTimestamp().namedWrite(name: String, destination)
}

fun Duration.namedWrite(name: String, destination: NamedWriteDestination) {
  toTotalMilliseconds().namedWrite(name: String, destination)
}

fun Instant.namedWrite(name: String, destination: NamedWriteDestination) {
  toElapsedTime().namedWrite(name: String, destination)
}

fun RuleEnabler.Variant.namedWrite(name: String, destination: NamedWriteDestination) {
  toNumber().namedWrite(name: String, destination)
}

fun AlwaysRules.Id.namedWrite(name: String, destination: NamedWriteDestination) {
  id.namedWrite(name: String, destination)
}

fun TimeRangeRules.Id.namedWrite(name: String, destination: NamedWriteDestination) {
  id.namedWrite(name: String, destination)
}

fun TimeAllowanceRules.Id.namedWrite(name: String, destination: NamedWriteDestination) {
  id.namedWrite(name: String, destination)
}

data class OptionNames<SomeNames>(
  val tag: String,
  val some: SomeNames,
) {
  fun writeNone(
    destination: NamedWriteDestination, 
    valueNamedWriteNull: SomeNames.() -> Unit,
  ) {
    0.namedWrite(tag, destination)
    valueNamedWriteNull(some)
  }

  fun writeSome(
    destination: NamedWriteDestination, 
    valueNamedWrite: SomeNames.() -> Unit
  ) {
    1.namedWrite(tag, destination)
    valueNamedWrite(some)
  }
}

data class TimeRangeNames(
  val from: String,
  val till: String,
) {
  fun writeFrom(destination: NamedWriteDestination, value: Time) {
    value.namedWrite(from, destination)
  }

  fun writeTill(destination: NamedWriteDestination, value: Time) {
    value.namedWrite(till, destination)
  }

  fun write(destination: NamedWriteDestination, value: TimeRange) {
    value.getFrom().namedWrite(from, destination)
    value.getTill().namedWrite(till, destination)
  }
}

data class CountdownNames(
  val from: String,
  val duration: String,
) {
  fun writeFrom(destination: NamedWriteDestination, value: Instant) {
    value.namedWrite(from, destination)
  }

  fun writeDuration(destination: NamedWriteDestination, value: Duration) {
    value.namedWrite(duration, destination)
  }

  fun write(destination: NamedWriteDestination, value: Countdown) {
    value.from.namedWrite(from, destination)
    value.duration.namedWrite(duration, destination)
  }

  fun writeNull(destination: NamedWriteDestination) {
    destination.writeNull(from)
    destination.writeNull(duration)
  }
}

data class CountdownConditionalNames(
  val duration: String,
  val countdown: OptionNames<CountdownNames>,
) {
  fun writeDuration(destination: NamedWriteDestination, value: Duration) {
    value.namedWrite(duration, destination)
  }

  fun writeCountdownNone(destination: NamedWriteDestination) {
    countdown.writeNone(destination) { writeNull(destination) }
  }

  fun writeCountdownSome(destination: NamedWriteDestination, value: Countdown) {
    countdown.writeSome(destination) { write(destination, value) }
  }

  fun writeCountdown(destination: NamedWriteDestination, value: Countdown?) {
    value 
      ?.let {
        writeCountdownSome(destination, it)
      } 
      ?: run {
        writeCountdownNone(destination)
      }
  }

  fun reactivate(
    destination: NamedWriteDestination,
    reactivateState: CountdownConditional.ReactivateState,
  ) {
    writeCountdownSome(destination, reactivateState.countdown)
  }
}

data class CountdownAfterPleaConditionalNames(
  val duration: String,
  val countdown: OptionNames<CountdownNames>,
) {

  fun writeDuration(destination: NamedWriteDestination, value: Duration) {
    value.namedWrite(duration, destination)
  }

  fun writeCountdownNone(destination: NamedWriteDestination) {
    countdown.writeNone(destination) { writeNull(destination) }
  }

  fun writeCountdownSome(destination: NamedWriteDestination, value: Countdown) {
    countdown.writeSome(destination) { write(destination, value) }
  }

  fun writeCountdown(destination: NamedWriteDestination, value: Countdown?) {
    value 
      ?.let {
        writeCountdownSome(destination, it)
      } 
      ?: run {
        writeCountdownNone(destination)
      }
  }

  fun reactivate(
    destination: NamedWriteDestination,
  ) {
    writeCountdownNone(destination)
  }

  fun reDeactivate(
    destination: NamedWriteDestination,
    reDeactivateState: CountdownAfterPleaConditional.ReDeactivateState,
  ) {
    writeCountdownSome(destination, reDeactivateState.countdown)
  }
}

data class RuleEnablerNames(
  val variant: String,
  val countdownConditional: CountdownConditionalNames,
  val countdownAfterPleaConditional: CountdownAfterPleaConditionalNames,
) {
  fun write() {
    
  }
}

data class AlwaysRuleNames(
  val enabler: RuleEnablerNames,
)

data class TimeRangeRuleNames(
  val enabler: RuleEnablerNames,
  val condition: TimeRangeNames,
)

data class TimeAllowanceRuleNames(
  val enabler: RuleEnablerNames,
  val allowance: String,
)


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

// -------------------------------------------------


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
data class OptionIndexes<T>(
  val variant: Int,
  val value: T,
) {
  fun writeNone(buffer: Buffer) {
    buffer.writeInt(0)
  }

  fun <Value> writeSome(
    buffer: Buffer, 
    writeValue: (indexes: T) -> Unit
  ) {
    buffer.writeInt(1)
    writeValue(value)
  }
}

data class TimeRangeIndexes(
  val from: Int,
  val till: Int,
) {
  fun writeFrom(
    buffer: Buffer,
    newValue: Time,
  ) {
    
  }
}

data class CountdownIndexes(
  val from: Int,
  val duration: Int,
)

data class CountdownConditionalIndexes(
  val duratioin: Int,
  val countdown: OptionIndexes<CountdownIndexes>,
)

data class CountdownAfterPleaConditionalIndexes(
  val duration: Int,
  val countdown: OptionIndexes<CountdownIndexes>,
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

fun <Value, ValueIndexes> Cursor.readOptional(
  indexes: OptionIndexes<ValueIndexes>,
  readSome: (ValueIndexes) -> Value,
): Value? {
  return when (readOptionalVariant(indexes.variant)) {
    OptionVariant.None -> null
    OptionVariant.Some -> readSome(indexes.value)
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
      readOptional(indexes.countdown) { readCountdown(it) }
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a CountdownConditional")
  }
}

fun Cursor.readCountdownAfterPleaConditional(indexes: CountdownAfterPleaConditionalIndexes): CountdownAfterPleaConditional {
  try {
    return CountdownAfterPleaConditional.construct(
      readDuration(indexes.duration),
      readOptional(indexes.countdown) { readCountdown(it) }
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
        RuleEnabler.Countdown(readCountdownConditional(indexes.countdownConditional))
      }
      RuleEnabler.Variant.CountdownAfterPlea -> {
        RuleEnabler.CountdownAfterPlea(readCountdownAfterPleaConditional(indexes.countdownAfterPleaConditional))
      }
    }
  } catch (error: TextualError) {
    throw error.changeContext("Reading a RuleEnabler")
  }
}

fun Cursor.readAlwaysRule(indexes: AlwaysRuleIndexes): AlwaysRule {
  try {
    return AlwaysRule.construct(readRuleEnabler(indexes.enabler))
  } catch (error: TextualError) {
    throw error.changeContext("Reading an AlwaysRule")
  }
}

fun Cursor.readTimeRangeRule(indexes: TimeRangeRuleIndexes): TimeRangeRule {
  try {
    return TimeRangeRule.construct(
      readRuleEnabler(indexes.enabler),
      readTimeRange(indexes.condition),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeRangeRule")
  }
}

fun Cursor.readTimeAllowanceRule(indexes: TimeAllowanceRuleIndexes): TimeAllowanceRule {
  try {
    return TimeAllowanceRule.construct(
      readRuleEnabler(indexes.enabler),
      readDuration(indexes.allowance),
    )
  } catch (error: TextualError) {
    throw error.changeContext("Reading a TimeAllowanceRule")
  }
}