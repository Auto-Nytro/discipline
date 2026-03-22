import { Configuration } from "../prelude.ts";

export const enum WriteStatus {
  DestinationIsFull,
  Success,
}

export type Write<Me> = {
  write(me: Me, bytes: Uint8Array): WriteStatus;
  writeByte(me: Me, byte: number): WriteStatus;
};

export const Write_implement = <Me>({ write }: Pick<Write<Me>, "write">): Write<Me> => {
  return { write };
};

export type SliceWriter = {
  slice: Uint8Array,
  originalLength: number,
};

export const SliceWrite_create = (slice: Uint8Array): SliceWriter => {
  return {
    slice,
    originalLength: slice.byteLength,
  };
};

export const SliceWriter_bytesWritten = (me: SliceWriter): number => {
  return me.originalLength - me.slice.byteLength;
};

export const SliceWriter_write = Write_implement<SliceWriter>({
  write(me, bytes) {
    if (bytes.byteLength > me.slice.byteLength) {
      return WriteStatus.DestinationIsFull;
    }

    // Copy the bytes to the beginning of our slice
    me.slice.set(bytes.slice(0, me.slice.length), 0);

    // Advance the courser by creating a subarray view
    me.slice = me.slice.subarray(bytes.length);

    return WriteStatus.Success;
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

export const SizeWriteDestination_writer = Write_implement<SizeWriteDestination>({
  write(me, bytes) {
    const temp = me.bytesWritten + bytes.length;
    if (Number.isSafeInteger(temp)) {
      me.bytesWritten = temp;
      return WriteStatus.Success;
    } else {
      return WriteStatus.DestinationIsFull;
    }
  },
});


export type Encode<Me> = {
  encode<Writer>(
    me: Me, 
    write: Write<Writer>,
    writer: Writer,
    configuration: Configuration.Configuration,
  ): any;
};

export const Encode_implement = <Me>({ encode }: Pick<Encode<Me>, "encode">): Encode<Me> => {
  return { encode };
};

export const Unit_encode = Encode_implement<null>({
  encode(me, write, writer, configuration) {
    
  },
});

export const U8_encode = Encode_implement<number>({
  encode(me, write, writer, _configuration) {
    write.writeByte(writer, me);
  },
});

export const NonZeroU8_encode = Encode_implement<number>({
  encode(me, write, writer, _configuration) {
    write.writeByte(writer, me);
  },
});

export const U16_encode = Encode_implement<number>({
  encode(me, write, writer, configuration) {
    
  },
});

// export const Bool_encode = Encode_implement<boolean>({
//   encode(me, write, writer, configuration) {
//    if (me) {
//     write.writeByte(writer, 1);
//    } else {
//     write.
//    }
//   },
// });