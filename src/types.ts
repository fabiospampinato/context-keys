
/* MAIN */

type Disposer = () => void;

type ChangeHandler = ( value: boolean ) => void;
type ChangeHandlerAll = () => void;
type ChangeHandlerData = ExpressionData & { handler: ChangeHandler, value: boolean | undefined };

type Expression = string;
type ExpressionContext = Record<string, unknown>;
type ExpressionFunction = ( context: ExpressionContext ) => boolean;
type ExpressionData = { expression: Expression, keys: Key[], fn: ExpressionFunction };

type Key = string;
type Value = (() => unknown) | unknown;

/* EXPORT */

export type {Disposer};
export type {ChangeHandler, ChangeHandlerAll, ChangeHandlerData};
export type {Expression, ExpressionContext, ExpressionFunction, ExpressionData};
export type {Key, Value};
