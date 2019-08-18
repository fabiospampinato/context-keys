
/* IMPORT */

import Parser = require ( '../../src/expression/parser.js' ); //UGLY
import {Key, Expr, ExprFN, ExprData} from '../types';
import Utils from '../utils';

/* EXPRESSION */

const Expression = {

  identifierRe: /(^|[\s(|&?:^=<>+*/%~!-])([a-zA-Z_\$][a-zA-Z_0-9]*)([\s)|&?:^=<>+*/%~!.-]|$)/g,
  reservedRe: /^(null|true|false|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)$/,

  check: Utils.memoize ( ( expression: Expr ): void => {

    Parser.parse ( expression );

  }),

  parse: Utils.memoize ( ( expression: Expr ): ExprData => {

    try {

      Expression.check ( expression );

      const keys: Key[] = [];

      const expressionWrapped = expression.replace ( Expression.identifierRe, ( match, $1, $2, $3 ) => {
        if ( Expression.reservedRe.test ( $2 ) ) return match;
        if ( keys.indexOf ( $2 ) === -1 ) keys[keys.length] = $2;
        return `${$1}this('${$2}')${$3}`;
      });

      const fn = new Function ( `return !!( ${expressionWrapped} );` ) as ExprFN; //TSC

      return { expression, keys, fn };

    } catch ( err ) {

      console.error ( `[context-keys] The following expression is invalid: "${expression}"` );

      return {
        expression,
        keys: [],
        fn: () => false
      };

    }

  }),

  eval ( expression: Expr | ExprData, getter: Function ): boolean {

    const data = Utils.isString ( expression ) ? Expression.parse ( expression ) : expression;

    try {

      return data.fn.call ( getter );

    } catch ( err ) {

      console.error ( `[context-keys] An error occurred while evaluating the following expression: "${data.expression}"` );

      return false;

    }

  }

};

/* EXPORT */

export default Expression;
