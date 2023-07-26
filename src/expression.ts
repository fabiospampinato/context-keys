
/* IMPORT */

import safex from 'safex';
import {memoize, nope} from './utils';
import type {Expression, ExpressionContext, ExpressionData} from './types';

/* MAIN */

const Expr = {

  /* API */

  eval: ( expression: Expression, context: ExpressionContext ): boolean => {

    try {

      return !!safex.exec ( expression, context );

    } catch {

      return false;

    }

  },

  parse: memoize (( expression: Expression ): ExpressionData => {

    try {

      const tokens = safex.tokenize ( expression );
      const keys = tokens.map ( token => token.type === 'identifier' ? token.value : '' ).filter ( Boolean );
      const compiled = safex.compile ( expression );
      const fn = ( context: ExpressionContext ) => !!compiled ( context );

      return { expression, keys, fn };

    } catch {

      return { expression, keys: [], fn: nope };

    }

  })

};

/* EXPORT */

export default Expr;
