import { Tried } from "../../discipline_ui_bridge/mod.ts";
import { Configuration, EncodeError } from "../prelude.ts";
import { WriteDestination } from "./write.ts";

//! Encoder-based structs and traits.

/// Any source that can be encoded. This trait should be implemented for all types that you want to be able to use with any of the `encode_with` methods.
///
/// This trait will be automatically implemented if you enable the `derive` feature and add `#[derive(bincode::Encode)]` to your trait.
///
/// # Implementing this trait manually
///
/// If you want to implement this trait for your type, the easiest way is to add a `#[derive(bincode::Encode)]`, build and check your `target/generated/bincode/` folder. This should generate a `<Struct name>_Encode.rs` file.
///
/// For this struct:
///
/// ```
/// struct Entity {
///     pub x: f32,
///     pub y: f32,
/// }
/// ```
/// It will look something like:
///
/// ```
/// # struct Entity {
/// #     pub x: f32,
/// #     pub y: f32,
/// # }
/// impl bincode::Encode for Entity {
///     fn encode<E: bincode::enc::Encoder>(
///         &self,
///         encoder: &mut E,
///     ) -> core::result::Result<(), bincode::error::EncodeError> {
///         bincode::Encode::encode(&self.x, encoder)?;
///         bincode::Encode::encode(&self.y, encoder)?;
///         Ok(())
///     }
/// }
/// ```
///
/// From here you can add/remove fields, or add custom logic.
export type Encode<Me> = {
  /// Encode a given type.
  encode<Destination>(
    me: Me, 
    configuration: Configuration.Configuration,
    destination: Destination,
    destinationWrite: WriteDestination<Destination>,
  ): Tried.Tried<null, EncodeError.EncodeError>;
};

export const Encode_implement = <Me>({ encode }: Pick<Encode<Me>, "encode">): Encode<Me> => {
  return { encode };
};

/// Helper trait to encode basic types into.
export type Encoder<Writer> = {
  /// Returns a mutable reference to the writer
  readonly writer: Writer;

  /// Returns a reference to the config
  readonly configuration: Configuration.Configuration;
}


// /// Encode the variant of the given option. Will not encode the option itself.
// #[inline]
// pub(crate) fn encode_option_variant<E: Encoder, T>(
//     encoder: &mut E,
//     value: &Option<T>,
// ) -> Result<(), EncodeError> {
//     match value {
//         None => 0u8.encode(encoder),
//         Some(_) => 1u8.encode(encoder),
//     }
// }

// /// Encodes the length of any slice, container, etc into the given encoder
// #[inline]
// pub(crate) fn encode_slice_len<E: Encoder>(encoder: &mut E, len: usize) -> Result<(), EncodeError> {
//     (len as u64).encode(encoder)
// }
