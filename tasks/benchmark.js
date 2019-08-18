
/* IMPORT */

const {default: ContextKeys} = require ( '../dist' ),
      Mocks = require ( '../test/mocks' ),
      benchmark = require ( 'benchloop' );

/* BENCHMARK */

const noop = () => {};

benchmark.defaultOptions = Object.assign ( benchmark.defaultOptions, {
  iterations: 100000,
  log: 'compact',
  beforeEach: ctx => {
    ctx.ck = new ContextKeys ();
    ctx.ck.add ( Mocks.keys );
  }
});

benchmark ({
  name: 'add:string',
  fn: ( ctx, i ) => {
    ctx.ck.add ( String ( i ), true );
  }
});

benchmark ({
  name: 'add:object',
  fn: ( ctx, i ) => {
    ctx.ck.add ({ [i]: true });
  }
});

benchmark ({
  name: 'remove:string',
  fn: ctx => {
    ctx.ck.remove ( 'boolean' );
  }
});

benchmark ({
  name: 'remove:object',
  fn: ctx => {
    ctx.ck.remove ( Mocks.keys );
  }
});

benchmark ({
  name: 'reset',
  fn: ctx => {
    ctx.ck.reset ();
  }
});

benchmark ({
  name: 'get:single',
  fn: ctx => {
    ctx.ck.get ( 'boolean' );
  }
});

benchmark ({
  name: 'get:all',
  fn: ctx => {
    ctx.ck.get ();
  }
});

benchmark ({
  name: 'eval:single',
  fn: ctx => {
    ctx.ck.eval ( 'boolean' );
  }
});

benchmark ({
  name: 'eval:multiple',
  fn: ctx => {
    ctx.ck.eval ( 'boolean && string && foo.bar' );
  }
});

benchmark ({
  name: 'change:add',
  fn: ctx => {
    ctx.ck.onChange ( 'boolean', noop );
    ctx.ck.onChange ( 'boolean && string', noop );
    ctx.ck.onChange ( 'foo && bar', noop );
  }
});

benchmark ({
  name: 'change:remove',
  beforeEach: ctx => {
    ctx.ck = new ContextKeys ();
    ctx.ck.add ( Mocks.keys );
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

benchmark ({
  name: 'change:trigger:nonexistent',
  before: ctx => {
    ctx.ck = new ContextKeys ();
    ctx.ck.add ( Mocks.keys );
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
  name: 'change:trigger:existent',
  before: ctx => {
    ctx.ck = new ContextKeys ();
    ctx.ck.add ( Mocks.keys );
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
