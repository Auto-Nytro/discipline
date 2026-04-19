import { DateTime, Integer, Tried } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";

export const DateTimeAdapter = ScalarAdapter.implement<DateTime>({
  name: "DateTime",

  write(value, destination, destinationImpl) {
    destinationImpl.writeInteger(destination, DateTime.toTimestamp(value) as unknown as Integer);
  },

  readOrThrow(source, sourceImpl) {
    return Tried.experimental_unwrap(DateTime.fromTimestamp(sourceImpl.readIntegerOrThrow(source)));
  },
});