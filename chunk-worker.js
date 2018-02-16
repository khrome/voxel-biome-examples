var WorldBuilder = require('voxel-biomes');

var builder = new WorldBuilder();
builder.addBiome(require('voxel-biomes/biomes/hills'));
builder.addBiome(require('voxel-biomes/biomes/badlands'));
builder.addBiome(require('voxel-biomes/biomes/forest'));
builder.addBiome(require('voxel-biomes/biomes/woods'));
builder.addBiome(require('voxel-biomes/biomes/village'));
builder.addBiome(require('voxel-biomes/biomes/temple'));
builder.addBiome(require('voxel-biomes/biomes/megalith'));
builder.addBiome(require('voxel-biomes/biomes/plains'));
builder.addBiome(require('voxel-biomes/biomes/field'));
builder.addBiome(require('voxel-biomes/biomes/desert'));

var generator = builder.buildGenerator(
    WorldBuilder.Segmenters.primes()
);

onmessage = function(e) {
    var x = e.data[0];
    var y = e.data[1];
    var z = e.data[2];
    var result = {
        position : [x, y, z],
        voxels : generator.generateSubmesh(x, y, z),
        dims : [32, 32, 32]
    }
  //console.log('Message received from main script');
  //var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
  //console.log('Posting message back to main script');
  postMessage(result);
}
