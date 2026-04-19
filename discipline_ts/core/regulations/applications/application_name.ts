import { Unique, TextualError, Tried } from "@internal/prelude"

const BRAND = Symbol();

type RawApplicationName = string;

export type ApplicationName = Unique<typeof BRAND, "AndroidApplicationName", RawApplicationName>;

const MINIMUM_LENGTH = 1;
const MAXIMUM_LENGTH = 30;

const construct = (string: string): ApplicationName => {
  return string satisfies RawApplicationName as ApplicationName;
};

const wrapOrThrow = (string: string): ApplicationName => {
  if (string.length < MINIMUM_LENGTH) {
    const it = TextualError.create("Creating an ApplicationName from string");
    TextualError.addMessage(it, "String's length is less than the minimum valid length");
    TextualError.addStringAttachment(it, "String", string);
    TextualError.addNumberAttachment(it, "String length", string.length);
    TextualError.addNumberAttachment(it, "Minimum valid length", MINIMUM_LENGTH);
    throw TextualError.toJsError(it);
  }

  if (string.length > MAXIMUM_LENGTH) {
    const it = TextualError.create("Creating an ApplicationName from string");
    TextualError.addMessage(it, "String's length is greater than the maximum allowed length");
    TextualError.addStringAttachment(it, "String", string);
    TextualError.addNumberAttachment(it, "String length", string.length);
    TextualError.addNumberAttachment(it, "Maximum valid length", MAXIMUM_LENGTH);
    throw TextualError.toJsError(it);
  }

  return Tried.Success(construct(string));
};

const getValue = (it: ApplicationName): string => {
  return it;
};

export const ApplicationName = {
  wrapOrThrow,
  getValue,
};