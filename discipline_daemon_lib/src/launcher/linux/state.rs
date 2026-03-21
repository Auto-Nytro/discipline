use crate::x::MonotonicClock;
use super::UserProfiles;

pub struct State {
  pub user_profiles: UserProfiles,
  pub monotonic_clock: MonotonicClock,
}