
/* IMPORT */

import {Value, Values, Key, Keys, Expr, ChangeHandler, ChangeHandlerData, ChangeHandlersTree, Disposer} from './types';
import Expression from './expression';
import Utils from './utils';

/* CONTEXT KEYS */

class ContextKeys {

  private keys: Keys;
  private handlers: ChangeHandlerData[];
  private handlersTree: ChangeHandlersTree;
  private getBound: Function = this.get.bind ( this );

  constructor ( keys?: Keys ) {

    this.reset ();

    if ( keys ) {

      this.add ( keys );

    }

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
  remove ( keys: Keys ): void
  remove ( keys: Key | Keys ): void {

    if ( Utils.isString ( keys ) ) {

      if ( Utils.isUndefined ( this.keys[keys] ) ) return;

      this.keys[keys] = undefined;

      this.triggerChange ( keys );

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
    this.handlersTree = {};

  }

  get ( key: Key ): Value | undefined;
  get (): Values;
  get ( key?: Key ): Value | Values | undefined {

    if ( Utils.isString ( key ) ) {

      return this.keys[key];

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

    if ( expression in this.keys ) return !!this.get ( expression );

    return Expression.eval ( expression, this.getBound );

  }

  private triggerChange ( key: Key ): void {

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

  onChange ( expression: Expr, handler: ChangeHandler ): Disposer {

    const exprData = Expression.parse ( expression ),
          {keys} = exprData,
          value = Expression.eval ( exprData, this.getBound ),
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

  }

}

/* EXPORT */

export default ContextKeys;
