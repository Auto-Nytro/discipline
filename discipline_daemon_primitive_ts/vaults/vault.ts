import { VaultName, VaultData, Countdown, Instant, Duration } from "../x.ts";

export class Vault {
  static readonly maximumProtectionDuration = Duration.fromMillisecondsOrThrow(1000 * 60 * 60 * 24 * 7);

  private constructor(
    private readonly name: VaultName,
    private readonly data: VaultData,
    private protection: Countdown,
  ) {}

  static create(
    name: VaultName,
    data: VaultData,
    protection: Countdown,
  ): Vault {
    return new Vault(
      name,
      data,
      protection,
    );
  }
  
  static construct(
    name: VaultName,
    data: VaultData,
    protection: Countdown,
  ) {
    return new Vault(name, data, protection);
  }

  getName(): VaultName {
    return this.name;
  }
  
  getData(): VaultData {
    return this.data;
  }
  
  getProtection(): Countdown {
    return this.protection;
  }

  isProtected(now: Instant) {
    return this.protection.isRunning(now);
  }

  extendProtectionByOrSetToMaxSafeValue(now: Instant, factor: Duration) {
    if (this.protection.isFinished(now)) {
      this.protection = Countdown.create(
        now,
        Vault
          .maximumProtectionDuration
          .min(factor),
      );
    } else {
      const remaining = this.protection.getRemainingTimeOrZero(now);
      const maximum = Vault.maximumProtectionDuration;

      if (factor.plusOrMax(remaining).isLongerThan(maximum)) {
        factor = maximum.minusOrZero(remaining);
      }

      this.protection.extendByOrSetToMax(factor);
    }
  }
}