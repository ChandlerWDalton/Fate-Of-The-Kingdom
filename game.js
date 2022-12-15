const {model, Schema} = require('mongoose');

const Game = new Schema({
    gameId: String,
    user: Object,
    progress: Number
});

module.exports = model('game', Game);