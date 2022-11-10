
/* IMPORT */

import type {Expr, ExprFN, ExprData} from '../types';
import parser from './parser';
import Utils from '../utils';

/* MAIN */

const Expression = {

  /* API */

  parseFallback: ( expression: Expr ): ExprData => {

    return {
      expression,
      keys: [],
      fn: () => false
    };

  },

  parseInvalid: ( expression: Expr ): ExprData => {

    console.error ( `[context-keys] The following expression is invalid: "${expression}"` );

    return Expression.parseFallback ( expression );

  },

  parseAdvanced: ( expression: Expr ): ExprData | undefined => {

    const [wrapped, keys] = parser ( expression );

    if ( !wrapped ) return;

    const fn = new Function ( `return !!(${wrapped})`) as ExprFN;

    return { expression, keys, fn };

  },

  parse: Utils.memoize ( ( expression: Expr ): ExprData => {

    try {

      return Expression.parseAdvanced ( expression ) || Expression.parseInvalid ( expression );

    } catch {

      return Expression.parseInvalid ( expression );

    }

  }),

  eval ( expression: Expr | ExprData, get: Function ): boolean {

    const data = Utils.isString ( expression ) ? Expression.parse ( expression ) : expression;

    try {

      return data.fn.call ( get );

    } catch ( err ) {

      console.error ( `[context-keys] An error occurred while evaluating the following expression: "${data.expression}"` );

      return false;

    }

  },

  check: ( expression: Expr ): boolean => {

    return !!parser ( expression )[0];

  }

};

/* EXPORT */

export default Expression;
