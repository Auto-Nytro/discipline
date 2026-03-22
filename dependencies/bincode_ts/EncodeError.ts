/// Errors that can be encountered by encoding a type
export const enum EncodeErrorType {
  /// The writer ran out of storage.
  UnexpectedEnd,

  /// The `RefCell<T>` is already borrowed
  RefCellAlreadyBorrowed,
};

const BRAND = Symbol();

export type EncodeError = typeof BRAND;

export const UnexpectedEnd = (): EncodeError => {
  return null as any;
};

export const RefCellAlreadyBorrowed = (): EncodeError => {
  return null as any;
};