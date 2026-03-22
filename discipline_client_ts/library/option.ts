import { Branded } from "../mod.ts";

const NONE_BRAND = Symbol();
const SOME_BRAND = Symbol();

const TYPE_NONE = 0;
const TYPE_SOME = 1;

export type None = Branded<typeof NONE_BRAND, {
  readonly type: typeof TYPE_NONE,
}>;

export type Some<T> = Branded<typeof SOME_BRAND, {
  readonly type: typeof TYPE_SOME,
  readonly value: T,
}>;

export type Option<T> = (
  | None 
  | Some<T>
);

export const Option = {
  None: (): None => {
    return Branded(NONE_BRAND, {
      type: TYPE_NONE,
    });
  },

  Some: <T>(value: T): Some<T> => {
    return Branded(SOME_BRAND, {
      type: TYPE_SOME,
      value,
    });
  },

  isSome: <T>(me: Option<T>): me is Some<T> => {
    return me.type === TYPE_SOME;
  },

  isNone: <T>(me: Option<T>): me is None => {
    return me.type === TYPE_NONE;
  },

  value: <T>(me: Some<T>): T => {
    return me.value;
  },

  unwrap: <T>(me: Option<T>): T => {
    if (Option.isSome(me)) {
      return me.value;
    }

    throw new Error("Called `unwrap` on a `None` value");
  },

  unwrapOr: <T>(me: Option<T>, defaultValue: T): T => {
    return Option.isSome(me) ? me.value : defaultValue;
  },

  unwrapOrElse: <T>(me: Option<T>, fn: () => T): T => {
    return Option.isSome(me) ? me.value : fn();
  },

  expect: <T>(me: Option<T>, msg: string): T => {
    if (Option.isSome(me)) {
      return me.value;
    }

    throw new Error(msg);
  },

  map: <T, U>(me: Option<T>, fn: (value: T) => U): Option<U> => {
    return Option.isSome(me) ? Option.Some(fn(me.value)) : Option.None();
  },

  mapOr: <T, U>(me: Option<T>, defaultValue: U, fn: (value: T) => U): U => {
    return Option.isSome(me) ? fn(me.value) : defaultValue;
  },

  mapOrElse: <T, U>(me: Option<T>, defaultFn: () => U, fn: (value: T) => U): U => {
    return Option.isSome(me) ? fn(me.value) : defaultFn();
  },

  and: <T, U>(me: Option<T>, other: Option<U>): Option<U> => {
    return Option.isSome(me) ? other : Option.None();
  },

  andThen: <T, U>(me: Option<T>, fn: (value: T) => Option<U>): Option<U> => {
    return Option.isSome(me) ? fn(me.value) : Option.None();
  },

  or: <T>(me: Option<T>, other: Option<T>): Option<T> => {
    return Option.isSome(me) ? me : other;
  },

  orElse: <T>(me: Option<T>, fn: () => Option<T>): Option<T> => {
    return Option.isSome(me) ? me : fn();
  },

  filter: <T>(me: Option<T>, predicate: (value: T) => boolean): Option<T> => {
    return Option.isSome(me) && predicate(me.value) 
      ? me 
      : Option.None();
  },

  zip: <T, U>(me: Option<T>, other: Option<U>): Option<[T, U]> => {
    return Option.isSome(me) && Option.isSome(other) 
      ? Option.Some([me.value, other.value]) 
      : Option.None();
  },

  zipWith: <T, U, V>(
    me: Option<T>,
    other: Option<U>,
    fn: (a: T, b: U) => V
  ): Option<V> => {
    return Option.isSome(me) && Option.isSome(other) 
      ? Option.Some(fn(me.value, other.value)) 
      : Option.None();
  },

  unzip: <T, U>(me: Option<[T, U]>): [Option<T>, Option<U>] => {
    return Option.isSome(me) 
      ? [Option.Some(me.value[0]), Option.Some(me.value[1])] 
      : [Option.None(), Option.None()];
  },

  // Boolean operations
  contains: <T>(me: Option<T>, value: T): boolean => {
    return Option.isSome(me) && me.value === value;
  },

  xor: <T>(me: Option<T>, other: Option<T>): Option<T> => {
    if (Option.isSome(me) && Option.isNone(other)) {
      return me;
    }

    if (Option.isNone(me) && Option.isSome(other)) {
      return other;
    }

    return Option.None();
  },

  // Conversion methods
  // export const okOr = <T, E>(me: Option<T>, err: E): Result<T, E> => {
  //   return isSome(me) ? Ok(me.value) : Err(err);
  // };

  // export const okOrElse = <T, E>(me: Option<T>, errFn: () => E): Result<T, E> => {
  //   return isSome(me) ? Ok(me.value) : Err(errFn());
  // };

  // Utility methods
  flatten: <T>(me: Option<Option<T>>): Option<T> => {
    return Option.isSome(me) ? me.value : Option.None();
  },

  getOrInsert: <T>(me: Option<T>, value: T): T => {
    if (Option.isNone(me)) {
      // This would require mutable options to be fully implemented
      // For immutable version, we return the value but cannot modify the original
      return value;
    }
    return me.value;
  },

  getOrInsertWith: <T>(me: Option<T>, fn: () => T): T => {
    if (Option.isNone(me)) {
      return fn();
    }
    return me.value;
  },
}