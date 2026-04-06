package com.example.app

public data class TimeRangeRules(
  private val rules: MutableMap<UuidV4, TimeRangeRule>,
) {
  companion object {
    fun createDefault(): TimeRangeRules {
      return TimeRangeRules(rules = mutableMapOf())
    }
  }

  fun has(id: UuidV4): Boolean {
    return rules.containsKey(id)
  }

  fun get(id: UuidV4): TimeRangeRule? {
    return rules.get(id)
  }

  fun add(id: UuidV4, rule: TimeRangeRule) {
    rules.set(id, rule)
  }

  fun remove(id: UuidV4) {
    rules.remove(id)
  }

  fun someAreEnabled(now: Instant): Boolean {
    return rules.values.any { it.isEnabled(now) }
  }

  fun someAreActive(instant: Instant, time: Time): Boolean {
    return rules.values.any { rule -> rule.isActive(instant, time) }
  }
}