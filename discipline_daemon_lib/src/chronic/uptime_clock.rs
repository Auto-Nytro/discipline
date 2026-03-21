// use std::time::{SystemTime, UNIX_EPOCH};
// use chrono::Datelike;

use crate::x::{DateTime, Duration};

pub struct UserUptimeClock {
  total_daily_uptime: Duration,
  previous_synchronization_time: Option<DateTime>,
  synchronization_interval: Duration,
  is_running: bool,
}

impl Default for UserUptimeClock {
  fn default() -> Self {
    UserUptimeClock {
      total_daily_uptime: Duration::zero(),
      previous_synchronization_time: None,
      // TODO
      synchronization_interval: Duration::from_minutes_or_panic(340282366920938463463374607431768211455),
      is_running: false,
    }
  }
}

impl UserUptimeClock {
  pub fn construct(
    total_daily_uptime: Duration,
    previous_synchronization_time: Option<DateTime>,
    synchronization_interval: Duration,
    is_running: bool,
  ) -> Self {
    Self {
      total_daily_uptime,
      previous_synchronization_time,
      synchronization_interval,
      is_running,
    }
  }

  pub fn get_total_daily_uptime(&self) -> Duration {
    self.total_daily_uptime
  }

  pub fn previous_synchronization_time(&self) -> Option<DateTime> {
    self.previous_synchronization_time
  }

  pub fn synchronization_interval(&self) -> Duration {
    self.synchronization_interval
  }

  // calculate the duration since last synchronization
  //
  pub fn synchronize(&mut self) {
    // TODO: This might panic! Handle gracefully.
    let now = DateTime::now();
    
    let previous_synchronization_time = match self.previous_synchronization_time {
      None => {
        self.previous_synchronization_time = Some(now);
        return;
      }
      Some(time) => {
        time
      }
    };

    let interval = previous_synchronization_time
      .till_or_zero(now);

    // TODO: Log an error if "clock.milliseconds" reaches the maximum value for
    // "u64".
    self.total_daily_uptime = self
      .total_daily_uptime
      .plus_or_zero(interval);

    // TODO: Update the database, too.
  }
}

// pub struct SharedUptimeClock {
//   clock: Arc<RwLock<UptimeClock>>,
// }

// fn synchronization_loop_iteration(clock: &mut UptimeClock) {
//   let current_time = DateTime::now();

//   let previous_synchronization_time = match clock.previous_synchronization_time {
//     None => {
//       clock.previous_synchronization_time = Some(current_time);
//       return;
//     }
//     Some(time) => {
//       time
//     }
//   };

//   let interval = previous_synchronization_time
//     .till_or_zero(current_time);

//   // TODO: Log an error if "clock.milliseconds" reaches the maximum value for
//   // "u64".
//   clock.total_daily_uptime = clock.total_daily_uptime.saturating_add(interval.milliseconds());

//   // TODO: Update the database, too.
// }

// impl SharedUptimeClock {
//   pub async fn start_synchronization_loop(self) {
//     loop {
//       let mut clock_guard = self.clock.write().await;
//       let clock = &mut *clock_guard;
//       let interval = clock.synchronization_interval.to_std_duration();
      
//       synchronization_loop_iteration(clock);
//       drop(clock_guard);
//       sleep(interval).await;
//     }
//   }
// }

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct MonotonicInstant {
  timestamp: u64,
}

impl MonotonicInstant {
  pub const MAX: MonotonicInstant = MonotonicInstant { timestamp: u64::MAX };

  pub fn from_timestamp(timestamp: u64) -> Self {
    Self { timestamp }
  }
  
  pub fn is_eariler_than(self, other: MonotonicInstant) -> bool {
    self.timestamp < other.timestamp
  }

  pub fn is_later_than(self, other: MonotonicInstant) -> bool {
    self.timestamp > other.timestamp
  }

  pub fn is_at(self, other: MonotonicInstant) -> bool {
    self.timestamp == other.timestamp
  }

  pub fn since_or_zero(self, other: MonotonicInstant) -> Duration {
    self
      .timestamp
      .checked_sub(other.timestamp)
      .map(Duration::from_milliseconds)
      .unwrap_or_else(Duration::zero)
  }

  pub fn till_or_zero(self, other: MonotonicInstant) -> Duration {
    other
      .timestamp
      .checked_sub(self.timestamp)
      .map(Duration::from_milliseconds)
      .unwrap_or_else(Duration::zero)
  }

  pub fn plus_or_max(self, duration: Duration) -> MonotonicInstant {
    self
      .timestamp
      .checked_add(duration.milliseconds())
      .map(MonotonicInstant::from_timestamp)
      .unwrap_or(MonotonicInstant::MAX)
  }
  
  pub fn timestamp(&self) -> u64 {
    self.timestamp
  }
}

// mod serialization {
//   use serde::{Serialize, Deserialize};
//   use super::{MonotonicInstant};

//   impl Serialize for MonotonicInstant {
//     fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
//     where
//       S: serde::Serializer 
//     {
//       self.timestamp.serialize(serializer)
//     }
//   }

//   impl<'a> Deserialize<'a> for MonotonicInstant {
//     fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
//     where
//       D: serde::Deserializer<'a> 
//     {
//       u64::deserialize(deserializer).map(|timestamp| MonotonicInstant { timestamp })
//     }
//   }
// }
