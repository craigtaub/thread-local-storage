var session = require('./newspace');

module.exports = () => {
  // console.log('get param', session.get('param') );
  
  // console.log('RENDER');
  const response = session.get('response');
  // console.log('done?', response.done); // if 2nd request using 1st request obj this will b true
  response.done = true;
  response.writeHead(200, {'Content-type':'text/plan'});
  response.write(`Param: ${session.get('param')} \n`);
  response.write(`User: ${session.get('user')} \n`);
  response.end();
}