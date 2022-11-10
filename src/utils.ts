
/* MAIN */

const Utils = {

  /* API */

  isArray: ( value: unknown ): value is unknown[] => {

    return Array.isArray ( value );

  },

  isFunction: ( value: unknown ): value is Function => {

    return typeof value === 'function';

  },

  isString: ( value: unknown ): value is string => {

    return typeof value === 'string';

  },

  isUndefined: ( value: unknown ): value is undefined => {

    return value === undefined;

  },

  memoize: <T, R> ( fn: (( arg: T ) => R) ): (( arg: T ) => R) => {

    const cache = new Map<T, R> ();

    return ( arg: T ): R => {

      const cached = cache.get ( arg );

      if ( cached || cache.has ( arg ) ) return cached as R; //TSC

      const result = fn ( arg );

      cache.set ( arg, result );

      return result;

    };

  }

};

/* EXPORT */

export default Utils;
