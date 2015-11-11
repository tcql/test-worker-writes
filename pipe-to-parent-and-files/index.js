
var fs = require('fs'),
  fork = require('child_process').fork,
  path = require('path'),
  cpus = require('os').cpus().length,
  CombinedStream = require('combined-stream2');

var donecount = 0;
var sendcount = 20;
var workers = [];
var files = [];

console.error("creating "+cpus+" workers")
for (var i = 0; i < cpus; i++) {
  var worker = fork(path.join(__dirname, 'worker.js'), [i], {silent: true}); 
  var workerFile = fs.createWriteStream(path.join(__dirname, '_worker_'+i));

  worker.stdout.pipe(workerFile);
  files.push(workerFile);
  workers.push(worker);
  worker.on('message', function () { 
    console.error(++donecount, sendcount);
    if (donecount === sendcount) workers.forEach(function (w) { w.kill(); });
  });
}

var filesEnd = 0;
files.forEach(function (f) {
  f.on('finish', function () { 
	  if (++filesEnd === workers.length) {
      var combiner = CombinedStream.create();
      for (var f = 0; f < workers.length; f++) { 
        var stream = fs.createReadStream(__dirname+'/_worker_'+f, {encoding: 'utf8'});
        combiner.append(stream);
      }
      combiner.pipe(process.stdout)
	  }
  });
});

for (var i = 0; i < sendcount; i++) {
  workers[i % workers.length].send(i);
}

