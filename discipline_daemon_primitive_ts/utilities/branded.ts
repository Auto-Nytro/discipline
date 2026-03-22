const TYPE_BRAND = Symbol();

export type Branded<Brand extends symbol, T> = (
  & T 
  & { [TYPE_BRAND]: Brand }
  & { [Key in Brand]: Brand }
);

export const Branded = <Brand extends symbol, T>(
  brand: Brand,
  value: Omit<T, Brand | typeof TYPE_BRAND>,
) => {
  return value as Branded<Brand, T>;
};