import { Instant } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";
import { DurationAdapter } from "./duration.ts";

export const InstantAdapter = ScalarAdapter.implement<Instant>({
  name: "Instant",

  write(value, destination, destinationImpl) {
    destinationImpl.writeScalarValue(destination, Instant.toElapsedTime(value), DurationAdapter);
  },

  readOrThrow(source, sourceImpl) {
    return Instant.fromElapsedTime(sourceImpl.readOrThrow(source, DurationAdapter));
  },
});
