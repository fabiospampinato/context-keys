
/* IMPORT */

import isEqual from 'are-deeply-equal';
import Expr from './expression';
import {isString, isSymbol, isUndefined, noop, resolve} from './utils';
import type {Disposer} from './types';
import type {ChangeHandlerGlobal, ChangeHandlerLocal, ChangeHandlerData} from './types';
import type {Expression, ExpressionContext} from './types';
import type {Key, Value} from './types';

/* MAIN */

class ContextKeys {

  /* VARIABLES */

  private context: ExpressionContext;
  private keys: Record<Key | symbol, Value> = {};
  private handlersGlobal: Set<ChangeHandlerGlobal> = new Set ();
  private handlersLocal: Record<Key, Set<ChangeHandlerData>> = {};
  private scheduled: Set<Key> = new Set ();

  /* CONSTRUCTOR */

  constructor ( keys: Record<Key, Value> = {} ) {

    this.context = this.contextize ( this.keys );

    for ( const key in keys ) {

      this.set ( key, keys[key] );

    }

  }

  /* PRIVATE API */

  private contextize ( keys: Record<Key | symbol, Value> ) {

    // Proxy wrapper used to resolve lazy keys automatically

    return new Proxy ( keys, {
      get: ( target, key ) => {
        if ( isSymbol ( key ) ) {
          return Reflect.get ( target, key );
        } else {
          return this.get ( key );
        }
      }
    });

  }

  private schedule ( key: Key ): void {

    if ( !this.handlersGlobal.size && !this.handlersLocal[key]?.size ) return; // No handlers

    if ( this.scheduled.has ( key ) ) return; // Already scheduled

    this.scheduled.add ( key );

    if ( this.scheduled.size > 1 ) return; // Already scheduled

    queueMicrotask ( () => {

      this.trigger ();

    });

  }

  private trigger (): void {

    const handlersLocals = new Set<ChangeHandlerData> ();

    for ( const key of this.scheduled ) {

      const handlers = this.handlersLocal[key];

      if ( !handlers?.size ) continue;

      handlers.forEach ( data => handlersLocals.add ( data ) );

    }

    this.scheduled.clear ();

    if ( handlersLocals.size ) {

      handlersLocals.forEach ( data => {

        const value = data.value;
        const valueNext = data.fn ( this.context );

        if ( value === valueNext ) return;

        data.value = valueNext;
        data.handler ( valueNext );

      });

    }

    if ( this.handlersGlobal.size ) {

      this.handlersGlobal.forEach ( handler => handler () );

    }

  }

  /* PUBLIC API */

  eval ( expression: Expression ): boolean {

    return Expr.eval ( expression, this.context );

  }

  get ( key: Key ): Value | undefined {

    return resolve ( this.keys[key] );

  }

  has ( key: Key ): boolean {

    return !isUndefined ( this.keys[key] );

  }

  register ( key: Key, value: Value ): Disposer {

    this.set ( key, value );

    return () => this.remove ( key );

  }

  remove ( key: Key ): void {

    if ( !this.has ( key ) ) return;

    delete this.keys[key];

    this.schedule ( key );

  }

  reset (): void {

    this.keys = {};
    this.context = this.contextize ( this.keys );
    this.handlersGlobal = new Set ();
    this.handlersLocal = {};
    this.scheduled = new Set ();

  }

  set ( key: Key, value: Value ): void {

    if ( isEqual ( this.keys[key], value ) ) return;

    this.keys[key] = value;

    this.schedule ( key );

  }

  onChange ( handler: ChangeHandlerGlobal ): Disposer;
  onChange ( expression: Expression, handler: ChangeHandlerLocal ): Disposer;
  onChange ( expression: Expression | ChangeHandlerGlobal, handler: ChangeHandlerLocal = noop ): Disposer {

    try {

      if ( isString ( expression ) ) {

        const expressionData = Expr.parse ( expression );

        if ( !expressionData.keys.length ) return noop;

        const value = expressionData.fn ( this.context );
        const data = { ...expressionData, handler, value };

        data.keys.forEach ( key => ( this.handlersLocal[key] ||= new Set () ).add ( data ) );

        return () => data.keys.forEach ( key => this.handlersLocal[key]?.delete ( data ) );

      } else {

        this.handlersGlobal.add ( expression );

        return () => this.handlersGlobal.delete ( expression );

      }

    } catch {

      return noop;

    }

  }

}

/* EXPORT */

export default ContextKeys;
