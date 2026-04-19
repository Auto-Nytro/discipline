import { Countdown } from "@internal/prelude";
import { Index, Name, NamedWrite, NamedWriteNull, OrderedWrite, OrderedWriteNull, NamedRead, IndexedRead, DurationAdapter, InstantAdapter } from "@internal/database/prelude";

export interface CountdownNames {
  readonly from: Name,
  readonly duration: Name,
}

export const CountdownNamedWrite = NamedWrite.implement<Countdown, CountdownNames>({
  write(value, names, destination, destinationImpl) {
    destinationImpl.writeScalarValue(destination, names.from, Countdown.getFrom(value), InstantAdapter);
    destinationImpl.writeScalarValue(destination, names.duration, Countdown.getTotalDuration(value), DurationAdapter);
  },
});

export const CountdownOrderedWrite = OrderedWrite.implement<Countdown>({
  write(value, destination, destinationImpl) {
    destinationImpl.writeScalarValue(destination, Countdown.getFrom(value), InstantAdapter);
    destinationImpl.writeScalarValue(destination, Countdown.getTotalDuration(value), DurationAdapter);
  },
});

export interface CountdownIndexes {
  readonly from: Index,
  readonly duration: Index,
}

export const CountdownNamedWriteNull = NamedWriteNull.implement<CountdownNames>({
  write(names, destination, destinationImpl) {
    destinationImpl.writeNull(destination, names.from);
    destinationImpl.writeNull(destination, names.duration);
  },
});

export const CountdownOrderedWriteNull = OrderedWriteNull.implement({
  write(destination, destinationImpl) {
    destinationImpl.writeNull(destination);
    destinationImpl.writeNull(destination);
  },
});

export const CountdownNamedRead = NamedRead.implement<Countdown, CountdownNames>({
  readOrThrow(names, source, sourceImpl) {
    return Countdown.create(
      sourceImpl.readScalarValueOrThrow(source, names.from, InstantAdapter),
      sourceImpl.readScalarValueOrThrow(source, names.duration, DurationAdapter),
    );
  },
});

export const CountdownIndexedRead = IndexedRead.implement<Countdown, CountdownIndexes>({
  readOrThrow(indexes, source, sourceImpl) {
    return Countdown.reconstruct(
      sourceImpl.readScalarValueOrThrow(source, indexes.from, InstantAdapter),
      sourceImpl.readScalarValueOrThrow(source, indexes.duration, DurationAdapter),
    );
  },
});
