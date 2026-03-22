import { Configuration } from "../prelude.ts";

/// An Encoder that writes bytes into a given writer `W`.
///
/// This struct should rarely be used.
/// In most cases, prefer any of the `encode` functions.
///
/// The ByteOrder that is chosen will impact the endianness that
/// is used to write integers to the writer.
///
/// ```
/// # use bincode::enc::{write::SliceWriter, EncoderImpl, Encode};
/// let slice: &mut [u8] = &mut [0, 0, 0, 0];
/// let config = bincode::config::legacy().with_big_endian();
///
/// let mut encoder = EncoderImpl::new(SliceWriter::new(slice), config);
/// // this u32 can be any Encodable
/// 5u32.encode(&mut encoder).unwrap();
/// assert_eq!(encoder.into_writer().bytes_written(), 4);
/// assert_eq!(slice, [0, 0, 0, 5]);
/// ```
export type EncoderImpl<Writer> = {
  writer: Writer,
  configuration: Configuration.Configuration,
}

/// Create a new Encoder
export const create = <Writer>(writer: Writer, configuration: Configuration.Configuration): EncoderImpl<Writer> => {
  return {
    writer,
    configuration,
  }
};

/// Return the underlying writer
export const writer = <Writer>(me: EncoderImpl<Writer>): Writer => {
  return me.writer;
};