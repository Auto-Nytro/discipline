package com.example.app

public data class AlwaysRules(
  private val rules: MutableMap<UuidV4, AlwaysRule>,
) {
  companion object {
    fun createDefault(): AlwaysRules {
      return AlwaysRules(rules = mutableMapOf())
    }
  }

  fun has(id: UuidV4): Boolean {
    return rules.containsKey(id)
  }

  fun get(id: UuidV4): AlwaysRule? {
    return rules.get(id)
  }

  fun add(id: UuidV4, rule: AlwaysRule) {
    rules.set(id, rule)
  }

  fun remove(id: UuidV4) {
    rules.remove(id)
  }

  fun someAreEnabled(now: Instant): Boolean {
    return rules.values.any { it.isEnabled(now) }
  }

  fun someAreActive(now: Instant): Boolean {
    return rules.values.any { rule -> rule.isActive(now) }
  }
}
