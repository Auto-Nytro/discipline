import { ConditionalTag, Duration, Countdown, ConditionalTypeUptimeAllowance, TextualError } from "../x.ts";

export class UptimeAllowanceConditional {
  readonly tag = ConditionalTag.UptimeAllowance;
  readonly type = ConditionalTypeUptimeAllowance.it;

  private constructor(
    readonly allowance: Duration,
    readonly lifetime: Countdown,
  ) {}

  static MINIMUM_ALLOWANCE = Duration.fromHoursOrThrow(1);
  static MAXIMUM_ALLOWANCE = Duration.fromHoursOrThrow(24);
  static MAXIMUM_LIFETIME = Duration.fromHoursOrThrow(24 * 3);

  static create(
    allowance: Duration,
    lifetime: Countdown,
  ) {
    if (allowance.isShorterThan(this.MINIMUM_ALLOWANCE)) {
      return TextualError
        .create("Creating 'UptimeAllowanceConditional'")
        .addMessage("Allowance is too short")
        .addStringAttachment("Minimum allowance", this.MINIMUM_ALLOWANCE.toString2())
        .addStringAttachment("Provided allowance", allowance.toString2());
    }

    if (allowance.isLongerThan(this.MAXIMUM_ALLOWANCE)) {
      return TextualError
        .create("Creating 'UptimeAllowanceConditional'")
        .addMessage("Allowance is too long")
        .addStringAttachment("Maximum allowance", this.MAXIMUM_ALLOWANCE.toString2())
        .addStringAttachment("Provided allowance", allowance.toString2());
    }

    if (lifetime.getTotalDuration().isLongerThan(this.MAXIMUM_LIFETIME)) {
      return TextualError
        .create("Creating 'UptimeAllowanceConditional'")
        .addMessage("Lifetime is too long")
        .addStringAttachment("Maximum lifetime", this.MAXIMUM_LIFETIME.toString2())
        .addStringAttachment("Provided lifetime", lifetime.getTotalDuration().toString2());
    }

    return new UptimeAllowanceConditional(
      allowance,
      lifetime,
    );
  }

  static construct(
    allowance: Duration,
    lifetime: Countdown,
  ) {
    return new UptimeAllowanceConditional(
      allowance,
      lifetime,
    );
  }

  getTotalAllowance(): Duration {
    return this.allowance;
  }
  
  getRemainingAllowance(dailyUptime: Duration): Duration {
    return this.allowance.minusOrZero(dailyUptime);
  }
  
  isAllowanceUp(dailyUptime: Duration): boolean {
    return dailyUptime.isLongerThan(this.allowance);
  }

  getLifetime(): Countdown {
    return this.lifetime;
  }
}