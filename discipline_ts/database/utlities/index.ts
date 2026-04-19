import { Unique } from "@internal/prelude";

const BRAND = Symbol();

/**
 * A SQLite column index used to access fields from the result of a SELECT statement.
 */
export type Index = Unique<typeof BRAND, "Index", number>;