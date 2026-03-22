import { Branded, TextualError, Tried } from "../x.ts";
import {} from "node:sqlite";

const BRAND = Symbol();

export type Database = Branded<typeof BRAND, {

}>;

export const Database = {
  open(path: string): Tried<Database, TextualError> {
    
  },
};

