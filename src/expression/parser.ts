
/* IMPORT */

import {match, parse} from 'reghex';
import type {Expr, Key} from '../types';
import grammar from './grammar';

/* HELPERS */

const Keys = {
  found: new Set<string> (),
  reserved: new Set ([ 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'finally', 'for', 'function', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'package', 'private', 'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield' ])
};

const Matchers = {
  Pass: match ( '', token => {
    return token.join ( '' );
  }),
  Key: match ( '', token => {
    const key = token[0];
    if ( Keys.reserved.has ( key ) ) return '(false)';
    Keys.found.add ( key );
    return `this('${key}')`;
  })
};

const Wrapper = parse ( grammar ( Matchers.Pass, Matchers.Key ) );

/* MAIN */

const parser = ( expression: Expr ): [Expr | undefined, Key[]] => {

  Keys.found.clear ();

  const wrapped = Wrapper ( expression );
  const keys = Array.from ( Keys.found );

  return [wrapped, keys];

};

/* EXPORT */

export default parser;
