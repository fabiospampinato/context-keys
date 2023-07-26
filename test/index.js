
/* IMPORT */

import {describe} from 'fava';
import {setTimeout as delay} from 'node:timers/promises';
import ContextKeys from '../dist/index.js';
import {KEYS} from './fixtures.js';

/* MAIN */

describe ( 'Context Keys', () => {

  describe ( 'constructor', it => {

    it ( 'initializes keys', t => {

      const ck = new ContextKeys ();

      t.deepEqual ( ck.keys, {} );

    });

    it ( 'supports initial keys', t => {

      const ck = new ContextKeys ( KEYS );

      t.is ( ck.get ( 'null' ), null );
      t.is ( ck.get ( 'number' ), 123 );
      t.is ( ck.get ( 'boolean' ), false );
      t.is ( ck.get ( 'string' ), 'str' );
      t.is ( ck.get ( 'fnTrue' ), true );
      t.is ( ck.get ( 'fnFalse' ), false );
      t.deepEqual ( ck.get ( 'object' ), { foo: { bar: true } } );

    });

  });

  describe ( 'eval', it => {

    it ( 'can evaluate an expression', t => {

      const ck = new ContextKeys ( KEYS );

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

    it ( 'can evaluate an expression that does not use any variables', t => {

      const ck = new ContextKeys ( KEYS );

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
      t.is ( ck.eval ( 'true || false' ), true );
      t.is ( ck.eval ( 'false || false' ), false );
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

      const ck = new ContextKeys ( KEYS );

      t.is ( ck.eval ( 'function () {}' ), false );
      t.is ( ck.eval ( 'const foo = 123' ), false );
      t.is ( ck.eval ( 'throw new Error ();' ), false );
      t.is ( ck.eval ( 'boolean[0].asd' ), false );

    });

    it ( 'works with invalid keys', t => {

      const ck = new ContextKeys ( KEYS );

      t.is ( ck.eval ( 'isMissing' ), false );
      t.is ( ck.eval ( 'string && isMissing' ), false );
      t.is ( ck.eval ( 'isMissing && string' ), false );
      t.is ( ck.eval ( 'isMissing || string' ), true );

    });

  });

  describe ( 'get', it => {

    it ( 'can retrieve a single value', t => {

      const ck = new ContextKeys ( KEYS );

      t.is ( ck.get ( 'fnTrue' ), true );
      t.is ( ck.get ( 'fnFalse' ), false );
      t.is ( ck.get ( 'null' ), null );
      t.is ( ck.get ( 'xxx' ), undefined );

    });

  });

  describe ( 'has', it => {

    it ( 'checks if a context key is defined', t => {

      const ck = new ContextKeys ( KEYS );

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

  describe ( 'register', it => {

    it ( 'can add a single key, and returns a disposer for it', t => {

      const ck = new ContextKeys ();

      const dispose1 = ck.register ( 'foo', true );
      const dispose2 = ck.register ( 'bar', false );
      const dispose3 = ck.register ( 'fn', () => [1, 2, 3] );

      t.is ( ck.get ( 'foo' ), true );
      t.is ( ck.get ( 'bar' ), false );
      t.deepEqual ( ck.get ( 'fn' ), [1, 2, 3] );

      dispose1 ();
      dispose2 ();
      dispose3 ();

      t.deepEqual ( ck.keys, {} );

    });

  });

  describe ( 'remove', it => {

    it ( 'can remove a single key', t => {

      const ck = new ContextKeys ( KEYS );

      ck.remove ( 'boolean' );
      ck.remove ( 'string' );
      ck.remove ( 'object' );
      ck.remove ( 'fnTrue' );

      t.is ( ck.get ( 'null' ), null );
      t.is ( ck.get ( 'number' ), 123 );
      t.is ( ck.get ( 'boolean' ), undefined );
      t.is ( ck.get ( 'string' ), undefined );
      t.is ( ck.get ( 'fnTrue' ), undefined );
      t.is ( ck.get ( 'fnFalse' ), false );
      t.is ( ck.get ( 'object' ), undefined );

    });

  });

  describe ( 'reset', it => {

    it ( 'can remove all keys', t => {

      const ck = new ContextKeys ( KEYS );

      ck.reset ();

      t.deepEqual ( ck.keys, {} );

    });

  });

  describe ( 'set', it => {

    it ( 'can add a single key', t => {

      const ck = new ContextKeys ();

      ck.set ( 'foo', true );
      ck.set ( 'bar', false );
      ck.set ( 'fn', () => [1, 2, 3] );

      t.is ( ck.get ( 'foo' ), true );
      t.is ( ck.get ( 'bar' ), false );
      t.deepEqual ( ck.get ( 'fn' ), [1, 2, 3] );

    });

  });

  describe ( 'onChange', it => {

    it ( 'batches and coaleshes calls together', async t => {

      const ck = new ContextKeys ( KEYS );

      let callsAllNr = 0;
      let callsKeyNr = 0;

      ck.onChange ( () => callsAllNr++ );
      ck.onChange ( 'boolean', () => callsKeyNr++ );

      ck.set ( 'boolean', false );
      ck.set ( 'boolean', true );
      ck.set ( 'boolean', false );

      t.is ( callsAllNr, 0 );
      t.is ( callsKeyNr, 0 );

      await delay ( 10 );

      t.is ( callsAllNr, 1 );
      t.is ( callsKeyNr, 0 );

      ck.set ( 'boolean', true );

      t.is ( callsAllNr, 1 );
      t.is ( callsKeyNr, 0 );

      await delay ( 10 );

      t.is ( callsAllNr, 2 );
      t.is ( callsKeyNr, 1 );

    });

    it ( 'calls a function when anything changes', async t => {

      t.plan ( 1 );

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( ( ...args ) => t.deepEqual ( args, [] ) );

      ck.set ( 'boolean', false );
      ck.set ( 'boolean', true );
      ck.remove ( 'missing' );
      ck.remove ( 'boolean' );

      await delay ( 10 );

    });

    it ( 'does not react when initializing context keys', async t => {

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( () => t.fail () );

      await delay ( 10 );

      t.pass ();

    });

    it ( 'does not react when setting a key to the same value', async t => {

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( () => t.fail () );
      ck.onChange ( 'number', () => t.fail () );

      ck.set ( 'number', ck.get ( 'number' ) );

      await delay ( 10 );

      t.pass ();

    });

    it ( 'does not react when setting a key to an equal value', async t => {

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( () => t.fail () );
      ck.onChange ( 'object', () => t.fail () );

      ck.set ( 'object', { ...ck.get ( 'object' ) } );

      await delay ( 10 );

      t.pass ();

    });

    it ( 'does not react when deleting key that does not exist', async t => {

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( () => t.fail () );
      ck.onChange ( 'extra', () => t.fail () );

      ck.remove ( 'extra' );

      await delay ( 10 );

      t.pass ();

    });

    it ( 'calls a function when a key changes', async t => {

      t.plan ( 6 );

      const ck = new ContextKeys ( KEYS );

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

      await delay ( 10 );

    });

    it ( 'calls specific handlers before global handlers', async t => {

      const ck = new ContextKeys ( KEYS );

      let calls = '';

      ck.onChange ( () => calls += 'g' );
      ck.onChange ( 'extra', () => calls += 'l' );

      ck.set ( 'extra', 123 );

      await delay ( 10 );

      t.is ( calls, 'lg' );

    });

    it ( 'reacts to keys being deleted too', async t => {

      t.plan ( 1 );

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( 'number', value => t.is ( value, false ) );

      ck.remove ( 'number' );

      await delay ( 10 );

    });

    it ( 'reacts to keys being registered too', async t => {

      t.plan ( 1 );

      const ck = new ContextKeys ( KEYS );

      ck.onChange ( 'extra', value => t.is ( value, true ) );

      ck.register ( 'extra', 123 );

      await delay ( 10 );

    });

    it ( 'returns a disposer', async t => {

      const ck = new ContextKeys ( KEYS );
      const disposeAll = ck.onChange ( () => t.fail () );
      const dispose = ck.onChange ( 'boolean', () => t.fail () );

      disposeAll ();
      dispose ();

      ck.set ( 'boolean', true );

      await delay ( 10 );

      t.pass ();

    });

  });

});
