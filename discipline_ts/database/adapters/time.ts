import { Integer, Time, Tried } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";

export const TimeAdapter = ScalarAdapter.implement<Time>({
  name: "Time",

  write(value, destination, destinationImpl) {
    destinationImpl.writeInteger(destination, Time.getTimestamp(value) as unknown as Integer);
  },

  readOrThrow(source, sourceImpl) {
    return Tried.experimental_unwrap(Time.fromTimestamp(sourceImpl.readIntegerOrThrow(source)));
  },
});