const {model, Schema} = require('mongoose');

const Game = new Schema({
    id: String,
    user: Object,
    progress: Number
});

module.exports = model('game', Game);