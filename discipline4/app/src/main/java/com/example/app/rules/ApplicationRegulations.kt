package com.example.app

/**
 * Collection of rules for multiple applications
 */
public data class ApplicationRegulations private constructor(
  private val regulations: MutableMap<AppName, ApplicationRegulation>
) {
  companion object {
    fun create(rules: MutableMap<AppName, ApplicationRegulation>): ApplicationRegulations {
      return ApplicationRegulations(rules)
    }
    
    fun createDefault(): ApplicationRegulations {
      return ApplicationRegulations(mutableMapOf())
    }
  }
  
  fun add(app: AppName, rule: ApplicationRegulation) {
    regulations.set(app, rule)
  }
  
  fun remove(app: AppName) {
    regulations.remove(app)
  }

  fun get(app: AppName): ApplicationRegulation? {
    return regulations.get(app)
  }

  fun has(app: AppName): Boolean {
    return regulations.containsKey(app)
  }

  fun isApplicationRestricted(
    app: AppName,
    nowAsInstant: Instant,
    nowAsTime: Time,
    dailyUsedAllowance: Duration,
  ): Boolean {
    val regulation = regulations.get(app) ?: return false
    return regulation.isActive(nowAsInstant, nowAsTime, dailyUsedAllowance)
  }

  fun isActive(
    nowAsInstant: Instant,
    nowAsTime: Time,
    dailyUsedAllowance: Duration,
  ): Boolean {
    return regulations.values.any { 
      it.isActive(nowAsInstant, nowAsTime, dailyUsedAllowance) 
    }
  }

  fun isEnabled(now: Instant): Boolean {
    return regulations.values.any {
      it.isEnabled(now)
    }
  }
}