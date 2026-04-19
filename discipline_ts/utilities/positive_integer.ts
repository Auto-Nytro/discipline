import { Unique } from "@internal/prelude";

const BRAND = Symbol();
export type PositiveInteger = Unique<typeof BRAND, "PositiveInteger", number>;

const uncheckedFromNumber = (number: number): PositiveInteger => {
  return number as PositiveInteger;
};

// const isPositiveInteger = Number.isPositiveInteger as ((value: unknown) => value is number);

const fromString = (string: string): number | null => {
  let result: number;

  try {
    result = parseInt(string);
  } catch (error) {
    return null;
  }

  if (!Number.isSafePositiveInteger(result)) {
    return null;
  }

  return result;
};

const parsePositiveInteger = (string: string) => {
  let number;

  try {
    number = parseInt(string);
  } catch (error) {
    return null;
  }

  if (number !== number) {
    return null;
  }

  return number;
};

const saturatingAdd = (
  lhs: PositiveInteger,
  rhs: PositiveInteger,
): PositiveInteger => {
  const result = lhs + rhs;
  if (result === Infinity) {
    return Number.MAX_SAFE_INTEGER as PositiveInteger;
  }
  return result as PositiveInteger;
};

const saturatingIncrement = (it: PositiveInteger): PositiveInteger => {};
const saturatingDecrement = (it: PositiveInteger): PositiveInteger => {};

export const PositiveInteger = {
  uncheckedFromNumber,
  saturatingAdd,
  saturatingIncrement,
  saturatingDecrement
};