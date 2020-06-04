
/* UTILS */

const Utils = {

  isArray: ( x: any ): x is any[] => {

    return Array.isArray ( x );

  },

  isFunction: ( x: any ): x is Function => {

    return typeof x === 'function';

  },

  isString ( x: any ): x is string {

    return typeof x === 'string';

  },

  isUndefined ( x: any ): x is undefined {

    return x === undefined;

  },

  memoize<T extends Function> ( fn: T ): T {

    // return fn; // Enable this for benchmarking the parser

    const cache = {};

    return function memoized ( key: string ) {

      return cache[key] || ( cache[key] = fn.apply ( undefined, arguments ) );

    } as unknown as T;

  }

};

/* EXPORT */

export default Utils;
