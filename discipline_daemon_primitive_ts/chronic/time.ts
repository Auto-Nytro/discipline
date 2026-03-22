import { Duration, TextualError } from "../x.ts";

export class Time {
  static readonly MINIMUM_TIMESTAMP = 0;
  static readonly MAXIMUM_TIMESTAMP = 1000 * 60 * 60 * 24 - 1;
  
  private constructor(private readonly timestamp: number) {}

  static fromTimestampOrNone(timestamp: number): Time | null {
    if (
      Number.isInteger(timestamp) 
      && 
      timestamp >= this.MINIMUM_TIMESTAMP
      &&
      timestamp <= this.MAXIMUM_TIMESTAMP
    ) {
      return new Time(timestamp);
    }
  
    return null;
  }

  static fromTimestamp(timestamp: number): Time | TextualError {
    if (!Number.isInteger(timestamp)) {
      return TextualError
        .create("Creating 'Time' from a millisecond timestamp since midnight")
        .addMessage("Argument 'timestamp' is not an integer")
        .addNumberAttachment("Argument", timestamp);
    }
    
    if (timestamp < Time.MINIMUM_TIMESTAMP) {
      return TextualError
        .create("Creating 'Time' from a millisecond timestamp since midnight")
        .addMessage("Argument 'timestamp' is less than the minimum valid value")
        .addNumberAttachment("Argument", timestamp)
        .addNumberAttachment("Minimum valid value", Time.MINIMUM_TIMESTAMP);
    }
    
    if (timestamp > Time.MAXIMUM_TIMESTAMP) {
      return TextualError
        .create("Creating 'Time' from a millisecond timestamp since midnight")
        .addMessage("Argument 'timestamp' is greater than the maximum valid value")
        .addNumberAttachment("Argument", timestamp)
        .addNumberAttachment("Maximum valid value", Time.MAXIMUM_TIMESTAMP);
    }

    return new Time(timestamp);
  }
  
  static fromTimestampOrThrow(timestamp: number): Time {
    if (
      Number.isInteger(timestamp) 
      && 
      timestamp >= Time.MINIMUM_TIMESTAMP
      &&
      timestamp <= Time.MAXIMUM_TIMESTAMP
    ) {
      return new Time(timestamp);
    }
  
    throw new Error(`Creating Time from a millisecond-based timestamp since midnight: Timestamp is invalid. Timestamp: ${JSON.stringify(timestamp)}`);
  }
  
  static fromHourAndMinuteAmOrThrow(hour: number, minute: number): Time {
    if (!Number.isInteger(hour)) {
      throw new Error("Creating Time from hour (AM) and minute: Hour is not integer");
    }
    if (hour < 0) {
      throw new Error("Creating Time from hour (AM) and minute: Hour is less than zero");
    }
    if (hour > 11) {
      throw new Error("Creating Time from hour (AM) and minute: Hour is greater than 11");
    }
    if (!Number.isInteger(minute)) {
      throw new Error("Creating Time from hour (AM) and minute: Minute is not integer");
    }
    if (minute < 0) {
      throw new Error("Creating Time from hour (AM) and minute: Minute less than zero");
    }
    if (minute > 59) {
      throw new Error("Creating Time from hour (AM) and minute: Minute is greater than 59");
    }
  
    return new Time(
      hour * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    )
  }
  
  static fromHourAndMinutePmOrThrow(hour: number, minute: number): Time {
    if (!Number.isInteger(hour)) {
      throw new Error("Creating Time from hour (PM) and minute: Hour is not integer");
    }
    if (hour < 0) {
      throw new Error("Creating Time from hour (PM) and minute: Hour is less than zero");
    }
    if (hour > 11) {
      throw new Error("Creating Time from hour (PM) and minute: Hour is greater than 11");
    }
    if (!Number.isInteger(minute)) {
      throw new Error("Creating Time from hour (PM) and minute: Minute is not integer");
    }
    if (minute < 0) {
      throw new Error("Creating Time from hour (PM) and minute: Minute less than zero");
    }
    if (minute > 59) {
      throw new Error("Creating Time from hour (PM) and minute: Minute is greater than 59");
    }
  
    return new Time(
      (12 + hour) * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    );
  }
  
  static fromHourAndMinuteOrThrow(hour: number, minute: number): Time {
    if (!Number.isInteger(hour)) {
      throw new Error(`Creating Time from hour and minute: Hour is not integer. Hour: ${hour}`);
    }
    if (hour < 0) {
      throw new Error(`Creating Time from hour and minute: Hour is less than zero. Hour: ${hour}`);
    }
    if (hour > 23) {
      throw new Error(`Creating Time from hour and minute: Hour is greater than 23. Hour: ${hour}`);
    }
    if (!Number.isInteger(minute)) {
      throw new Error(`Creating Time from hour and minute: Minute is not integer. Minute: ${hour}`);
    }
    if (minute < 0) {
      throw new Error(`Creating Time from hour and minute: Minute less than zero. Minute: ${minute}`);
    }
    if (minute > 59) {
      throw new Error(`Creating Time from hour and minute: Minute is greater than 59. Minute: ${minute}`);
    }
  
    return new Time(
      hour * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    );
  }

  static fromHourAndMinuteOrError(hour: number, minute: number): Time | Error {
    if (!Number.isInteger(hour)) {
      return new Error(`Creating Time from hour and minute: Hour is not integer. Hour: ${hour}`);
    }
    if (hour < 0) {
      return new Error(`Creating Time from hour and minute: Hour is less than zero. Hour: ${hour}`);
    }
    if (hour > 23) {
      return new Error(`Creating Time from hour and minute: Hour is greater than 23. Hour: ${hour}`);
    }
    if (!Number.isInteger(minute)) {
      return new Error(`Creating Time from hour and minute: Minute is not integer. Minute: ${hour}`);
    }
    if (minute < 0) {
      return new Error(`Creating Time from hour and minute: Minute less than zero. Minute: ${minute}`);
    }
    if (minute > 59) {
      return new Error(`Creating Time from hour and minute: Minute is greater than 59. Minute: ${minute}`);
    }
  
    return new Time(
      hour * Duration.MILLISECONDS_PER_HOUR
      +
      minute * Duration.MILLISECONDS_PER_MINUTE
    );
  }  
  
  getTimestamp(): number {
    return this.timestamp;
  }
  
  /**
   * @param me 
   * @returns a number from 0 to 23, inclusive both.
   */
  getHour(): number {
    return Math.floor(
      this.getTimestamp() 
      /
      Duration.MILLISECONDS_PER_HOUR
    );
  }
  /**
   * 
   * @param me 
   * @returns a number from 0 to 59, inclusive both.
   */
  getMinute(): number {
    return Math.floor(
      this.getTimestamp() 
      % 
      Duration.MILLISECONDS_PER_HOUR 
      / 
      Duration.MILLISECONDS_PER_MINUTE
    );
  }
  /**
   * 
   * @param me 
   * @returns a number from 0 to 59, inclusive both.
   */
  getSecond(): number {
    return Math.floor(
      this.getTimestamp()
      % 
      Duration.MILLISECONDS_PER_HOUR 
      %
      Duration.MILLISECONDS_PER_MINUTE
      /
      Duration.MILLISECONDS_PER_SECOND
    );
  }
  
  toString(): string {
    return `${
      this.getHour().toString()
    }:${
      this.getMinute().toString()
    }:${
      this.getSecond().toString()
    }`;
  }
}