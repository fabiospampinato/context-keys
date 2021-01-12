
/* TYPES */

type Value = ValuePrimitive | ValueArray | ValueObject | ValueDynamic;
type ValuePrimitive = null | boolean | number | string;
type ValueArray = ValueStatic[];
type ValueObject = { [key: string]: ValueStatic };
type ValueDynamic = () => ValueStatic;
type ValueStatic = ValuePrimitive | ValueArray | ValueObject;
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

type ChangeAllHandler = () => void;
type ChangeHandler = ( value: boolean ) => void;
type ChangeHandlerData = {
  handler: ChangeHandler,
  value: boolean
};
type ChangeHandlersTree = Record<Key, Record<Expr, ChangeHandlerData[]>>;

type Disposer = () => void;
type Matcher = ( quasis: TemplateStringsArray, ...re: (string | RegExp | (() => string | RegExp))[] ) => any;
type Parser = ( src: string ) => string | undefined;

/* EXPORT */

export {Value, Values, Key, Keys, Expr, ExprFN, ExprData, ChangeAllHandler, ChangeHandler, ChangeHandlerData, ChangeHandlersTree, Disposer, Matcher, Parser};
