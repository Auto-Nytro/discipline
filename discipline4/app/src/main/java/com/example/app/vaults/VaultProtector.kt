package com.example.app

public sealed class VaultProtector {
  class Countdown(val it: CountdownConditional) : VaultProtector() {}
  class CountdownAfterPlea(val it: CountdownAfterPleaConditional) : VaultProtector() {}

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