import { Unique } from "@internal/prelude";

const BRAND = Symbol();
export type Float = Unique<typeof BRAND, "Float", number>;
