var getNamespace = require('./namespace').getNamespace;
var session = getNamespace('my session');

module.exports = () => {
  console.log('get user', session.get('user') );
  console.log('get init', session.get('init') );
  console.log('RENDER');
}