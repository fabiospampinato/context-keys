# Context Keys

Performant and feature rich library for managing context keys.

## Features

- **Universal**: this library works both in the browser and in Node.js.
- **Performant**: this library is about as fast as it gets, and it has just 2 tiny first-party dependencies.
- **Flexible**: context keys can be primitives, arrays or plain objects.
- **Expressive**: expressions are written in a full-fledged subset of JavaScript, this allows you to write complex expressions like `isFoo && ( !isBar || settings.foo[3] === "foo" )`.
- **Safe**: expressions are executed through [`safex`](https://github.com/fabiospampinato/safex), to ensure they are executed safely.
- **Batching**: changes happening within a microtask are batched and coalesced together for performance automatically.

## Install

```sh
npm install --save context-keys
```

## Usage

The following interface is provided:

```ts
type ChangeHandler = ( value: boolean ) => void;
type ChangeAllHandler = () => void;
type Disposer = () => void;
type Expression = string;
type Key = string;
type Value = unknown;

class ContextKeys {

  // Create a new instance, optionally with some context keys
  constructor ( keys?: Record<Key, Value> );

  // Evaluate an expression to a boolean
  eval ( expression: Expression ): boolean;

  // Get the value of a context key
  get ( key: Key ): Value | undefined;

  // Checks if a context key is defined
  has ( key: Key ) : boolean;

  // Remove single context key
  remove ( key: Key ): void;

  // Remove all context keys and change handlers
  reset (): void;

  // Add or update a context key
  set ( key: Key, value: Value ): void;

  // Register a callback which will be called whenever any context key changes
  onChange ( handler: ChangeAllHandler ): Disposer;
  // Register a callback which will be called whenever the value of the expression changes. Call the disposer to unregister the callback
  onChange ( expression: Expr, handler: ChangeHandler ): Disposer;

}
```

You can use it like this:

```ts
import ContextKeys from 'context-keys';

// Create a new instance, with some context keys already

const ck = new ContextKeys ({
  isFoo: true,
  isBar: false
});

// Evaluate an expression

ck.eval ( 'isFoo' ); // => true
ck.eval ( 'isBar' ); // => false
ck.eval ( 'isBaz' ); // => undefined
ck.eval ( 'isFoo && isBar || 123' ); // => 123

// Get the value of a context key

ck.get ( 'isFoo' ); // => true
ck.get ( 'isBar' ); // => false
ck.get ( 'isBaz' ); // => undefined

// Check if a context key is defined

ck.has ( 'isFoo' ); // => true
ck.has ( 'isBar' ); // => true
ck.has ( 'isBaz' ); // => undefined

// Set the value of a context key

ck.set ( isBar, true );
ck.set ( isBaz, 123 );

// Remove a context key

ck.remove ( 'isBaz' );

// Remove all context keys and change handlers

ck.reset ();

// Register a global onChange handler

ck.onChange ( () => {
  console.log ( 'Some context key changed!' );
});

// Register an expression-specific onChange handler

const dispose = ck.onChange ( 'isFoo', value => {
  console.log ( 'The result of the expression changed!' );
});

dispose (); // Dispose of that listener
```

## License

MIT © Fabio Spampinato
