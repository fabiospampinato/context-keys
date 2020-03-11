
/* IMPORT */

import {Value, Values, Key, Keys, Expr, ChangeAllHandler, ChangeHandler, ChangeHandlerData, ChangeHandlersTree, Disposer} from './types';
import Expression from './expression';
import Utils from './utils';

/* CONTEXT KEYS */

class ContextKeys {

  private keys: Keys;
  private handlers: ChangeHandlerData[];
  private handlersAll: ChangeAllHandler[];
  private handlersTree: ChangeHandlersTree;
  private getBound: Function = this.get.bind ( this );
  private hasBound: Function = this.has.bind ( this );

  constructor ( keys?: Keys ) {

    this.reset ();

    if ( keys ) {

      this.add ( keys );

    }

  }

  has ( key ): boolean {

    return key in this.keys;

  }

  add ( key: Key, value: Value ): void;
  add ( keys: Keys ): void
  add ( keys: Key | Keys, value: Value = null ): void {

    if ( Utils.isString ( keys ) ) {

      if ( this.keys[keys] === value ) return;

      this.keys[keys] = value;

      this.triggerChange ( keys );

    } else {

      for ( const key in keys ) {

        if ( this.keys[key] === keys[key] ) continue;

        this.keys[key] = keys[key];

        this.triggerChange ( key );

      }

    }

  }

  set ( key: Key, value: Value ): void;
  set ( keys: Keys ): void
  set ( keys: Key | Keys, value: Value = null ): void {

    return this.add.apply ( this, arguments );

  }

  remove ( key: Key ): void;
  remove ( keys: Key[] ): void
  remove ( keys: Keys ): void
  remove ( keys: Key | Key[] | Keys ): void {

    if ( Utils.isString ( keys ) ) {

      if ( Utils.isUndefined ( this.keys[keys] ) ) return;

      this.keys[keys] = undefined;

      this.triggerChange ( keys );

    } else if ( Utils.isArray ( keys ) ) {

      for ( let i = 0, l = keys.length; i < l; i++ ) {

        const key = keys[i];

        if ( Utils.isUndefined ( this.keys[key] ) ) continue;

        this.keys[key] = undefined;

        this.triggerChange ( key );

      }

    } else {

      for ( const key in keys ) {

        if ( Utils.isUndefined ( this.keys[key] ) ) continue;

        this.keys[key] = undefined;

        this.triggerChange ( key );

      }

    }

  }

  reset (): void {

    this.keys = {};
    this.handlers = [];
    this.handlersAll = [];
    this.handlersTree = {};

  }

  get ( key: Key ): Value | undefined;
  get ( keys: Key[] ): Values;
  get (): Values;
  get ( key?: Key | Key[] ): Value | Values | undefined {

    if ( Utils.isString ( key ) ) {

      return this.keys[key];

    } else if ( Utils.isArray ( key ) ) {

      const values: Values = {};

      for ( let i = 0, l = key.length; i < l; i++ ) {

        const k = key[i],
              value = this.keys[k];

        if ( Utils.isUndefined ( value ) ) continue;

        values[k] = value;

      }

      return values;

    } else {

      const values: Values = {};

      for ( const key in this.keys ) {

        const value = this.keys[key];

        if ( Utils.isUndefined ( value ) ) continue;

        values[key] = value;

      }

      return values;

    }

  }

  eval ( expression: Expr ): boolean {

    return Expression.eval ( expression, this.hasBound, this.getBound );

  }

  private triggerChange ( key: Key ): void {

    this.handlersAll.forEach ( handler => handler () );

    const handlersByKey = this.handlersTree[key];

    if ( !handlersByKey ) return;

    for ( let expression in handlersByKey ) {

      const handlersByExpression = handlersByKey[expression],
            value = this.eval ( expression );

      for ( let i = 0, l = handlersByExpression.length; i < l; i++ ) {

        const data = handlersByExpression[i];

        if ( value === data.value ) continue;

        data.value = value;

        const {handler} = data;

        handler ( value );

      }

    }

  }

  onChange ( handler: ChangeAllHandler ): Disposer;
  onChange ( expression: Expr, handler: ChangeHandler ): Disposer;
  onChange ( expression: Expr | ChangeAllHandler, handler?: ChangeHandler ): Disposer {

    if ( Utils.isString ( expression ) ) {

      handler = handler as ChangeHandler; //TSC

      const exprData = Expression.parse ( expression, this.hasBound ),
            {keys} = exprData,
            value = Expression.eval ( exprData, this.hasBound, this.getBound ),
            data: ChangeHandlerData = { handler, value },
            {handlers, handlersTree} = this;

      handlers[handlers.length] = data;

      for ( let i = 0, l = keys.length; i < l; i++ ) {

        const key = keys[i];

        if ( !handlersTree[key] ) handlersTree[key] = {};

        const handlersByKey = handlersTree[key];

        if ( !handlersByKey[expression] ) handlersByKey[expression] = [];

        const handlersByExpression = handlersByKey[expression];

        handlersByExpression[handlersByExpression.length] = data;

      }

      return () => {

        handlers.splice ( handlers.indexOf ( data ), 1 );

        for ( let i = 0, l = keys.length; i < l; i++ ) {

          const key = keys[i];

          if ( !handlersTree[key] ) continue;

          const handlersByKey = handlersTree[key];

          if ( !handlersByKey[expression] ) handlersByKey[expression] = [];

          const handlersByExpression = handlersByKey[expression];

          handlersByExpression.splice ( handlersByExpression.indexOf ( data ), 1 );

        }

      };

    } else {

      this.handlersAll.push ( expression );

      return () => {

        this.handlersAll = this.handlersAll.filter ( h => h !== expression );

      };

    }

  }

}

/* EXPORT */

export default ContextKeys;
