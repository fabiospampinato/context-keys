
/* UTILS */

const Utils = {

  isString ( x: any ): x is string {

    return typeof x === 'string';

  },

  isUndefined ( x: any ): x is undefined {

    return typeof x === 'undefined';

  },

  memoize<T extends Function> ( fn: T ) {

    const cache = {};

    return function memoized ( key: string ) {

      if ( key in cache ) return cache[key];

      return cache[key] = fn.apply ( undefined, arguments );

    } as unknown as T;

  }

};

/* EXPORT */

export default Utils;
