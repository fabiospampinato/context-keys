
/* TYPES */

type Value = ValuePrimitive | ValueArray | ValueObject;
type ValuePrimitive = null | boolean | number | string;
interface ValueArray extends Array<Value> {}
type ValueObject = { [key: string]: Value };
type Values = Record<string, Value>;

type Key = string;
type Keys = Record<string, Value | undefined>;

type Expr = string;
type ExprFN = () => boolean;
type ExprData = {
  expression: Expr,
  keys: Key[],
  fn: ExprFN
};

type ChangeHandler = ( value: boolean ) => void;
type ChangeHandlerData = {
  handler: ChangeHandler,
  value: boolean
};
type ChangeHandlersTree = Record<Key, Record<Expr, ChangeHandlerData[]>>;

type Disposer = () => void;

/* EXPORT */

export {Value, Values, Key, Keys, Expr, ExprFN, ExprData, ChangeHandler, ChangeHandlerData, ChangeHandlersTree, Disposer};
