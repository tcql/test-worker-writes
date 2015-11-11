
var fs = require('fs'),
  fork = require('child_process').fork,
  path = require('path'),
  cpus = require('os').cpus().length;

var donecount = 0;
var sendcount = 20;
var workers = [];

console.error("creating "+cpus+" workers")
for (var i = 0; i < cpus; i++) {
  var worker = fork(path.join(__dirname, 'worker.js'), [i]);
  workers.push(worker);
  worker.on('message', function (dt) {
    if (dt === "end") { 
      console.error(++donecount, sendcount);
      if (donecount == sendcount) {
        process.exit();
      }
    } else {
	process.stdout.write(dt+'\n');
    }
  });
}


for (var i = 0; i < sendcount; i++) {
  workers[i % workers.length].send(i);
}

