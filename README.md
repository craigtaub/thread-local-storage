
### New arch
- new request
  - SYNC - calls callback, adds async to queue, addAsyncListener.exit clears namespace
  - when adds to queue addAsyncListener.create hands current namespace

-  event loop
  - addAsyncListener.before assigns handed context to current namespace

### Initial Arch
```
start-time
create empty process.namespaces = {}

create(name)
  namespace new instance of itself 
  namespace.id - AsyncListener with events attached 
  process.namespaces[name] - append namespace to global

run(cb) - CLS uses stack to know current context.
  context = createContext - this.active = null
  this.enter(context) - context =  {}, set to active + pushed _set 
  cb(context) - handed context to callback, my-app.  
    my-app set() - sets prop in this.active i.e. current context 
  exit(context) - set [null], active {prop: value} 
    if active === context - rm last element from set[] n returns it, sets to active. active is null

addAsyncListener.create - when async event queued
  return namespace.active - receives "storage" for other listeners

addAsyncListener.before - next tick
  namespace.enter(storage) - context from previous state. namespace instance created at start-time. storage comes from create() event
  my-app callback executed 
  get/set 

addAsyncListener.after - finished tick 
  namespace.exit(storage) - see above
```

### How is it CLS?
https://www.npmjs.com/package/continuation-local-storage
https://www.npmjs.com/package/async-listener