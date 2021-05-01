
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import ContextKeys from '../dist';
import Expression from '../dist/expression';
import Fixtures from './fixtures';

/* PARSER */

describe ( 'Parser', it => {

  it ( 'Accepts all the supported syntax', t => {

    const expression = `null || true && false || 123 || 123 !== NaN || 123 !== undefined || 'str' || "str" || \`str\` || '\\n\\\\' || ( true ? 123 : false ) || 123 === 123 || 123 !== 123 || 123 == 123 || 123 != 123 || 123 <= 123 || 123 >= 123 || 123 < 123 || 123 > 123 || 123 + 123 || 123 - 123 || 123 * 123 || 123 / 123 || 123 % 123 || +123 || -123 || !123 || !( false || !( true ) ) || foo || foo123 || FoO || !foo || foo[0]['str'] || foo.bar.baz`;

    t.true ( Expression.check ( expression ) );

  });

  it ( 'Rejects all the unsupported syntax', t => {

    const expressions = [
      ';',
      '()',
      '0xff',
      '123 | 123',
      '123 ^ 123',
      '123 & 123',
      '123 << 123',
      '123 >>> 123',
      '123 >> 123',
      '~123',
      'function () {}',
      '/foo/',
      'eval ( "123" )',
      'window.eval ( "123" )',
      'foo.indexOf ( null ) > 0',
      'foo[0]["str"].startsWith ( "str", 123 )'
    ];

    for ( let i = 0, l = expressions.length; i < l; i++ ) {

      const expression = expressions[i];

      t.false ( Expression.check ( expression ) );

    }

  });

});

/* CONTEXT KEYS */

describe ( 'Context Keys', it => {

  describe ( 'constructor', it => {

    it ( 'initializes keys', t => {

      const ck = new ContextKeys ();

      t.deepEqual ( ck.get (), {} );

    });

    it ( 'supports initial keys', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.deepEqual ( ck.get (), Fixtures.keysResolved );

    });

  });

  describe ( 'has', it => {

    it ( 'checks if a context key is defined', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.true ( ck.has ( 'boolean' ) );
      t.true ( ck.has ( 'fnTrue' ) );
      t.true ( ck.has ( 'fnFalse' ) );
      t.false ( ck.has ( 'test' ) );

      ck.remove ( 'boolean' );
      ck.remove ( 'fnTrue' );

      t.false ( ck.has ( 'boolean' ) );
      t.false ( ck.has ( 'fnTrue' ) );

    });

  });

  describe ( 'add', it => {

    it ( 'can add an object of keys', t => {

      const ck = new ContextKeys ();

      ck.add ( Fixtures.keys );

      t.deepEqual ( ck.get (), Fixtures.keysResolved );

    });

    it ( 'can add a single key', t => {

      const ck = new ContextKeys ();

      ck.add ( 'foo', true );
      ck.add ( 'bar', false );
      ck.add ( 'fn', () => [1, 2, 3] );

      t.deepEqual ( ck.get (), { foo: true, bar: false, fn: [1, 2, 3] } );

    });

  });

  describe ( 'register', it => {

    it ( 'can add an object of keys, and return a disposer for them', t => {

      const ck = new ContextKeys ();

      const dispose = ck.register ( Fixtures.keys );

      t.deepEqual ( ck.get (), Fixtures.keysResolved );

      dispose ();

      t.deepEqual ( ck.get (), {} );

    });

    it ( 'can add a single key, and returns a disposer for it', t => {

      const ck = new ContextKeys ();

      const dispose1 = ck.register ( 'foo', true );
      const dispose2 = ck.register ( 'bar', false );
      const dispose3 = ck.register ( 'fn', () => [1, 2, 3] );

      t.deepEqual ( ck.get (), { foo: true, bar: false, fn: [1, 2, 3] } );

      dispose1 ();
      dispose2 ();
      dispose3 ();

      t.deepEqual ( ck.get (), {} );

    });

  });

  describe ( 'remove', it => {

    it ( 'can remove an object of keys', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      ck.remove ( Fixtures.keys );

      t.deepEqual ( ck.get (), {} );

    });

    it ( 'can remove an array of keys', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      ck.remove ([ 'boolean', 'string', 'object', 'fnTrue' ]);

      t.deepEqual ( ck.get (), { null: null, number: 123, fnFalse: false } );

    });

    it ( 'can remove a single key', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      ck.remove ( 'boolean' );
      ck.remove ( 'string' );
      ck.remove ( 'object' );
      ck.remove ( 'fnTrue' );

      t.deepEqual ( ck.get (), { null: null, number: 123, fnFalse: false } );

    });

  });

  describe ( 'reset', it => {

    it ( 'can remove all keys', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      ck.reset ();

      t.deepEqual ( ck.get (), {} );

    });

  });

  describe ( 'get', it => {

    it ( 'can retrieve all values', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.deepEqual ( ck.get (), Fixtures.keysResolved );

    });

    it ( 'can retrieve multiple values', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      const result = ck.get ([ 'boolean', 'string', 'fnTrue' ]);

      t.deepEqual ( result, { boolean: false, string: 'str', fnTrue: true } );

    });

    it ( 'can retrieve a single value', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.is ( ck.get ( 'fnTrue' ), true );
      t.is ( ck.get ( 'fnFalse' ), false );
      t.is ( ck.get ( 'null' ), null );
      t.is ( ck.get ( 'xxx' ), undefined );

    });

  });

  describe ( 'eval', it => {

    it ( 'can evaluate an expression', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.is ( ck.eval ( 'string' ), true );
      t.is ( ck.eval ( 'boolean || number' ), true );
      t.is ( ck.eval ( 'boolean && number' ), false );
      t.is ( ck.eval ( 'object.foo["bar"] === true' ), true );
      t.is ( ck.eval ( '( boolean && !number ) || ( string === "str" && number )' ), true );
      t.is ( ck.eval ( '!boolean && !boolean && boolean && !boolean && !boolean' ), false );
      t.is ( ck.eval ( 'boolean || boolean || !boolean || boolean || boolean' ), true );
      t.is ( ck.eval ( 'fnTrue' ), true );
      t.is ( ck.eval ( '!fnTrue' ), false );
      t.is ( ck.eval ( 'fnFalse' ), false );
      t.is ( ck.eval ( '!fnFalse' ), true );
      t.is ( ck.eval ( 'fnTrue && fnFalse' ), false );
      t.is ( ck.eval ( 'fnFalse || fnTrue' ), true );

    });

    it ( 'can evaluate an expression that doesn\'t use any variables', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.is ( ck.eval ( '    ' ), false );
      t.is ( ck.eval ( 'yield' ), false );
      t.is ( ck.eval ( 'with' ), false );
      t.is ( ck.eval ( 'break' ), false );
      t.is ( ck.eval ( 'null' ), false );
      t.is ( ck.eval ( '!null' ), true );
      t.is ( ck.eval ( '!!null' ), false );
      t.is ( ck.eval ( '!!nullooo' ), false );
      t.is ( ck.eval ( 'true' ), true );
      t.is ( ck.eval ( '!true' ), false );
      t.is ( ck.eval ( '!!true' ), true );
      t.is ( ck.eval ( '!!trueee' ), false );
      t.is ( ck.eval ( 'false' ), false );
      t.is ( ck.eval ( '!false' ), true );
      t.is ( ck.eval ( '!!false' ), false );
      t.is ( ck.eval ( '!!falseee' ), false );
      t.is ( ck.eval ( '0' ), false );
      t.is ( ck.eval ( '!0' ), true );
      t.is ( ck.eval ( '!!0' ), false );
      t.is ( ck.eval ( '1' ), true );
      t.is ( ck.eval ( '!1' ), false );
      t.is ( ck.eval ( '!!1' ), true );
      t.is ( ck.eval ( '' ), false );
      t.is ( ck.eval ( '""' ), false );
      t.is ( ck.eval ( '!""' ), true );
      t.is ( ck.eval ( '"str"' ), true );
      t.is ( ck.eval ( '!"str"' ), false );
      t.is ( ck.eval ( '123' ), true );
      t.is ( ck.eval ( '0.0' ), false );
      t.is ( ck.eval ( '0.123' ), true );
      t.is ( ck.eval ( '.0' ), false );
      t.is ( ck.eval ( '.123' ), true );
      t.is ( ck.eval ( '0x' ), false );
      t.is ( ck.eval ( '!0x' ), false );
      t.is ( ck.eval ( '\'\'' ), false );
      t.is ( ck.eval ( '\'\\\'\'' ), true );
      t.is ( ck.eval ( '\'str\'' ), true );
      t.is ( ck.eval ( '""' ), false );
      t.is ( ck.eval ( '"\\\""' ), true );
      t.is ( ck.eval ( '"str"' ), true );
      t.is ( ck.eval ( '``' ), false );
      t.is ( ck.eval ( '`\\\``' ), true );
      t.is ( ck.eval ( '`str`' ), true );
      t.is ( ck.eval ( '`\\\\`' ), true );
      t.is ( ck.eval ( '`\\0`' ), true );
      t.is ( ck.eval ( '`\\n`' ), true );
      t.is ( ck.eval ( 'true ? true : false' ), true );
      t.is ( ck.eval ( 'true ? false : false' ), false );
      t.is ( ck.eval ( 'false ? false : true' ), true );
      t.is ( ck.eval ( 'false ? false : false' ), false );
      t.is ( ck.eval ( 'true ? (true ? false : true) : false' ), false );
      t.is ( ck.eval ( 'true || false' ), true );
      t.is ( ck.eval ( 'false || false' ), false );
      t.is ( ck.eval ( 'false || (true?123:0)' ), true );
      t.is ( ck.eval ( 'true && false' ), false );
      t.is ( ck.eval ( 'false && false' ), false );
      t.is ( ck.eval ( 'true && true' ), true );
      t.is ( ck.eval ( '123 === 123' ), true );
      t.is ( ck.eval ( '123 === 0' ), false );
      t.is ( ck.eval ( '123 == 123' ), true );
      t.is ( ck.eval ( '123 == 0' ), false );
      t.is ( ck.eval ( '123 !== 123' ), false );
      t.is ( ck.eval ( '123 !== 0' ), true );
      t.is ( ck.eval ( '123 != 123' ), false );
      t.is ( ck.eval ( '123 != 0' ), true );
      t.is ( ck.eval ( '123 > 123' ), false );
      t.is ( ck.eval ( '123 >= 123' ), true );
      t.is ( ck.eval ( '123 < 123' ), false );
      t.is ( ck.eval ( '123 <= 123' ), true );
      t.is ( ck.eval ( 'asd = true' ), false );
      t.is ( ck.eval ( '0 + 0' ), false );
      t.is ( ck.eval ( '0 + 1' ), true );
      t.is ( ck.eval ( '0 += 1' ), false );
      t.is ( ck.eval ( '0 - 0' ), false );
      t.is ( ck.eval ( '0 - 1' ), true );
      t.is ( ck.eval ( '0 -= 1' ), false );
      t.is ( ck.eval ( '2 * 0' ), false );
      t.is ( ck.eval ( '2 * 1' ), true );
      t.is ( ck.eval ( '2 / 1' ), true );
      t.is ( ck.eval ( '0 / 1' ), false );
      t.is ( ck.eval ( '2 / 0' ), true );
      t.is ( ck.eval ( '0 / 0' ), false );
      t.is ( ck.eval ( '2 % 0' ), false );
      t.is ( ck.eval ( '2 % 1' ), false );
      t.is ( ck.eval ( '2 % 2' ), false );
      t.is ( ck.eval ( '2 % 3' ), true );
      t.is ( ck.eval ( '+0' ), false );
      t.is ( ck.eval ( '+1' ), true );
      t.is ( ck.eval ( '+=1' ), false );
      t.is ( ck.eval ( '-0' ), false );
      t.is ( ck.eval ( '-1' ), true );
      t.is ( ck.eval ( '-=1' ), false );
      t.is ( ck.eval ( '!0' ), true );
      t.is ( ck.eval ( '!1' ), false );
      t.is ( ck.eval ( '(true)' ), true );
      t.is ( ck.eval ( '(false)' ), false );
      t.is ( ck.eval ( '!(true)' ), false );
      t.is ( ck.eval ( '!(false)' ), true );
      t.is ( ck.eval ( 'true \n true' ), false );
      t.is ( ck.eval ( 'true;' ), false );
      t.is ( ck.eval ( 'number++' ), false );
      t.is ( ck.eval ( 'number--' ), false );
      t.is ( ck.eval ( '++number' ), false );
      t.is ( ck.eval ( '--number' ), false );

    });

    it ( 'works with invalid expressions', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.is ( ck.eval ( 'function () {}' ), false );
      t.is ( ck.eval ( 'const foo = 123' ), false );
      t.is ( ck.eval ( 'throw new Error ();' ), false );
      t.is ( ck.eval ( 'boolean[0].asd' ), false );

    });

    it ( 'works with invalid keys', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.is ( ck.eval ( 'isMissing' ), false );
      t.is ( ck.eval ( 'string && isMissing' ), false );
      t.is ( ck.eval ( 'isMissing && string' ), false );
      t.is ( ck.eval ( 'isMissing || string' ), true );

    });

  });

  describe ( 'onChange', it => {

    it ( 'batches and coaleshes calls together', async t => {

      const ck = new ContextKeys ( Fixtures.keys );

      let callsAllNr = 0,
          callsKeyNr = 0;

      ck.onChange ( () => callsAllNr++ );
      ck.onChange ( 'boolean', () => callsKeyNr++ );

      ck.set ( 'boolean', false );
      ck.set ( 'boolean', true );
      ck.set ( 'boolean', false );

      t.is ( callsAllNr, 0 );
      t.is ( callsKeyNr, 0 );

      await delay ( 100 );

      t.is ( callsAllNr, 1 );
      t.is ( callsKeyNr, 0 );

      ck.set ( 'boolean', true );

      t.is ( callsAllNr, 1 );
      t.is ( callsKeyNr, 0 );

      await delay ( 100 );

      t.is ( callsAllNr, 2 );
      t.is ( callsKeyNr, 1 );

    });

    it ( 'calls a function when anything changes', async t => {

      t.plan ( 1 );

      const ck = new ContextKeys ( Fixtures.keys );

      ck.onChange ( ( ...args ) => t.deepEqual ( args, [] ) );

      ck.set ( 'boolean', false );
      ck.set ( 'boolean', true );
      ck.remove ( 'missing' );
      ck.remove ( 'boolean' );

      await delay ( 100 );

    });

    it ( 'calls a function when a property changes', async t => {

      t.plan ( 6 );

      const ck = new ContextKeys ( Fixtures.keys );

      ck.onChange ( 'boolean', value => t.is ( value, true ) );
      ck.onChange ( 'boolean', value => t.is ( value, true ) );
      ck.onChange ( 'string', value => t.is ( value, false ) );
      ck.onChange ( 'foo', value => t.is ( value, true ) );
      ck.onChange ( 'bar', () => t.fail () );
      ck.onChange ( 'fnTrue', value => t.is ( value, false ) );
      ck.onChange ( 'fnFalse', value => t.is ( value, true ) );

      ck.set ( 'boolean', true );
      ck.remove ( 'string' );
      ck.set ( 'foo', 'foo' );
      ck.set ( 'bar', undefined );
      ck.remove ( 'bar' );
      ck.set ( 'fnTrue', () => false );
      ck.set ( 'fnFalse', () => true );

      await delay ( 100 );

    });

    it ( 'returns a disposer', async t => {

      const ck = new ContextKeys ( Fixtures.keys ),
            disposeAll = ck.onChange ( () => t.fail () ),
            dispose = ck.onChange ( 'boolean', () => t.fail () );

      disposeAll ();
      dispose ();

      ck.set ( 'boolean', true );

      await delay ( 100 );

      t.pass ();

    });

  });

});
