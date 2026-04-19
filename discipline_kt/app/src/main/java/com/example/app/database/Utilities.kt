object DurationAdapter : ScalarAdapter {
  fun write(value: Duration, destination: ScalarValueWriteDestination): Unit {
    
  }
}

interface ScalarWriteDestination {
  fun writeNull(): Unit;
  fun writeInteger(value: Integer): Unit;
  fun writeNullableInteger(value: Integer?): Unit;
  fun writeReal(value: Float): Unit;
  fun writeNullableReal(value: Float?): Unit;
  fun writeBoolean(value: Boolean): Unit;
  fun writeNullableBoolean(value: Booean?): Unit;
  fun writeString(value: String): Unit;
  fun writeNullableString(value: String?): Unit;
  fun <Value> writeScalarValue(value: Value, write: ScalarWrite<Value>): Unit;
  fun <Value> writeNullable(value: Nullable<Value>, write: ScalarWrite<Value>): Unit;
}

interface ScalarWrite<Value> {
  fun write(value: Value, destinationl: ScalarWriteDestination): Unit;
}
implement
const ScalarWrite =  {
  implement: <Value>(initializer: ScalarWrite<Value>): ScalarWrite<Value>: {
    return initializer;
  },
};


abstract class ScalarValueWriteDestination {
  
}

abstract class ScalarValueAdapter {
  abstract fun write() {}
  abstract fun readOrThrow() {}
}

