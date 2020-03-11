
/* IMPORT */

const {default: ContextKeys} = require ( '../dist' ),
      Fixtures = require ( '../test/fixtures' ),
      benchmark = require ( 'benchloop' );

/* BENCHMARK */

const noop = () => {};

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 100000,
  log: 'compact',
  beforeEach: ctx => {
    ctx.ck = new ContextKeys ();
    ctx.ck.add ( Fixtures.keys );
  }
});

benchmark ({
  name: 'has',
  fn: ctx => {
    ctx.ck.has ( 'boolean' );
  }
});

benchmark.group ( 'add', () => {

  benchmark ({
    name: 'string',
    fn: ( ctx, i ) => {
      ctx.ck.add ( String ( i ), true );
    }
  });

  benchmark ({
    name: 'object',
    fn: ( ctx, i ) => {
      ctx.ck.add ({ [i]: true });
    }
  });

});

benchmark.group ( 'remove', () => {

  benchmark ({
    name: 'string',
    fn: ctx => {
      ctx.ck.remove ( 'boolean' );
    }
  });

  benchmark ({
    name: 'array',
    fn: ctx => {
      ctx.ck.remove ([ 'boolean', 'string' ]);
    }
  });

  benchmark ({
    name: 'object',
    fn: ctx => {
      ctx.ck.remove ( Fixtures.keys );
    }
  });

});

benchmark ({
  name: 'reset',
  fn: ctx => {
    ctx.ck.reset ();
  }
});

benchmark.group ( 'get', () => {

  benchmark ({
    name: 'single',
    fn: ctx => {
      ctx.ck.get ( 'boolean' );
    }
  });

  benchmark ({
    name: 'array',
    fn: ctx => {
      ctx.ck.get ([ 'boolean', 'string' ]);
    }
  });

  benchmark ({
    name: 'all',
    fn: ctx => {
      ctx.ck.get ();
    }
  });

});

benchmark.group ( 'eval', () => {

  benchmark ({
    name: 'simple:key',
    fn: ctx => {
      ctx.ck.eval ( 'boolean' );
    }
  });

  benchmark ({
    name: 'simple:!key',
    fn: ctx => {
      ctx.ck.eval ( '!boolean' );
    }
  });

  benchmark ({
    name: 'simple:and',
    fn: ctx => {
      ctx.ck.eval ( '!!boolean && string' );
    }
  });

  benchmark ({
    name: 'simple:or',
    fn: ctx => {
      ctx.ck.eval ( '!boolean || string' );
    }
  });

  benchmark ({
    name: 'nested:key',
    fn: ctx => {
      ctx.ck.eval ( 'object.foo.bar' );
    }
  });

  benchmark ({
    name: 'nested:and',
    fn: ctx => {
      ctx.ck.eval ( 'string && object.foo.bar' );
    }
  });

  benchmark ({
    name: 'nested:or',
    fn: ctx => {
      ctx.ck.eval ( '!string || object.foo.bar' );
    }
  });

  benchmark ({
    name: 'advanced',
    fn: ctx => {
      ctx.ck.eval ( 'boolean && ( !string || foo.bar )' );
    }
  });

});

benchmark.group ( 'onChange', () => {

  benchmark ({
    name: 'add:general',
    fn: ctx => {
      ctx.ck.onChange ( noop );
      ctx.ck.onChange ( noop );
      ctx.ck.onChange ( noop );
    }
  });

  benchmark ({
    name: 'add:expression',
    fn: ctx => {
      ctx.ck.onChange ( 'boolean', noop );
      ctx.ck.onChange ( 'boolean && string', noop );
      ctx.ck.onChange ( 'foo && bar', noop );
    }
  });

  benchmark ({
    name: 'remove:general',
    beforeEach: ctx => {
      ctx.ck = new ContextKeys ();
      ctx.ck.add ( Fixtures.keys );
      ctx.disposers = [
        ctx.ck.onChange ( noop ),
        ctx.ck.onChange ( noop ),
        ctx.ck.onChange ( noop )
      ];
    },
    fn: ctx => {
      for ( let i = 0, l = ctx.disposers.length; i < l; i++ ) {
        ctx.disposers[i]();
      }
    }
  });

  benchmark ({
    name: 'remove:expression',
    beforeEach: ctx => {
      ctx.ck = new ContextKeys ();
      ctx.ck.add ( Fixtures.keys );
      ctx.disposers = [
        ctx.ck.onChange ( 'boolean', noop ),
        ctx.ck.onChange ( 'boolean && string', noop ),
        ctx.ck.onChange ( 'foo && bar', noop )
      ];
    },
    fn: ctx => {
      for ( let i = 0, l = ctx.disposers.length; i < l; i++ ) {
        ctx.disposers[i]();
      }
    }
  });

});

benchmark.group ( 'trigger', () => {

  benchmark ({
    name: 'expression:nonexistent',
    before: ctx => {
      ctx.ck = new ContextKeys ();
      ctx.ck.add ( Fixtures.keys );
      for ( let i = 0, l = 1000; i < l; i++ ) {
        ctx.ck.onChange ( 'boolean', noop );
        ctx.ck.onChange ( 'boolean && string', noop );
        ctx.ck.onChange ( 'foo && bar', noop );
      }
    },
    beforeEach: noop,
    fn: ctx => {
      ctx.ck.set ( 'nonexistent', true );
      ctx.ck.set ( 'boolean', false );
    }
  });

  benchmark ({
    name: 'expression:general',
    before: ctx => {
      ctx.ck = new ContextKeys ();
      ctx.ck.add ( Fixtures.keys );
      for ( let i = 0, l = 1000; i < l; i++ ) {
        ctx.ck.onChange ( noop );
        ctx.ck.onChange ( noop );
        ctx.ck.onChange ( noop );
      }
    },
    beforeEach: noop,
    fn: ( ctx, i ) => {
      ctx.ck.set ( 'boolean', !!( i % 2 ) );
    }
  });

  benchmark ({
    name: 'expression:existent',
    before: ctx => {
      ctx.ck = new ContextKeys ();
      ctx.ck.add ( Fixtures.keys );
      for ( let i = 0, l = 1000; i < l; i++ ) {
        ctx.ck.onChange ( 'boolean', noop );
        ctx.ck.onChange ( 'boolean && string', noop );
        ctx.ck.onChange ( 'foo && bar', noop );
      }
    },
    beforeEach: noop,
    fn: ( ctx, i ) => {
      ctx.ck.set ( 'boolean', !!( i % 2 ) );
    }
  });

});

benchmark.summary ();
