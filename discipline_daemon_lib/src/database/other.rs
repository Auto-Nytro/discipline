use crate::x::*;

pub struct Name(pub &'static str);

pub struct Index(pub usize);

pub trait ScalarWriteDestination {

}
pub trait ScalarWrite {
  fn write(&self, destination: &mut impl ScalarWriteDestination);
}

trait OrderedWriteDestination {
  fn write_u8(&mut self, value: u8) {}
  fn write_u16(&mut self, value: u16) {}
  fn write_u32(&mut self, value: u32) {}
  fn write_u64(&mut self, value: u64) {}

  fn write_i8(&mut self, value: i8) {}
  fn write_i16(&mut self, value: i16) {}
  fn write_i32(&mut self, value: i32) {}
  fn write_i64(&mut self, value: i64) {}

  fn write_string(&mut self, value: &str) {}

  fn as_ordered_write_null_destination(&mut self) -> &mut impl OrderedNullWriteDestination;
}

trait OrderedNullWriteDestination {
  fn write_null(&mut self) {}
}

trait OrderedWriterDestination {}

pub trait OrderedWrite {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination);
}

pub trait OrderedWriteNull {
  fn ordered_write_null(destination: &mut impl OrderedNullWriteDestination);
}

pub trait IndexedReadSource {
  fn read_u8(&mut self, index: Index) -> Result<u8, ()> {
    todo!()
  }

  fn read_u16(&mut self, index: Index) -> Result<u16, ()> {
    todo!()
  }

  fn read_u32(&mut self, index: Index) -> Result<u32, ()> {
    todo!()
  }

  fn read_u64(&mut self, index: Index) -> Result<u64, ()> {
    todo!()
  }

  fn read_i8(&mut self, index: Index) -> Result<i8, ()> {
    todo!()
  }

  fn read_i16(&mut self, index: Index) -> Result<i16, ()> {
    todo!()
  }

  fn read_i32(&mut self, index: Index) -> Result<i32, ()> {
    todo!()
  }

  fn read_i64(&mut self, index: Index) -> Result<i64, ()> {
    todo!()
  }

  fn read_scalar<Scalar>(&mut self, index: Index) -> Result<Scalar, ()> {
    todo!()
  }

  fn read_compound<Compound>(&mut self, indexes: &Compound::Indexes) -> Result<Compound, ()> 
  where 
    Compound: CompoundIndexedRead
  {
    todo!()
  }
}

pub trait ScalarIndexedRead {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()>;

  fn indexed_read(source: &mut impl IndexedReadSource) -> Result<Self, ()> {
    todo!()
  }
}

pub trait CompoundIndexedRead {
  type Indexes;

  fn internal_indexed_read(source: &mut impl IndexedReadSource, indexes: &Self::Indexes) -> Result<Self, ()>;

  fn indexed_read(source: &mut impl IndexedReadSource) -> Result<Self, ()> {
    todo!()
  }
}

// pub trait OrderedWriter {
//   fn ordered_write(&self);
// }

// Ordered write null implementations
impl OrderedWriteNull for Countdown {
  fn ordered_write_null(destination: &mut impl OrderedNullWriteDestination) {
    destination.write_null();
    destination.write_null();
  }
}

// Ordered write implementations
impl OrderedWrite for u8 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    
  }
}

impl OrderedWrite for u16 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for u32 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for u64 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for i8 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for i16 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for i32 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for i64 {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for &str {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
      
  }
}

impl OrderedWrite for Time {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.as_timestamp().ordered_write(destination);
  }
}

impl OrderedWrite for Duration {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.as_total_milliseconds().ordered_write(destination);
  }
}

impl OrderedWrite for Instant {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.as_elapsed_time().ordered_write(destination);
  }
}

impl OrderedWrite for TimeRange {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.from().ordered_write(destination);
    self.till().ordered_write(destination);
  }
}

impl OrderedWrite for Countdown {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.get_from().ordered_write(destination);
    self.get_total_duration().ordered_write(destination);
  }
}

impl OrderedWrite for MonotonicClock {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.total_elapsed_duration.ordered_write(destination);
    self.previous_synchronization_boottime.ordered_write(destination);
    self.previous_synchronization_realtime.ordered_write(destination);
    self.maximum_synchronization_interval.ordered_write(destination);
  }
}

impl OrderedWrite for OptionVariant {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.to_number().ordered_write(destination);
  }
}

impl<Some> OrderedWrite for Option<Some>
where 
  Some: OrderedWrite + OrderedWriteNull
{
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    match self {
      None => {
        OptionVariant::None.ordered_write(destination);
        Some::ordered_write_null(destination.as_ordered_write_null_destination());
      }
      Some(some) => {
        OptionVariant::Some.ordered_write(destination);
        some.ordered_write(destination);
      }
    }
  }
}
  
impl OrderedWrite for CountdownConditional {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.duration.ordered_write(destination);
    self.countdown.ordered_write(destination);
  }
}

impl OrderedWrite for CountdownAfterPleaConditional {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.duration.ordered_write(destination);
    self.countdown.ordered_write(destination);
  }
}

impl OrderedWrite for RuleEnablerVariant {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.to_number().ordered_write(destination);
  }
}

impl OrderedWrite for RuleEnabler {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    match self {
      RuleEnabler::Countdown(conditional) => {
        RuleEnablerVariant::Countdown.ordered_write(destination);
        conditional.ordered_write(destination);
      }
      RuleEnabler::CountdownAfterPlea(conditional) => {
        RuleEnablerVariant::CountdownAfterPlea.ordered_write(destination);
        conditional.ordered_write(destination);
      }
    }
  }
}

impl OrderedWrite for AlwaysRule {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.enabler.ordered_write(destination);
  }
}

impl OrderedWrite for TimeRangeRule {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.enabler.ordered_write(destination);
    self.condition.ordered_write(destination);
  }
}

impl OrderedWrite for TimeAllowanceRule {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.enabler.ordered_write(destination);
    self.allowance.ordered_write(destination);
  }
}

impl OrderedWrite for VaultName {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.as_ref().ordered_write(destination);
  }
}

impl OrderedWrite for VaultDatum {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.as_ref().ordered_write(destination);
  }
}

impl OrderedWrite for VaultProtectorVariant {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.to_number().ordered_write(destination);
  }
}

impl OrderedWrite for VaultProtector {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    match self {
      Self::CountdownAfterPlea(conditional) => {
        VaultProtectorVariant::CountdownAfterPlea.ordered_write(destination);
        conditional.ordered_write(destination);
      }
    }
  }
}

impl OrderedWrite for Vault {
  fn ordered_write(&self, destination: &mut impl OrderedWriteDestination) {
    self.name.ordered_write(destination);
    self.protector.ordered_write(destination);
  }
}

// Indexed read implementations
impl ScalarIndexedRead for u8 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for u16 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for u32 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for u64 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for i8 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for i16 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for i32 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for i64 {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    todo!()
  }
}

impl ScalarIndexedRead for Duration {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    Ok(Duration::from_milliseconds(source.read_scalar(index)?))
  }
}

impl ScalarIndexedRead for Instant {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    Ok(Instant::from_elapsed_time(source.read_scalar(index)?))
  }
}

impl ScalarIndexedRead for Time {
  fn internal_indexed_read(source: &mut impl IndexedReadSource, index: Index) -> Result<Self, ()> {
    Ok(Time::from_timestamp(timestamp))
  }
}
pub struct TimeIndexes {
  pub timestamp: Index,
}

pub struct DurationIndexes {
  pub total_milliseconds: Index,
}

pub struct InstantIndexes {
  pub elapsed_time: DurationIndexes,
}

pub struct TimeRangeIndexes {
  pub from: TimeIndexes,
  pub till: TimeIndexes,
}

pub struct CountdownIndexes {
  pub from: InstantIndexes,
  pub duration: DurationIndexes,
}