import { Branded, Equality } from "../mod.ts";

const ORDERING_BRAND = Symbol();

const ORDERING_LESS = -1;
const ORDERING_EQUAL = 0;
const ORDERING_GREATER = 1;

export type OrderingLess = Branded<typeof ORDERING_BRAND, typeof ORDERING_LESS>;
export type OrderingEqual = Branded<typeof ORDERING_BRAND, typeof ORDERING_EQUAL>;
export type OrderingGreater = Branded<typeof ORDERING_BRAND, typeof ORDERING_GREATER>;

export type Ordering = (
  | OrderingLess
  | OrderingEqual
  | OrderingGreater
);

export const Ordering = {
  Less: (): OrderingLess =>  {
    return Branded(ORDERING_BRAND, ORDERING_LESS);
  },
  
  Equal: (): OrderingEqual =>  {
    return Branded(ORDERING_BRAND, ORDERING_EQUAL);
  },

  Greater: (): OrderingGreater =>  {
    return Branded(ORDERING_BRAND, ORDERING_GREATER);
  },

  isLess: (it: Ordering): it is OrderingLess => {
    return it === ORDERING_LESS;
  },
  
  isLessOrEqual: (it: Ordering): it is OrderingLess | OrderingEqual => {
    return it === ORDERING_LESS || it === ORDERING_EQUAL;
  },

  isGreater: (it: Ordering): it is OrderingGreater => {
    return it === ORDERING_GREATER;
  },
  
  isGreaterOrEqual: (it: Ordering): it is OrderingGreater | OrderingEqual => {
    return it === ORDERING_GREATER || it === ORDERING_EQUAL;
  },
};

const ORDER_BRAND = Symbol();

export type Order<A, B = A> = Branded<typeof ORDER_BRAND, {
  compare(a: A, b: B): Ordering;
  isEqualTo(a: A, b: B): boolean;
  isInequalTo(a: A, b: B): boolean;
  isLessThan(a: A, b: B): boolean;
  isGreaterThan(a: A, b: B): boolean;
  isLessThanOrEqualTo(a: A, b: B): boolean;
  isGreaterThanOrEqualTo(a: A, b: B): boolean;
  findMaximum(a: A, b: B): A | B;
  findMinimum(a: A, b: B): A | B;
  clamp(value: A, min: B, max: B): A | B;
}>;

export const Order = {
  implement: <A, B = A>({
    equality, 
    compare,
    clamp,
    findMaximum,
    findMinimum,
    isGreaterThan,
    isGreaterThanOrEqualTo,
    isLessThan,
    isLessThanOrEqualTo,
  }: {
    equality: Equality<A, B>,
    compare(a: A, b: B): Ordering;
    isLessThan?(a: A, b: B): boolean;
    isGreaterThan?(a: A, b: B): boolean;
    isLessThanOrEqualTo?(a: A, b: B): boolean;
    isGreaterThanOrEqualTo?(a: A, b: B): boolean;
    findMaximum?(a: A, b: B): A | B;
    findMinimum?(a: A, b: B): A | B;
    clamp?(value: A, min: A | B, max: A | B): A | B;
  }): Order<A, B> => {
    return Branded(ORDER_BRAND, {
      isEqualTo: equality.isEqualTo,
      isInequalTo: equality.isInequalTo,

      compare,

      isLessThan: isLessThan ?? ((a, b) => {
        return compare(a, b) === Ordering.Less();
      }),
      isLessThanOrEqualTo: isLessThanOrEqualTo ?? ((a, b) => {
        return compare(a, b) !== Ordering.Greater();
      }),
      isGreaterThan: isGreaterThan ?? ((a, b) => {
        return compare(a, b) === Ordering.Greater();
      }),
      isGreaterThanOrEqualTo: isGreaterThanOrEqualTo ?? ((a, b) => {
        return compare(a, b) !== Ordering.Less();
      }),
      clamp: clamp ?? ((value, min, max) => {
        throw new Error("Not Implemented!")
      }),

      findMaximum: () => {
        throw new Error("Not Implemented!");
      },

      findMinimum: () => {
        throw new Error("Not Implemented!");
      },
    });
  },
};