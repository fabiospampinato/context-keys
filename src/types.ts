
/* MAIN */

type Disposer = () => void;

type ChangeHandlerGlobal = () => void;
type ChangeHandlerLocal = ( value: boolean ) => void;
type ChangeHandlerData = ExpressionData & { handler: ChangeHandlerLocal, value: boolean | undefined };

type Expression = string;
type ExpressionContext = Record<string, unknown>;
type ExpressionFunction = ( context: ExpressionContext ) => boolean;
type ExpressionData = { expression: Expression, keys: Key[], fn: ExpressionFunction };

type Key = string;
type Value = (() => unknown) | unknown;

/* EXPORT */

export type {Disposer};
export type {ChangeHandlerGlobal, ChangeHandlerLocal, ChangeHandlerData};
export type {Expression, ExpressionContext, ExpressionFunction, ExpressionData};
export type {Key, Value};
