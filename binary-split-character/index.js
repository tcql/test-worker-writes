
var fs = require('fs'),
  fork = require('child_process').fork,
  path = require('path'),
  cpus = require('os').cpus().length,
  split = require('binary-split');

var donecount = 0;
var sendcount = 20;
var workers = [];

console.error("creating "+cpus+" workers")
process.stdout.setMaxListeners(cpus);
for (var i = 0; i < cpus; i++) {
  var worker = fork(path.join(__dirname, 'worker.js'), [i], {silent: true});
  workers.push(worker);
  worker.stdout.pipe(split('\x1e')).pipe(process.stdout);
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

