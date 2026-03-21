use serde::{Deserialize, Serialize};
use crate::x::{Duration, MonotonicInstant};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CountdownStatus {
  Pending,
  Running,
  Finished,
}

impl CountdownStatus {
  pub fn is_pending(self) -> bool {
    matches!(self, CountdownStatus::Pending)
  }

  pub fn is_running(self) -> bool {
    matches!(self, CountdownStatus::Running)
  }

  pub fn is_finished(self) -> bool {
    matches!(self, CountdownStatus::Finished)
  }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Countdown {
  pub from: MonotonicInstant,
  pub duration: Duration,
}

impl Countdown {
  pub fn create(from: MonotonicInstant, duration: Duration) -> Self {
    Self {
      from,
      duration,
    }
  }

  pub fn construct(from: MonotonicInstant, duration: Duration) -> Countdown {
    Self { 
      from, 
      duration,
    }
  }

  pub fn get_from(&self) -> MonotonicInstant {
    self.from
  }

  pub fn get_till(&self) -> MonotonicInstant {
    self.from.plus_or_max(self.duration)
  }

  pub fn get_total_duration(&self) -> Duration {
    self.duration
  }

  pub fn set_total_duration(&mut self, new_value: Duration) {
    self.duration = new_value;
  }

  pub fn get_duration_till_start_or_zero(&self, now: MonotonicInstant) -> Duration {
    now.till_or_zero(self.from)
  }

  pub fn get_duration_since_start_or_zero(&self, now: MonotonicInstant) -> Duration {
    now.since_or_zero(self.from)
  }

  pub fn get_elapsed_time_or_zero(&self, now: MonotonicInstant) -> Duration {
    self.get_duration_since_start_or_zero(now).min(self.duration)
  }

  pub fn get_remaining_time_or_zero(&self, now: MonotonicInstant) -> Duration {
    self.get_total_duration().minus_or_zero(self.get_elapsed_time_or_zero(now))
  }

  pub fn get_time_till_finish_or_zero(&self, now: MonotonicInstant) -> Duration {
    now.till_or_zero(self.get_till())
  }

  pub fn get_status(&self, now: MonotonicInstant) -> CountdownStatus {
    if now.is_eariler_than(self.from) {
      return CountdownStatus::Pending;
    } 
    
    let elapsed_time = self.get_elapsed_time_or_zero(now);
    if elapsed_time.is_shorter_than_or_equal_to(self.duration) {
      return CountdownStatus::Running;
    }
    
    CountdownStatus::Finished
  }

  // todo: delete
  pub fn get_remaining_duration_or_zero(&self, now: MonotonicInstant) -> Duration {
    match self.get_status(now) {
      CountdownStatus::Pending => {
        self.duration
      }
      CountdownStatus::Running => {
        self.duration.minus_or_zero(self.from.till_or_zero(now))
      }
      CountdownStatus::Finished => {
        Duration::zero()
      }
    }
  }

  pub fn is_pending(&self, now: MonotonicInstant) -> bool {
    self.get_status(now).is_pending()
  }

  pub fn is_running(&self, now: MonotonicInstant) -> bool {
    self.get_status(now).is_running()
  }

  pub fn is_finished(&self, now: MonotonicInstant) -> bool {
    self.get_status(now).is_finished()
  }
}