import { Duration, Integer } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";

export const DurationAdapter = ScalarAdapter.implement<Duration>({
  name: "Duration",

  write: (value, destination, destinationImpl) => {
    destinationImpl.writeInteger(destination, Duration.toTotalMilliseconds(value) as unknown as Integer);
  },

  readOrThrow: (source, sourceImpl) => {
    return Duration.fromMillisecondsOrThrow(sourceImpl.readIntegerOrThrow(source));
  },
});
