// load polyfill if native support is unavailable
if (!process.addAsyncListener) require('async-listener');

function Namespace(name) {
  this.name   = name;
  // changed in 2.7: no default context
  this.active = null;
  this._set   = [];
  this.id     = null;
}

Namespace.prototype.set = function (key, value) {
  // if (!this.active) {
  //   throw new Error("No context available. ns.run() or ns.bind() must be called first.");
  // }

  this.active[key] = value;
  return value;
};

Namespace.prototype.get = function (key) {
  if (!this.active) return undefined;

  return this.active[key];
};

Namespace.prototype.run = function (fn) {
  // var context = this.createContext();
  var context = Object.create(this.active);
  this.enter(context);
  try {
    // console.log('TRY 1');
    fn(context);
    // console.log('TRY 2');
    return context;
  }
  finally {
    console.log('FINALLY');
    // console.log('this._set', this._set);
    // console.log('this.active', this.active);
    this.exit(context);
  }
};

Namespace.prototype.enter = function (context) {
  // console.log('ENTER', context); 

  this._set.push(this.active);
  this.active = context;
};

Namespace.prototype.exit = function (context) {
  // Fast path for most exits that are at the top of the stack
  if (this.active === context) {
    // console.log('EXIT active1', this.active);
    this.active = this._set.pop();
    console.log('EXIT active', this.active);
    return;
  }
};

function get(name) {
  return process.namespaces[name];
}

function create(name) {
  // console.log('CREATE');

  var namespace = new Namespace(name);
  namespace.id = process.addAsyncListener({
    create : function () { 
      // if (Object.keys(namespace.active).length) { // {} 
      //   console.log('create callback', namespace.active); // { user: 'some data' }
      // }
      return namespace.active; 
    },
    before : function (context, storage) { 
      if (storage) {
        console.log('before - storage', storage);
        return namespace.enter(storage); 
      }
    },
    after  : function (context, storage) { 
      if (storage) {
      // console.log('AFTER')
        return namespace.exit(storage); 
      }
    },
  });

  process.namespaces[name] = namespace;
  return namespace;
}

process.namespaces = Object.create(null);

module.exports = {
  getNamespace     : get,
  createNamespace  : create
};
