
/* IMPORT */

import safex from 'safex';
import {attempt, isArray, isString, memoize, nope, uniq} from './utils';
import type {Expression, ExpressionContext, ExpressionData} from './types';
import type {Node} from 'safex';

/* MAIN */

const Expr = {

  /* API */

  extract: ( node: (Node[] | Node | string)[] | Node | string, _keys: string[] = [] ): string[] => { //UGLY: This extracts all identifiers, maybe safex should export a "visit" function instead

    if ( !isString ( node ) ) {

      if ( isArray ( node ) ) {

        node.forEach ( node => Expr.extract ( node, _keys ) );

      } else if ( 'children' in node ) {

        Expr.extract ( node.children, _keys );

      } else if ( node.type === 'identifier' ) {

        _keys.push ( node.value );

      }

    }

    return _keys;

  },

  eval: ( expression: Expression, context: ExpressionContext ): boolean => {

    const data = Expr.parse ( expression );

    return data.fn ( context );

  },

  parse: memoize (( expression: Expression ): ExpressionData => {

    try {

      const ast = safex.parse ( expression );
      const keys = uniq ( Expr.extract ( ast ) );
      const compiled = safex.compile ( ast );
      const fn = ( context: ExpressionContext ) => attempt ( () => !!compiled ( context ), false );

      return { expression, keys, fn };

    } catch {

      return { expression, keys: [], fn: nope };

    }

  })

};

/* EXPORT */

export default Expr;
