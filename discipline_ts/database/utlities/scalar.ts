import { ScalarRead, ScalarWrite } from "@internal/database/prelude";

export interface Scalar<Value> extends 
  ScalarRead<Value>, 
  ScalarWrite<Value> 
{
  readonly name: string,
}

export const ScalarAdapter = {
  implement: <Value>(initializer: Scalar<Value>): Scalar<Value> => {
    return initializer;
  },
};