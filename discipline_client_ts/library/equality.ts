import { Branded } from "../mod.ts";

const BRAND = Symbol();

export type Equality<A, B = A> = Branded<typeof BRAND, {
  isEqualTo: (a: A, b: B) => boolean;
  isInequalTo: (a: A, b: B) => boolean;
}>;

export const Equality = {
  implement: <A, B = A>({
    isEqualTo,
    isInequalTo,
  }: {
    isEqualTo: (a: A, b: B) => boolean;
    isInequalTo?: (a: A, b: B) => boolean;
  }): Equality<A, B> => {
    return Branded(BRAND, {
      isEqualTo,
      
      isInequalTo: isInequalTo ?? ((a, b) => {
        return !isEqualTo(a, b);
      }),
    });
  };
};