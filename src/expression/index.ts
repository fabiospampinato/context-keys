
/* IMPORT */

import {Key, Expr, ExprFN, ExprData} from '../types';
import Utils from '../utils';

/* EXPRESSION */

const Expression = {

  identifierRe: /(^|[\s(|&?:^=<>+*/%~!-])([a-zA-Z_\$][a-zA-Z_0-9]*)([\s)|&?:^=<>+*/%~!.-]|$)/g,
  expressionSimpleKeyRe: /^\s*(!*)([a-zA-Z_\$][a-zA-Z_0-9]*)((?:\.[a-zA-Z_\$][a-zA-Z_0-9]*)*)\s*$/,
  expressionSimpleBooleanRe: /^\s*(!*)([a-zA-Z_\$][a-zA-Z_0-9]*)((?:\.[a-zA-Z_\$][a-zA-Z_0-9]*)*)\s*(&&|\|\|)\s*(!*)([a-zA-Z_\$][a-zA-Z_0-9]*)((?:\.[a-zA-Z_\$][a-zA-Z_0-9]*)*)(?:\s*(\4)\s*(!*)([a-zA-Z_\$][a-zA-Z_0-9]*)((?:\.[a-zA-Z_\$][a-zA-Z_0-9]*)*))*\s*$/, // Repeated capturing groups aren't actually supported, so we have to further parse strings matches by this regex unfortunately
  reservedRe: /^(null|true|false|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|function|if|implements|import|in|instanceof|interface|let|new|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)$/,

  parseFallback: ( expression: Expr ): ExprData => {

    return {
      expression,
      keys: [],
      fn: () => false
    };

  },

  parseSimpleKey: ( expression: Expr, has: Function ): ExprData | undefined => {

    if ( Expression.reservedRe.test ( expression ) ) {

      return {
        expression,
        keys: [expression],
        fn: function () { return expression === 'true'; }
      };

    } else if ( has ( expression ) ) {

      return {
        expression,
        keys: [expression],
        fn: function () { return !!this ( expression ); }
      };

    } else {

      const match = Expression.expressionSimpleKeyRe.exec ( expression );

      if ( !match ) return;

      const [, bangsRaw, key, properties] = match,
            bangs = ( !bangsRaw || bangsRaw.length % 2 === 0 ) ? '!!' : '!',
            expressionWrapped = Expression.reservedRe.test ( key ) ? `${bangsRaw}${key === 'true' ? 'true' : 'false'}${properties || ''}` : `${bangs}this('${key}')${properties || ''}`,
            fn = new Function ( `return ${expressionWrapped}` ) as ExprFN; //TSC

      return {
        expression,
        keys: [key],
        fn
      };

    }

  },

  parseSimpleBoolean: ( expression: Expr ): ExprData | undefined => {

    const match = Expression.expressionSimpleBooleanRe.exec ( expression );

    if ( !match ) return;

    const operator = match[4],
          expressionParts = expression.split ( operator ),
          matches: RegExpExecArray[] = [];

    for ( let i = 0, l = expressionParts.length; i < l; i++ ) {

      const match = Expression.expressionSimpleKeyRe.exec ( expressionParts[i] );

      if ( !match ) return;

      matches.push ( match );

    }

    const expressionsWrapped: string[] = [],
          keysObj: Record<string, string> = {},
          keys: Key[] = [];

    for ( let i = 0, l = matches.length; i < l; i++ ) {

      const [, bangsRaw, key, properties] = matches[i];

      if ( Expression.reservedRe.test ( key ) ) {

        expressionsWrapped.push ( `${bangsRaw}${key === 'true' ? 'true' : 'false'}${properties}` );

      } else {

        const bangs = ( !bangsRaw || bangsRaw.length % 2 === 0 ) ? '!!' : '!';

        expressionsWrapped.push ( `${bangs}this('${key}')${properties || ''}` );

        if ( !keysObj[key] ) keys[keys.length] = keysObj[key] = key;

      }

    }

    const expressionWrapped = expressionsWrapped.join ( operator );

    const fn = new Function ( `return ${expressionWrapped}` ) as ExprFN; //TSC

    return {expression, keys, fn};

  },

  parseAdvanced: ( expression: Expr ): ExprData => {

    const Parser = require ( '../../src/expression/parser.js' ); //UGLY

    Parser.parse ( expression ); // Checking for validity

    const keysObj: Record<string, string> = {},
          keys: Key[] = [];

    const expressionWrapped = expression.replace ( Expression.identifierRe, ( match, $1, $2, $3 ) => {
      if ( Expression.reservedRe.test ( $2 ) ) return `${$1}${$2 === 'true' ? 'true' : 'false'}${$3}`;
      if ( !keysObj[$2] ) keys[keys.length] = keysObj[$2] = $2;
      return `${$1}this('${$2}')${$3}`;
    });

    const fn = new Function ( `return !!(${expressionWrapped})` ) as ExprFN; //TSC

    return {expression, keys, fn};

  },

  parse: Utils.memoize ( ( expression: Expr, has: Function ): ExprData => {

    try {

      return Expression.parseSimpleKey ( expression, has ) || Expression.parseSimpleBoolean ( expression ) || Expression.parseAdvanced ( expression );

    } catch ( err ) {

      console.error ( `[context-keys] The following expression is invalid: "${expression}"` );

      return Expression.parseFallback ( expression );

    }

  }),

  eval ( expression: Expr | ExprData, has: Function, get: Function ): boolean {

    const data = Utils.isString ( expression ) ? Expression.parse ( expression, has ) : expression;

    try {

      return data.fn.call ( get );

    } catch ( err ) {

      console.error ( `[context-keys] An error occurred while evaluating the following expression: "${data.expression}"` );

      return false;

    }

  }

};

/* EXPORT */

export default Expression;
