// load polyfill if native support is unavailable
if (!process.addAsyncListener) require('async-listener');

const namespace = {
  run: (cb) => {
    cb();
    namespace.exit();
  },
  _set: [],
  set: (key, val) => {
    namespace.active[key] = val;
  },
  get: (key) => {
    if (namespace.active[key]) {
      return namespace.active[key]
    } 
    // console.log('ERROR get but no namespace')
  },
  active: {},
  enter: (context) => {
    namespace.active = context;
    // namespace._set.push(namespace.active);
  },
  // exit: (context) => {
    // if (namespace.active === context) {
      //   // namespace.active = namespace._set.pop();
      //   // console.log('EXIT active', this.active);
      //   return;
      // }
  exit: () => {
    namespace.active = {};
  }
};

namespace.id = process.addAsyncListener({
  create : function () { 
    return namespace.active; 
  },
  before : function (context, storage) { 
    if (storage) {
      // console.log('before - storage', storage);
      return namespace.enter(storage); 
    }
  },
  after  : function (context, storage) { 
    if (storage) {
      // console.log('after - storage', storage);
      // return namespace.exit(storage); 
      return namespace.exit(); 
    }
  },
});

module.exports = namespace;
