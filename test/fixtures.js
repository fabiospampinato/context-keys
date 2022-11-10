
/* MAIN */

const Fixtures = {
  keys: {
    null: null,
    number: 123,
    boolean: false,
    string: 'str',
    fnTrue: () => true,
    fnFalse: () => false,
    object: {
      foo: {
        bar: true
      }
    }
  },
  keysResolved: {
    null: null,
    number: 123,
    boolean: false,
    string: 'str',
    fnTrue: true,
    fnFalse: false,
    object: {
      foo: {
        bar: true
      }
    }
  }
};

/* EXPORT */

export default Fixtures;
