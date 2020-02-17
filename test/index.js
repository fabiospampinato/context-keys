
/* IMPORT */

import {describe} from 'ava-spec';
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

      t.deepEqual ( ck.get (), Fixtures.keys );

    });

  });

  describe ( 'add', it => {

    it ( 'can add an object of keys', t => {

      const ck = new ContextKeys ();

      ck.add ( Fixtures.keys );

      t.deepEqual ( ck.get (), Fixtures.keys );

    });

    it ( 'can add a single key', t => {

      const ck = new ContextKeys ();

      ck.add ( 'foo', true );
      ck.add ( 'bar', false );

      t.deepEqual ( ck.get (), { foo: true, bar: false } );

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

      ck.remove ([ 'boolean', 'string', 'object' ]);

      t.deepEqual ( ck.get (), { null: null, number: 123 } );

    });

    it ( 'can remove a single key', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      ck.remove ( 'boolean' );
      ck.remove ( 'string' );
      ck.remove ( 'object' );

      t.deepEqual ( ck.get (), { null: null, number: 123 } );

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

      t.deepEqual ( ck.get (), Fixtures.keys );

    });

    it ( 'can retrieve a single value', t => {

      const ck = new ContextKeys ( Fixtures.keys );

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

    });

    it ( 'works with invalid expressions', t => {

      const ck = new ContextKeys ( Fixtures.keys );

      t.is ( ck.eval ( 'function () {}' ), false );
      t.is ( ck.eval ( 'const foo = 123' ), false );
      t.is ( ck.eval ( 'throw new Error ();' ), false );

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

    it ( 'calls a function when anything changes', t => {

      t.plan ( 2 );

      const ck = new ContextKeys ( Fixtures.keys );

      ck.onChange ( ( ...args ) => t.deepEqual ( args, [] ) );

      ck.set ( 'boolean', false );
      ck.set ( 'boolean', true );
      ck.remove ( 'missing' );
      ck.remove ( 'boolean' );

    });

    it ( 'calls a function when a property changes', t => {

      t.plan ( 4 );

      const ck = new ContextKeys ( Fixtures.keys );

      ck.onChange ( 'boolean', value => t.is ( value, true ) );
      ck.onChange ( 'boolean', value => t.is ( value, true ) );
      ck.onChange ( 'string', value => t.is ( value, false ) );
      ck.onChange ( 'foo', value => t.is ( value, true ) );
      ck.onChange ( 'bar', () => t.fail () );

      ck.set ( 'boolean', true );
      ck.remove ( 'string' );
      ck.set ( 'foo', 'foo' );
      ck.set ( 'bar', undefined );
      ck.remove ( 'bar' );

    });

    it ( 'returns a disposer', t => {

      const ck = new ContextKeys ( Fixtures.keys ),
            disposeAll = ck.onChange ( () => t.fail () ),
            dispose = ck.onChange ( 'boolean', () => t.fail () );

      disposeAll ();
      dispose ();

      ck.set ( 'boolean', true );

      t.pass ();

    });

  });

});
