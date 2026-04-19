import { Duration, Unique } from "@internal/prelude";

const BRAND = Symbol();

export type Instant = Unique<typeof BRAND, "Instant", Duration>;

const construct = (elapsedTime: Duration): Instant => {
  return elapsedTime as Instant;
};

const fromElapsedTime = (elapsedTime: Duration): Instant => {
  return construct(elapsedTime);
};

const isAt = (lhs: Instant, rhs: Instant): boolean => {
  return Duration.isEqualTo(lhs, rhs);
};

const isEarilerThan = (lhs: Instant, rhs: Instant): boolean => {
  return Duration.isShorterThan(lhs, rhs);
};

const isEarilerThanOrAt = (lhs: Instant, rhs: Instant): boolean => {
  return Duration.isShorterThanOrEqualTo(lhs, rhs);
};

const isLaterThan = (lhs: Instant, rhs: Instant): boolean => {
  return Duration.isLongerThan(lhs, rhs);
};

const isLaterThanOrAt = (lhs: Instant, rhs: Instant): boolean => {
  return Duration.isLongerThanOrEqualTo(lhs, rhs);
};

const tillOrZero = (lhs: Instant, rhs: Instant): Duration => {
  return Duration.saturatingSub(lhs, rhs);
};

const sinceOrZero = (lhs: Instant, rhs: Instant): Duration => {
  return Duration.saturatingSub(rhs, lhs);
};

const saturatingSub = (it: Instant, duration: Duration): Instant => {
  return construct(Duration.saturatingSub(it, duration));
};

const saturatingAdd = (it: Instant, duration: Duration): Instant => {
  return construct(Duration.saturatingAdd(it, duration));
};

const toElapsedTime = (it: Instant): Duration => {
  return it;
};

export const Instant = {
  fromElapsedTime,
  isAt,
  isEarilerThan,
  isEarilerThanOrAt,
  isLaterThan,
  isLaterThanOrAt,
  tillOrZero,
  sinceOrZero,
  saturatingSub,
  saturatingAdd,
  toElapsedTime,
};