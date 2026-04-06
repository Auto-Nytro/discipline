use crate::x::UuidV4;

pub enum RuleEnablerLocation<'a> {
  A(&'a str)
}
pub enum CountdownConditionalLocation<'a> {
  A(&'a str)

}
pub enum CountdownAfterPleaConditionalLocation<'a> {
  A(&'a str)

}

pub enum AlwaysRuleLocation<'a> {
  UserProfileScreenRegulation { user_profile_id: &'a UuidV4 },
  UserProfileDeviceRegulation { user_profile_id: &'a UuidV4 },
  UserProfileInternetRegulation { user_profile_id: &'a UuidV4 },
}
pub enum LocationError {
  NoSuchUserProfile,
  ReachedMaximumAllowedForThisUserProfile,
}

// impl AlwaysRuleLocation {
//   pub fn before_create<'a>(&self, state: &'a mut State) -> Result<CreateContext<'a>, LocationError> {
//     match self {
//       Self::UserProfileDeviceRegulation { user_profile_id } => {
//         let Some(user_profile) = state.user_profiles.get_profile_given_id_mut(user_profile_id) else {
//           return Err(LocationError::NoSuchUserProfile);
//         };
//         if user_profile.rules_stats.reached_maximum_allowed_always_rules() {
//           return Err(LocationError::ReachedMaximumAllowedForThisUserProfile);
//         }
//         return Ok(CreateContext {
//           rules: &mut user_profile.device_access_regulation.always_rules,
//           stats: &mut state.rules_stats,
//           monotonic_clock: &state.monotonic_clock,
//         })
//       }
//       _ => {
//         todo!()
//       }
//     }
//   }

// }

// impl AlwaysRuleLocation {
//   pub fn get_context<'a>(&'a self, daemon: &'a Daemon) -> Option<AlwaysRuleContext<'a>> {
//     Some(match self {
//       AlwaysRuleLocation::UserProfileDeviceRegulation { user_profile_id } => {
//         AlwaysRuleContext::UserProfileDeviceRegulation { 
//           user_profile_id, 
//           user_profile: daemon.state.user_profiles.get_profile_given_id(user_profile_id)?,
//         }
//       }
//       AlwaysRuleLocation::UserProfileInternetRegulation { user_profile_id } => {
//         AlwaysRuleContext::UserProfileInternetRegulation { 
//           user_profile_id, 
//           user_profile: daemon.state.user_profiles.get_profile_given_id(user_profile_id)?,
//         }
//       }
//       AlwaysRuleLocation::UserProfileScreenRegulation { user_profile_id } => {
//         AlwaysRuleContext::UserProfileScreenRegulation { 
//           user_profile_id, 
//           user_profile: daemon.state.user_profiles.get_profile_given_id(user_profile_id)?,
//         }
//       }
//     })
//   }

//   pub fn get_context_mut<'a>(&'a self, daemon: &'a mut Daemon) -> Option<AlwaysRuleContextMut<'a>> {
//     Some(match self {
//       AlwaysRuleLocation::UserProfileDeviceRegulation { user_profile_id } => {
//         AlwaysRuleContextMut::UserProfileDeviceRegulation { 
//           user_profile_id, 
//           user_profile: daemon.state.user_profiles.get_profile_given_id_mut(user_profile_id)?,
//         }
//       }
//       AlwaysRuleLocation::UserProfileInternetRegulation { user_profile_id } => {
//         AlwaysRuleContextMut::UserProfileInternetRegulation { 
//           user_profile_id, 
//           user_profile: daemon.state.user_profiles.get_profile_given_id_mut(user_profile_id)?,
//         }
//       }
//       AlwaysRuleLocation::UserProfileScreenRegulation { user_profile_id } => {
//         AlwaysRuleContextMut::UserProfileScreenRegulation { 
//           user_profile_id, 
//           user_profile: daemon.state.user_profiles.get_profile_given_id_mut(user_profile_id)?,
//         }
//       }
//     })
//   }
// }

// pub enum AlwaysRuleContext<'a> {
//   UserProfileScreenRegulation { user_profile_id: &'a UuidV4, user_profile: &'a UserProfile },
//   UserProfileDeviceRegulation { user_profile_id: &'a UuidV4, user_profile: &'a UserProfile },
//   UserProfileInternetRegulation { user_profile_id: &'a UuidV4, user_profile: &'a UserProfile }, 
// }

// pub enum AlwaysRuleContextMut<'a> {
//   UserProfileScreenRegulation { user_profile_id: &'a UuidV4, user_profile: &'a mut UserProfile },
//   UserProfileDeviceRegulation { user_profile_id: &'a UuidV4, user_profile: &'a mut UserProfile },
//   UserProfileInternetRegulation { user_profile_id: &'a UuidV4, user_profile: &'a mut UserProfile }, 
// }

// pub struct Create {
//   rule_location: AlwaysRuleLocation,
//   rule_id: Option<UuidV4>,
//   rule_enabler: RuleEnablerCreator,
// }