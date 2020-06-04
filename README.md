# Context Keys

Performant and feature rich library for managing context keys.

## Features

- **Universal**: this library works both in the browser and in Node.js.
- **Performant**: this library is about as fast as it gets, and it has 0 dependencies.
- **Flexible**: Context keys can be primitives, arrays or plain objects.
- **Expressive**: Expressions are written in a full-fledged subset of JavaScript, this allows you to write complex expressions like `isFoo && ( !isBar || settings.foo[3] === "foo" )`.
- **Batching**: changes are batched and coalesced together for performance automatically.

## Expression Syntax

An expression is a string which will be evalued to a boolean, you'll use expressions to query your context keys.

Expressions are written in a subset of JavaScript where only the following features are enabled:

- **Primitives**: `null`, `true`, `false`, `number`, `string`.
- **Logical operators**: `&&`, `||`.
- **Equality operators**: `===`, `!==`, `==`, `!=`.
- **Relational operators**: `<=`, `>=`, `<`, `>`.
- **Ternary operator**: `? :`.
- **Additive operators**: `+`, `-`.
- **Multiplicative operators**: `*`, `/`, `%`.
- **Bitwise operators**: `|`, `^`, `&`.
- **Shift operators**: `<<`, `>>>`, `>>`.
- **Unary operators**: `+`, `-`, `~`, `!`.
- **Property access**: `[]`, `.`.
- **Parentheses groups**: `(`, `)`.
- **Variables**: all your context keys will be accessible as if they were regular variables, but you can't define new ones in an expression.

Basically an expression is what you'd usually put inside an `if` statement.

## Install

```sh
npm install --save context-keys
```

## Usage

The following interface is provided:

```ts
type Value = null | boolean | number | string | Array<Value> | { [key: string]: Value } | () => Value;
type Values = Record<string, Value>;
type Key = string;
type Keys = Record<string, Value | undefined>;
type Expr = string;
type ChangeAllHandler = () => void;
type ChangeHandler = ( value: boolean ) => void;
type Disposer = () => void;

class ContextKeys {

  constructor ( keys?: Keys ); // Create a new instance, optionally adding an object of context keys

  has ( key: Key : boolean; // Checks if a context key is defined

  add ( key: Key, value: Value ): void; // Add a single context key
  add ( keys: Keys ): void; // Add an object of context keys

  set ( key: Key, value: Value ): void; // An alias for the "add" method
  set ( keys: Keys ): void; // And alias for the "add" method

  remove ( key: Key ): void; // Remove a single context key
  remove ( keys: Key[] ): void; // Remove an array of context keys
  remove ( keys: Keys ): void; // Remove an object of context keys

  reset (): void; // Remove all context keys and change handlers

  get ( key: Key ): Value | undefined; // Get the value of a context key
  get ( keys: Key[] ): Values; // Get the value of an array of context keys
  get (): Values; // Get the value of all context keys

  eval ( expression: Expr ): boolean; // Evaluate an expression to a boolean

  onChange ( handler: ChangeAllHandler ): Disposer; // Register a callback which will be called whenever any context key changes
  onChange ( expression: Expr, handler: ChangeHandler ): Disposer; // Register a callback which will be called whenever the value of the expression changes. Call the disposer to unregister the callback

}
```

You can use it like this:

```ts
import ContextKeys from 'context-keys';

const ck = new ContextKeys ({ foo: true }); // Create a new instance with an object of context keys

ck.reset (); // Remove all context keys

ck.add ({ // Add multiple context keys
  isFoo: true,
  isBar: false,
  settings: {
    foo: [1, 2, 3]
    bar: true
  }
});

ck.add ( 'isBaz', false ); // Add a single context key

ck.remove ( 'isBaz' ); // Remove a single context key

console.log ( ck.get ( 'isFoo' ) ); // => true
console.log ( ck.get ( 'isBaz' ) ); // => undefined

console.log ( ck.eval ( 'isFoo || isBar' ) ); // => true
console.log ( ck.eval ( 'isFoo && ( isBar || !settings.bar || settings.foo.length > 1 )' ) ); // => true

ck.onChange ( () => { // Register a general onChange handler
  console.log ( 'Something changed!' );
});

ck.onChange ( 'isFoo', value => { // Register an onChange handler
  console.log ( 'isFoo changed!' );
});

ck.set ( 'isFoo', true ); // Same value as before, no change handlers are called
ck.set ( 'isFoo', false ); // The related change handlers are called
```

Check also our [test suite](./test/index.js) for more examples.

## License

MIT © Fabio Spampinato
