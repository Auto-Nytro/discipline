import { Float, Integer, Nullable, TextualError } from "@internal/prelude";
import { Index, Scalar } from "@internal/database/prelude"

export interface IndexedReadSource<Source> {
  readonly isNull: (source: Source, index: Index) => boolean;
  readonly readNullOrThrow: (source: Source, index: Index) => null;
  readonly readIntegerOrThrow: (source: Source, index: Index) => Integer;
  readonly readNullableIntegerOrThrow: (source: Source, index: Index) => Nullable<Integer>;
  readonly readRealOrThrow: (source: Source, index: Index) => Float;
  readonly readNullableRealOrThrow: (source: Source, index: Index) => Nullable<Float>;
  readonly readStringOrThrow: (source: Source, index: Index) => string;
  readonly readNullableStringOrThrow: (source: Source, index: Index) => Nullable<string>;
  readonly readBooleanOrThrow: (source: Source, index: Index) => boolean;
  readonly readNullableBooleanOrThrow: (source: Source, index: Index) => Nullable<boolean>;
  readonly readScalarValueOrThrow: <Value>(source: Source, index: Index, adapter: Scalar<Value>) => Value;
  readonly readNullableScalarValueOrThrow: <Value>(source: Source, index: Index, adapter: Scalar<Value>) => Nullable<Value>;
  readonly readCompoundValueOrThrow: <Value, Indexes>(source: Source, indexes: Indexes, indexedRead: IndexedRead<Value, Indexes>) => Value;
}

export interface IndexedRead<Value, Indexes> {
  readonly readOrThrow: <Source>(
    indexes: Indexes,
    source: Source,
    sourceImpl: IndexedReadSource<Source>,
  ) => Value;
}

export const IndexedRead = {
  implement: <Value, Indexes>(initializer: IndexedRead<Value, Indexes>): IndexedRead<Value, Indexes> => {
    return initializer;
  },
};
