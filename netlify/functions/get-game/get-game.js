const mongoose = require('mongoose');
const {model, models, Schema} = require('mongoose');

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true
    }
).then(e => console.log('MongoDB Ready'))
.catch(console.error)

const GameSchema = new Schema({
    gameId: String,
    user: Object,
    progress: Number
});
let Game = models.game || model("game", GameSchema);

const handler = async function (event) {
    const gameId = event.queryStringParameters.id;
    if(gameId){
        let resumeGame = await Game.findOne({gameId});
        if (resumeGame){
            const response = {
                statusCode: 200,
                body: JSON.stringify(resumeGame),
            };
            return response;
        } else {
            return {
                statusCode: 403,
                msg: 'Unable to find game'
            }
        }
    } else {
        return {
            statusCode: 403,
            msg: 'Missing Game Id'
        }
    }
}

module.exports = { handler }
