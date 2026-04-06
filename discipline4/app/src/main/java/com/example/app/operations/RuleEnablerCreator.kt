package com.example.app

public sealed class RuleEnablerCreator {
  class Countdown(val duration: Duration) : RuleEnablerCreator() {}
  class CountdownAfterPlea(val intervalFromPleaTillDeactivation: Duration) : RuleEnablerCreator() {}

  fun create(): RuleEnabler {
    return when (this) {
      is Countdown -> {
        RuleEnabler.Countdown(CountdownConditional.create(duration))
      }
      is CountdownAfterPlea -> {
        RuleEnabler.CountdownAfterPlea(CountdownAfterPleaConditional.create(intervalFromPleaTillDeactivation))
      }
    }
  }
}