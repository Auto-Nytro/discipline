package com.example.app

public sealed class RuleEnabler {
  class Countdown(val it: CountdownConditional) : RuleEnabler() {}
  class CountdownAfterPlea(val it: CountdownAfterPleaConditional) : RuleEnabler() {}

  fun isActive(now: Instant): Boolean {
    return when (this) {
      is Countdown -> {
        it.isActive(now)
      }
      is CountdownAfterPlea -> {
        it.isActiveOrDeactivating(now)
      }
    }
  }
}