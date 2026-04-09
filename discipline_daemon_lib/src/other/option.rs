use crate::x::IsTextualError;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum OptionVariant {
  None,
  Some,
}

impl OptionVariant {
  pub fn from_number(number: u8, textual_error: &mut impl IsTextualError) -> Result<Self, ()> {
    todo!()
  }

  pub fn to_number(self) -> u8 {
    todo!()
  }
}