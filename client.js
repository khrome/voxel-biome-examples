var createGame = require('voxel-engine');
var WorldBuilder = require('voxel-biomes');
var Player = require('voxel-player');
var fly = require('voxel-fly');
var highlight = require('voxel-highlight');

//Make The Biomes
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

//Make the Game
var game = createGame({
    generateVoxelChunk: function(low, high, x, y, z){
        return {
            position : [x, y, z],
            voxels : generator.generateSubmesh(x, y, z),
            dims : [32, 32, 32]
        };
    },
    materials: [
        ["grass_top.png", "grass_side.png","dirt.png"],
        "dirt.png",
        "log_oak.png",
        "leaves_oak.png",
        "cobblestone.png",
        "stone.png", "stone.png", "stone.png"
    ],
    chunkDistance: 3,
    texturePath: 'texture-packs/freeture/assets/minecraft/textures/blocks/',
    materialFlatColor: false,
    worldOrigin: [0, 0, 0],
    lightsDisabled: false,
    controls: { discreteFire: true }
});
var player = Player(game)('player.png');
player.possess();
player.yaw.position.set(2, 14, 4);
window.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 'R'.charCodeAt(0)) player.toggle()
});
var makeFly = fly(game)
var target = game.controls.target()
game.flyer = makeFly(target);
var blockPosPlace, blockPosErase
var hl = game.highlighter = highlight(game, { color: 0xff0000 })
hl.on('highlight', function (voxelPos) { blockPosErase = voxelPos })
hl.on('remove', function (voxelPos) { blockPosErase = null })
hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos })
hl.on('remove-adjacent', function (voxelPos) { blockPosPlace = null })
game.appendTo(document.body);
