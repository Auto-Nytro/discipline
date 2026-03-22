// Errors that can be encountering by Encoding and Decoding.


type UnexpectedEnd = {
  /// Gives an estimate of how many extra bytes are needed.
  ///
  /// **Note**: this is only an estimate and not indicative of the actual bytes needed.
  ///
  /// **Note**: Bincode has no look-ahead mechanism. This means that this will only return the amount of bytes to be read for the current action, and not take into account the entire data structure being read.
  additional: number,
};

type InvalidIntegerType =  {
  /// The type that was being read from the reader
  expected: IntegerType,
  /// The type that was encoded in the data
  found: IntegerType,
};

type NonZeroTypeIsZero = {
  /// The type that was being read from the reader
  non_zero_type: IntegerType,
};

type UnexpectedVariant =  {
  /// The type name that was being decoded.
  type_name: string,

  /// The variants that are allowed
  allowed: AllowedEnumVariants,

  /// The index of the enum that the decoder encountered
  found: number,
};

type Utf8 =  {
  /// The inner error
  // inner: core::str::Utf8Error,
};

type InvalidCharEncoding = [number, number, number, number];

type InvalidBooleanValue = number;

type ArrayLengthMismatch =  {
  /// The length of the array required by the rust type.
  required: number,
  /// The length of the array found in the binary format.
  found: number,
};

type OutsideUsizeRange = number;

type EmptyEnum =  {
  /// The type that was being decoded
  type_name: string,
};

type InvalidDuration = {
  /// The number of seconds in the duration.
  secs: number,

  /// The number of nanoseconds in the duration, which when converted to seconds and added to
  /// `secs`, overflows a `u64`.
  nanos: number,
};

type InvalidSystemTime =  {
  /// The duration which could not have been added to
  /// [`UNIX_EPOCH`](std::time::SystemTime::UNIX_EPOCH)
  // duration: core::time::Duration,
};

type CStringNulError =  {
  /// Nul byte position
  position: number,
};

type Io =  {
  /// The IO error expected
  // inner: std::io::Error,

  /// Gives an estimate of how many extra bytes are needed.
  ///
  /// **Note**: this is only an estimate and not indicative of the actual bytes needed.
  ///
  /// **Note**: Bincode has no look-ahead mechanism. This means that this will only return the amount of bytes to be read for the current action, and not take into account the entire data structure being read.
  additional: number,
};

/// Errors that can be encountered by decoding a type
const enum DecodeErrorType {
  /// The reader reached its end but more bytes were expected.
  UnexpectedEnd,

  /// The given configuration limit was exceeded
  LimitExceeded,

  /// Invalid type was found. The decoder tried to read type `expected`, but found type `found` instead.
  InvalidIntegerType,

  /// The decoder tried to decode any of the `NonZero*` types but the value is zero
  NonZeroTypeIsZero,

  /// Invalid enum variant was found. The decoder tried to decode variant index `found`, but the variant index should be between `min` and `max`.
  UnexpectedVariant,

  /// The decoder tried to decode a `str`, but an utf8 error was encountered.
  Utf8,

  /// The decoder tried to decode a `char` and failed. The given buffer contains the bytes that are read at the moment of failure.
  InvalidCharEncoding,

  /// The decoder tried to decode a `bool` and failed. The given value is what is actually read.
  InvalidBooleanValue,

  /// The decoder tried to decode an array of length `required`, but the binary data contained an array of length `found`.
  ArrayLengthMismatch,

  /// The encoded value is outside of the range of the target usize type.
  ///
  /// This can happen if an usize was encoded on an architecture with a larger
  /// usize type and then decoded on an architecture with a smaller one. For
  /// example going from a 64 bit architecture to a 32 or 16 bit one may
  /// cause this error.
  OutsideUsizeRange,

  /// Tried to decode an enum with no variants
  EmptyEnum,

  /// The decoder tried to decode a Duration and overflowed the number of seconds.
  InvalidDuration,

  /// The decoder tried to decode a SystemTime and overflowed
  InvalidSystemTime,

  /// The decoder tried to decode a `CString`, but the incoming data contained a 0 byte
  CStringNulError,

  /// The reader encountered an IO error but more bytes were expected.
  Io,

  /// An uncommon error occurred, see the inner text for more information
  Other,

  // / An uncommon error occurred, see the inner text for more information
  // #[cfg(feature = "alloc")]
  // OtherString(alloc::string::String),
}

/// If the current error is `InvalidIntegerType`, change the `expected` and
/// `found` values from `Ux` to `Ix`. This is needed to have correct error
/// reporting in src/varint/decode_signed.rs since this calls
/// src/varint/decode_unsigned.rs and needs to correct the `expected` and
/// `found` types.
const DecodeError_change_integer_type_to_signed = (me: DecodeErrorType): DecodeErrorType => {
  //   match self {
  //     Self::InvalidIntegerType { expected, found } => Self::InvalidIntegerType {
  //       expected: expected.into_signed(),
  //       found: found.into_signed(),
  //     },
  //     other => other,
  //   }
  // }
  throw "todo";
}

/// Indicates which enum variants are allowed
type AllowedEnumVariants = {
  /// All values between `min` and `max` (inclusive) are allowed
  readonly type: "Range"
  readonly min: number,
  readonly max: number,
} | {
  /// Each one of these values is allowed
  readonly type: "Allowed",
  readonly variants: number[],
}

/// Integer types. Used by [DecodeError]. These types have no purpose other than being shown in errors.
const enum IntegerType {
  U8,
  U16,
  U32,
  U64,
  U128,
  Usize,

  I8,
  I16,
  I32,
  I64,
  I128,
  Isize,

  Reserved,
}

// impl IntegerType {
//   /// Change the `Ux` value to the associated `Ix` value.
//   /// Returns the old value if `self` is already `Ix`.
//   pub(crate) const fn into_signed(self) -> Self {
//     match self {
//       Self::U8 => Self::I8,
//       Self::U16 => Self::I16,
//       Self::U32 => Self::I32,
//       Self::U64 => Self::I64,
//       Self::U128 => Self::I128,
//       Self::Usize => Self::Isize,

//       other => other,
//     }
//   }
// }
