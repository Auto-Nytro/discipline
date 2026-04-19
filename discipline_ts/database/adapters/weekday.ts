import { Integer } from "@internal/prelude";
import { ScalarAdapter } from "@internal/database/prelude";

// export const WeekdayAdapter = ScalarAdapter.implement<Weekday>({
//   name: "Weekday",

//   write(value, destination, destinationImpl) {
//     destinationImpl.writeInteger(destination, Weekday.toNumber(value) as unknown as Integer);
//   },

//   readOrThrow(source, sourceImpl) {
//     return Weekday.fromNumberOrThrow(sourceImpl.readIntegerOrThrow(source));
//   },
// });