var session = require('./newspace');
var finish = require('./setup_two'); 

var http = require('http');

var params=function(req){
  let q=req.url.split('?'),result={};
  if(q.length>=2){
      q[1].split('&').forEach((item)=>{
           try {
             result[item.split('=')[0]]=item.split('=')[1];
           } catch (e) {
             result[item.split('=')[0]]='';
           }
      })
  }
  return result;
}

http.createServer(function(request, response){
  const param = params(request).name;

  session.run(() => {
    start(param, response);
  });

}).listen(7000);

const fetchUserById = (param) => {

  return new Promise((res, rej) => {
    setTimeout(() => {
      res(`ajax: ${param}`)
    }, 3000)
  })
  // return Promise.resolve(`ajax: param`); // ${process.argv[2]}
}

function start(param, response) {
  // console.log('SYN start');
  // console.log('PARAM EXISTS?', session.get('param') );
  session.set('param', `${param}`); 
  session.set('response', response); 
  // console.log('set param/res');
  fetchUserById(param).then((user) => {
    // console.log('ASYNC CALLBACK start');
    // console.log('set user', user);
    session.set('user', user);
    finish();
  });
  // console.log('SYNC END');
}
 
