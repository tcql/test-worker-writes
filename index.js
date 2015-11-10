
var fs = require('fs'),
  fork = require('child_process').fork,
  path = require('path'),
  cpus = require('os').cpus().length;

var donecount = 0;
var sendcount = 10;
var workers = [];

console.error("creating "+cpus+" workers")
for (var i = 0; i < cpus; i++) {
  var worker = fork(path.join(__dirname, 'worker.js'), [i]);
  workers.push(worker);
  worker.on('message', function () { 
    console.error(++donecount, sendcount);
    if (donecount == sendcount) {
      process.exit();
    }
  });
}


for (var i = 0; i < sendcount; i++) {
  workers[i % workers.length].send(i);
}

