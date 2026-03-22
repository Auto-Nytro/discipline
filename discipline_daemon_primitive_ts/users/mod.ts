import { Conditional, DateTime, Duration, Instant } from "../x.ts";

export const enum UserNameEnum {
  Luny,
  Ruru,
}

export class UserName {
  private constructor(private value: UserNameEnum) {}

  static fromString(value: string) {
    if (value === "luny") {
      return new UserName(UserNameEnum.Luny);
    }
    if (value === "ruru") {
      return new UserName(UserNameEnum.Ruru);
    }
    return new Error(`Creating UserName from string: Expected string to be 'luny' or 'ruru' but found: '${value}'`);
  }

  getEnum() {
    return this.value;
  }
}

export class UserRegulation {
  constructor(
    public screen: Conditional[],
    public internet: Conditional[],
  ) {}

  static construct(
    screen: Conditional[],
    internet: Conditional[],
  ) {
    return new UserRegulation(screen, internet);
  }

  static create() {
    return new UserRegulation(
      [],
      [],
    );
  }

  shouldBlockScreen(
    instant: Instant,
    datetime: DateTime,
    dailyUptime: Duration,
  ) {
    return this.screen.some(it => Conditional.isActive(
      it,
      instant,
      datetime,
      dailyUptime,
    ));
  }

  shouldBlockInternet(
    instant: Instant,
    datetime: DateTime,
    dailyUptime: Duration,
  ) {
    return this.screen.some(it => Conditional.isActive(
      it,
      instant,
      datetime,
      dailyUptime,
    ));
  }
}
