const {model, Schema} = require('mongoose');

const Game = new Schema({
    id: String,
    userName: String,
    userHealth: String,
    userPower: String,
    progress: Number,
    inventory: Array
});

module.exports = model('game', Game);