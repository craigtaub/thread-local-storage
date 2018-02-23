var createNamespace = require('./namespace').createNamespace;
var session = createNamespace('my session');
var finish = require('./setup_two'); 

const fetchUserById = () => {
  console.log('RESOLVE')
  return Promise.resolve('ajax data');
}

function start() {
  console.log('start');
  session.set('init', 'one');
  console.log('set init');
  fetchUserById().then((user) => {
    // const user = 'test';
    // if (session.get('user')) {
    //   console.log('EXISTS')
    // }
    session.set('user', user);
    console.log('set user', user);
    finish();
  }).catch(err => {
    console.log('err', err)
  })
  console.log('SYNC END');
}
 
session.run(() => {
  start();
});