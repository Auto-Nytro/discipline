import { Date, Integer, Tried } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";

export const DateAdapter = ScalarAdapter.implement<Date>({
  name: "Date",

  write(value, destination, destinationImpl) {
    destinationImpl.writeInteger(destination, Date.getTimestamp(value) as unknown as Integer);
  },

  readOrThrow(source, sourceImpl) {
    return Tried.experimental_unwrap(Date.fromTimestamp(sourceImpl.readIntegerOrThrow(source)));
  },
});
