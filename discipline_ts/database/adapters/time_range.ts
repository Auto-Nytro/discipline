import { TimeRange } from "@internal/prelude";
import { Index, IndexedRead, Name, NamedRead, NamedWrite, NamedWriteNull, OrderedWrite, OrderedWriteNull } from "@internal/database/prelude";
import { TimeAdapter } from "./time.ts";

export interface TimeRangeNames {
  readonly from: Name,
  readonly till: Name,
}

export const TimeRangeNamedWrite = NamedWrite.implement<TimeRange, TimeRangeNames>({
  write(value, names, destination, destinationImpl) {
    destinationImpl.writeScalarValue(destination, names.from, TimeRange.getFrom(value), TimeAdapter);
    destinationImpl.writeScalarValue(destination, names.till, TimeRange.getTill(value), TimeAdapter);
  },
});

export const TimeRangeOrderedWrite = OrderedWrite.implement<TimeRange>({
  write(value, destination, destinationImpl) {
    destinationImpl.writeScalarValue(destination, TimeRange.getFrom(value), TimeAdapter);
    destinationImpl.writeScalarValue(destination, TimeRange.getTill(value), TimeAdapter);
  },
});

export interface TimeRangeIndexes {
  readonly from: Index,
  readonly till: Index,
}

export const TimeRangeNamedWriteNull = NamedWriteNull.implement<TimeRangeNames>({
  write(names, destination, destinationImpl) {
    destinationImpl.writeNull(destination, names.from);
    destinationImpl.writeNull(destination, names.till);
  },
});

export const TimeRangeOrderedWriteNull = OrderedWriteNull.implement({
  write(destination, destinationImpl) {
    destinationImpl.writeNull(destination);
    destinationImpl.writeNull(destination);
  },
});

export const TimeRangeNamedRead = NamedRead.implement<TimeRange, TimeRangeNames>({
  readOrThrow(names, source, sourceImpl) {
    return TimeRange.fromTimes(
      sourceImpl.readScalarValueOrThrow(source, names.from, TimeAdapter),
      sourceImpl.readScalarValueOrThrow(source, names.till, TimeAdapter),
    );
  },
});

export const TimeRangeIndexedRead = IndexedRead.implement<TimeRange, TimeRangeIndexes>({
  readOrThrow(indexes, source, sourceImpl) {
    return TimeRange.fromTimes(
      sourceImpl.readScalarValueOrThrow(source, indexes.from, TimeAdapter),
      sourceImpl.readScalarValueOrThrow(source, indexes.till, TimeAdapter),
    );
  },
});
