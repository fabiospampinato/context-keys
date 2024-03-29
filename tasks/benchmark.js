
/* IMPORT */

import benchmark from 'benchloop';
import ContextKeys from '../dist/index.js';
import {noop} from '../dist/utils.js';
import {KEYS} from '../test/fixtures.js';

/* MAIN */

benchmark.config ({
  iterations: 10_000,
  beforeEach: ctx => {
    ctx.ck = new ContextKeys ( KEYS );
  }
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

benchmark ({
  name: 'get',
  fn: ctx => {
    ctx.ck.get ( 'boolean' );
  }
});

benchmark ({
  name: 'has',
  fn: ctx => {
    ctx.ck.has ( 'boolean' );
  }
});

benchmark ({
  name: 'remove',
  fn: ctx => {
    ctx.ck.remove ( 'boolean' );
    ctx.ck.trigger ();
  }
});

benchmark ({
  name: 'reset',
  fn: ctx => {
    ctx.ck.reset ();
  }
});

benchmark ({
  name: 'set',
  fn: ( ctx, i ) => {
    ctx.ck.set ( String ( i ), true );
    ctx.ck.trigger ();
  }
});

benchmark.group ( 'trigger', () => {

  benchmark ({
    name: 'expression:nonexistent',
    before: ctx => {
      ctx.ck = new ContextKeys ( KEYS );
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
      ctx.ck.trigger ();
    }
  });

  benchmark ({
    name: 'expression:general',
    before: ctx => {
      ctx.ck = new ContextKeys ( KEYS );
      for ( let i = 0, l = 1000; i < l; i++ ) {
        ctx.ck.onChange ( noop );
        ctx.ck.onChange ( noop );
        ctx.ck.onChange ( noop );
      }
    },
    beforeEach: noop,
    fn: ( ctx, i ) => {
      ctx.ck.set ( 'boolean', !!( i % 2 ) );
      ctx.ck.trigger ();
    }
  });

  benchmark ({
    name: 'expression:existent',
    before: ctx => {
      ctx.ck = new ContextKeys ( KEYS );
      for ( let i = 0, l = 1000; i < l; i++ ) {
        ctx.ck.onChange ( 'boolean', noop );
        ctx.ck.onChange ( 'boolean && string', noop );
        ctx.ck.onChange ( 'foo && bar', noop );
      }
    },
    beforeEach: noop,
    fn: ( ctx, i ) => {
      ctx.ck.set ( 'boolean', !!( i % 2 ) );
      ctx.ck.trigger ();
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
      ctx.ck = new ContextKeys ( KEYS );
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
      ctx.ck = new ContextKeys ( KEYS );
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

benchmark.summary ();
