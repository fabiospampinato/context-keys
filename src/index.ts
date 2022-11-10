
/* IMPORT */

import type {Value, Values, Key, Keys, Expr, ChangeAllHandler, ChangeHandler, ChangeHandlerData, ChangeHandlersTree, Disposer} from './types';
import Expression from './expression';
import Utils from './utils';

/* MAIN */

class ContextKeys {

  /* VARIABLES */

  private keys: Keys = {};
  private handlers: ChangeHandlerData[] = [];
  private handlersAll: ChangeAllHandler[] = [];
  private handlersTree: ChangeHandlersTree = {};
  private scheduledKeys: Set<Key> = new Set ();
  private scheduledId?: number;
  private getBound: Function = this.get.bind ( this );

  /* CONSTRUCTOR */

  constructor ( keys?: Keys ) {

    this.reset ();

    if ( keys ) {

      this.add ( keys );

    }

  }

  /* API */

  has ( key: string ): boolean {

    return !Utils.isUndefined ( this.keys[key] );

  }

  add ( key: Key, value: Value ): void;
  add ( keys: Keys ): void;
  add ( keys: Key | Keys, value: Value = null ): void {

    if ( Utils.isString ( keys ) ) {

      if ( this.keys[keys] === value ) return;

      this.keys[keys] = value;

      this.scheduleChange ( keys );

    } else {

      for ( const key in keys ) {

        if ( this.keys[key] === keys[key] ) continue;

        this.keys[key] = keys[key];

        this.scheduleChange ( key );

      }

    }

  }

  set ( key: Key, value: Value ): void;
  set ( keys: Keys ): void;
  set ( keys: Key | Keys, value: Value = null ): void {

    return this.add.apply ( this, arguments );

  }

  register ( key: Key, value: Value ): Disposer;
  register ( keys: Keys ): Disposer;
  register ( keys: Key | Keys, value: Value = null ): Disposer {

    this.add.apply ( this, arguments );

    return () => this.remove.apply ( this, arguments );

  }

  remove ( key: Key ): void;
  remove ( keys: Key[] ): void;
  remove ( keys: Keys ): void;
  remove ( keys: Key | Key[] | Keys ): void {

    if ( Utils.isString ( keys ) ) {

      this.keys[keys] = undefined;

      this.scheduleChange ( keys );

    } else if ( Utils.isArray ( keys ) ) {

      for ( let i = 0, l = keys.length; i < l; i++ ) {

        const key = keys[i];

        this.keys[key] = undefined;

        this.scheduleChange ( key );

      }

    } else {

      for ( const key in keys ) {

        this.keys[key] = undefined;

        this.scheduleChange ( key );

      }

    }

  }

  reset (): void {

    this.keys = {};
    this.handlers = [];
    this.handlersAll = [];
    this.handlersTree = {};
    this.scheduledKeys = new Set ();

    this.scheduleClear ();

  }

  get ( key: Key ): Value | undefined;
  get ( keys: Key[] ): Values;
  get (): Values;
  get ( key?: Key | Key[] ): Value | Values | undefined {

    if ( Utils.isString ( key ) ) {

      const value = this.keys[key];

      return Utils.isFunction ( value ) ? value () : value;

    } else if ( Utils.isArray ( key ) ) {

      const values: Values = {};

      for ( let i = 0, l = key.length; i < l; i++ ) {

        const k = key[i],
              value = this.keys[k];

        if ( Utils.isUndefined ( value ) ) continue;

        values[k] = Utils.isFunction ( value ) ? value () : value;

      }

      return values;

    } else {

      const values: Values = {};

      for ( const key in this.keys ) {

        const value = this.keys[key];

        if ( Utils.isUndefined ( value ) ) continue;

        values[key] = Utils.isFunction ( value ) ? value () : value;

      }

      return values;

    }

  }

  eval ( expression: Expr ): boolean {

    return Expression.eval ( expression, this.getBound );

  }

  private scheduleChange ( key: Key ): void {

    this.scheduledKeys.add ( key );

    if ( this.scheduledId ) return;

    this.scheduledId = setTimeout ( () => {

      delete this.scheduledId;

      this.scheduleTrigger ();

    });

  }

  private scheduleClear (): void {

    if ( !this.scheduledId ) return;

    clearTimeout ( this.scheduledId );

    delete this.scheduledId;

  }

  private scheduleTrigger (): void {

    const handlersMap: Map<ChangeHandler, boolean> = new Map ();

    for ( const key of this.scheduledKeys ) {

      const handlersByKey = this.handlersTree[key];

      if ( !handlersByKey ) continue;

      for ( const expression in handlersByKey ) {

        const handlersByExpression = handlersByKey[expression],
              value = this.eval ( expression );

        for ( let i = 0, l = handlersByExpression.length; i < l; i++ ) {

          const data = handlersByExpression[i];

          if ( value === data.value ) continue;

          data.value = value;

          const {handler} = data;

          handlersMap.set ( handler, value );

        }

      }

    }

    this.scheduledKeys = new Set ();

    this.handlersAll.forEach ( handler => handler () );

    handlersMap.forEach ( ( value, handler ) => handler ( value ) );

  }

  onChange ( handler: ChangeAllHandler ): Disposer;
  onChange ( expression: Expr, handler: ChangeHandler ): Disposer;
  onChange ( expression: Expr | ChangeAllHandler, handler?: ChangeHandler ): Disposer {

    if ( Utils.isString ( expression ) ) {

      handler = handler as ChangeHandler; //TSC

      const exprData = Expression.parse ( expression );
      const {keys} = exprData;
      const value = Expression.eval ( exprData, this.getBound );
      const data: ChangeHandlerData = { handler, value };
      const {handlers, handlersTree} = this;

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
