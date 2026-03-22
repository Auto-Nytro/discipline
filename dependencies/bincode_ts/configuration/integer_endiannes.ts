export const enum IntegerEndianness {
  Big,
  Little,
}

export const Big = (): IntegerEndianness.Big => {
  return IntegerEndianness.Big;
};

export const Little = (): IntegerEndianness.Little => {
  return IntegerEndianness.Little;
};

export type MatchCases<A, B> = {
  readonly Big: () => A,
  readonly Little: () => B,
};

export const match = <A, B>(me: IntegerEndianness, cases: MatchCases<A, B>): A | B => {
  switch (me) {
    case IntegerEndianness.Big: {
      return cases.Big();
    }
    case IntegerEndianness.Little: {
      return cases.Little();
    }
  }
};