#!/usr/bin/env node
console.log(process.argv.slice(2));
var Server = require('voxel-async-simulation/server');
var WorldBuilder = require('voxel-biomes');
var texturePackLoad = require('voxel-minecraft-texture-pack-loader');

texturePackLoad('./docs/texture-packs/freeture', function(err, texturePack){
    if(err) return console.log('Textures failed to loads.');
    console.log('Textures Loaded.');
    var builder = new WorldBuilder({
        blockLookup : texturePack
    });
    var biomes = {
        common : 0,
        uncommon : 0,
        rare : 0
    }
    process.argv.slice(2).forEach(function(biomePath){
        console.log('require', biomePath)
        var biome = require(biomePath);
        builder.addBiome(biome);
    });

    Object.keys(biomes).forEach(function(rarity){
        if(!biomes[rarity]){
            builder.addBiome({
                name : 'biome'+Math.floor(Math.random()*5000),
                rarity : rarity,
                generator : function(subX, subY, subZ, context){
                    return function(x, y, z){
                        if (y===5) return 1;
                        return 0;
                    }
                }
            });
        }
    })
    var app = new Server();
    app.setTexturePack(texturePack);
    app.setBuilder(builder);
    app.use(function(req,res,next){
        res.header("Access-Control-Allow-Origin", "*"); //this gets served on localhost
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, GET, POST, DELETE, OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
    app.setGenerator(builder.buildGenerator(WorldBuilder.Segmenters.primes()));
    app.setStorage(Server.Storage.memory());
    var instance = app.listen(8081, function(){
        console.log('Server listening on port 8081.');
    });
});
