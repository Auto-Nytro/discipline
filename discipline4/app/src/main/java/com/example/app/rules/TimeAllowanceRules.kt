package com.example.app

public data class TimeAllowanceRules(
  private val rules: MutableMap<UuidV4, TimeAllowanceRule>
) {
  companion object {
    fun createDefault(): TimeAllowanceRules {
      return TimeAllowanceRules(rules = mutableMapOf())
    }
  }

  fun has(id: UuidV4): Boolean {
    return rules.containsKey(id)
  }

  fun get(id: UuidV4): TimeAllowanceRule? {
    return rules.get(id)
  }

  fun add(id: UuidV4, rule: TimeAllowanceRule) {
    rules.set(id, rule)
  }

  fun remove(id: UuidV4) {
    rules.remove(id)
  }

  fun someAreEnabled(now: Instant): Boolean {
    return rules.values.any { it.isEnabled(now) }
  }

  fun someAreActive(now: Instant, usedAllowance: Duration): Boolean {
    return rules.values.any { it.isActive(now, usedAllowance) }
  }
}