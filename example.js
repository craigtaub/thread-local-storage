var createNamespace = require('continuation-local-storage').createNamespace;
var writer = createNamespace('writer');

writer.run(function () {
 writer.set('value', 0);

 requestHandler();
});

function requestHandler() {
 writer.run(function(outer) {
   // writer.get('value') returns 0
   // outer.value is 0
   writer.set('value', 1);
   // writer.get('value') returns 1
   // outer.value is 1
   process.nextTick(function() {
     // writer.get('value') returns 1
     // outer.value is 1
     writer.run(function(inner) {
       // writer.get('value') returns 1
       // outer.value is 1
       // inner.value is 1
        console.log(writer.get('value'))
       writer.set('value', 2);
       // writer.get('value') returns 2
       // outer.value is 1
       // inner.value is 2
     });
   });
 });

 setTimeout(function() {
   // runs with the default context, because nested contexts have ended
   console.log(writer.get('value')); // prints 0
 }, 1000);
}