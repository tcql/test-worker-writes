var id = process.argv[2];
var turfRandom = require('turf-random');

process.on('message', function () {
	var random = turfRandom('polygons', 1, {bbox: [-100, -70, 100, 70], num_vertices: 50});
	
	for (var i = 0; i < 20000; i++) {
		//process.stdout.write(JSON.stringify(random.features[0])+'\n');
		process.send(JSON.stringify(random.features[0]));
	}

	process.send("end");
});
