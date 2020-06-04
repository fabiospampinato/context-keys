
/* IMPORT */

import {describe} from 'ava-spec';
import delay from 'promise-resolve-timeout';
import Parser from '../src/expression/parser.js';
import ContextKeys from '../dist';
import Fixtures from './fixtures';

/* PARSER */

describe ( 'Parser', it => {

  it ( 'Parses all the supported syntax', t => {

    const expression = `
      null ||
      true &&
      false ||
      123 ||
      -0.123e10 ||
      123 !== NaN ||
      123 !== undefined ||
      'str' ||
      "str" ||
      \`str\` ||
      '\\n\\\\' ||
      '\\uffff' ||
      '\\xff' ||
      ( true ? 123 : false ) ||
      123 | 123 ||
      123 ^ 123 ||
      123 & 123 ||
      123 === 123 ||
      123 !== 123 ||
      123 == 123 ||
      123 != 123 ||
      123 <= 123 ||
      123 >= 123 ||
      123 < 123 ||
      123 > 123 ||
      123 << 123 ||
      123 >>> 123 ||
      123 >> 123 ||
      123 + 123 ||
      123 - 123 ||
      123 * 123 ||
      123 / 123 ||
      123 % 123 ||
      +123 ||
      -123 ||
      ~123 ||
      !123 ||
      !( false || !( true ) ) ||
      foo ||
      foo123 ||
      FoO ||
      !foo ||
      foo[0]['str'] ||
      foo.bar.baz
    `;

    Parser.parse ( expression );

    t.pass ();

  });

  it ( 'Throws with all unsupported syntax', t => {

    const expressions = [
      'break',
      'function () {}',
      '/foo/',
      'eval ( "123" )',
      'window.eval ( "123" )',
      'foo.indexOf ( null ) > 0',
      'foo[0]["str"].startsWith ( "str", 123 )'
    ];

    for ( let i = 0, l = expressions.length; i < l; i++ ) {

      const expression = expressions[i];

      t.throws ( () => Parser.parse ( expression ) );

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
