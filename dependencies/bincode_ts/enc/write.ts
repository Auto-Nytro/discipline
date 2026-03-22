import { EncodeError } from "../prelude.ts"
import { Tried } from "../../discipline_ui_bridge/mod.ts";

export type WriteDestination<Me> = {
  /// Write `bytes` to the underlying writer. Exactly `bytes.len()` bytes must be written, or else an error should be returned.
  write(me: Me, bytes: Uint8Array): Tried.Tried<null, EncodeError.EncodeError>;
};

export const WriteDestination_implement = <Me>({
  write
}: {
  write(me: Me, bytes: Uint8Array): Tried.Tried<null, EncodeError.EncodeError>;
}): WriteDestination<Me> => {
  return { write };
};

/// A helper struct that implements `Writer` for a `&[u8]` slice.
///
/// ```
/// use bincode::enc::write::{Writer, SliceWriter};
///
/// let destination = &mut [0u8; 100];
/// let mut writer = SliceWriter::new(destination);
/// writer.write(&[1, 2, 3, 4, 5]).unwrap();
///
/// assert_eq!(writer.bytes_written(), 5);
/// assert_eq!(destination[0..6], [1, 2, 3, 4, 5, 0]);
/// ```
export type SliceWriteDestination = {
  slice: Uint8Array,
  originalLength: number,
};

/// Create a new instance of `SliceWriter` with the given byte array.
export const SliceWriteDestination_create = (slice: Uint8Array): SliceWriteDestination => {
  return {
    slice,
    originalLength: slice.byteLength,
  };
};

/// Return the amount of bytes written so far.
export const SliceWriteDestination_bytesWritten = (me: SliceWriteDestination): number => {
  return me.originalLength - me.slice.byteLength;
};

export const SliceWriteDestination_writer = WriteDestination_implement<SliceWriteDestination>({
  write(me, bytes) {
    if (bytes.byteLength > me.slice.byteLength) {
      return Tried.Failure(EncodeError.UnexpectedEnd());
    }

    // Copy the bytes to the beginning of our slice
    me.slice.set(bytes.slice(0, me.slice.length), 0);

    // Advance the courser by creating a subarray view
    me.slice = me.slice.subarray(bytes.length);

    return Tried.Success(null);
  },
});

/// A writer that counts how many bytes were written. This is useful for e.g. pre-allocating buffers before writing to them.
export type SizeWriteDestination = {
  /// the amount of bytes that were written so far
  bytesWritten: number,
};

export const SizeWriteDestination_create = (): SizeWriteDestination => {
  return {
    bytesWritten: 0,
  };
};

export const SizeWriteDestination_writer = WriteDestination_implement<SizeWriteDestination>({
  write(me, bytes) {
    const temp = me.bytesWritten = bytes.length;
    if (Number.isSafeInteger(temp)) {
      me.bytesWritten += temp;
      return Tried.Success(null);
    } else {
      // TODO
      return Tried.Failure(EncodeError.UnexpectedEnd());
    }
  },
})