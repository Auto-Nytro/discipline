export const enum IntegerEncoding {
  FixedLength,
  VariableLength,
}

export const FixedLength = (): IntegerEncoding.FixedLength => {
  return IntegerEncoding.FixedLength;
};

export const VariableLength = (): IntegerEncoding.VariableLength => {
  return IntegerEncoding.VariableLength;
};