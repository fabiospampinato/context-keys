
/* MAIN */

const isFunction = ( value: unknown ): value is Function => {

  return typeof value === 'function';

};

const isString = ( value: unknown ): value is string => {

  return typeof value === 'string';

};

const isSymbol = ( value: unknown ): value is symbol => {

  return typeof value === 'symbol';

};

const isUndefined = ( value: unknown ): value is undefined => {

  return value === undefined;

};

const memoize = <T, R> ( fn: (( arg: T ) => R) ): (( arg: T ) => R) => {

  const cache = new Map<T, R> ();

  return ( arg: T ): R => {

    const cached = cache.get ( arg );

    if ( cached ) return cached;

    const result = fn ( arg );

    cache.set ( arg, result );

    return result;

  };

};

const noop = (): void => {

  return;

};

const nope = (): false => {

  return false;

};

const resolve = <T> ( value: T | (() => T) ): T => {

  return isFunction ( value ) ? value () : value;

};

/* EXPORT */

export {isFunction, isString, isSymbol, isUndefined, memoize, noop, nope, resolve};
