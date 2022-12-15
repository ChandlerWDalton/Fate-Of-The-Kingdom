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

const handler = async function (event, context) {
    const eventBody = JSON.parse(event.body);
    const gameId = eventBody.game.gameId;
    if(gameId){
        let game = await Game.findOne({gameId});
        if (game){
            game.gameId = eventBody.game.gameId
            game.user = eventBody.game.user
            game.progress = eventBody.game.progress
            await game.save()
            return {
                statusCode: 200,
                body: JSON.stringify({msg: 'Save Complete'})
            }
        } else {
            const game = new Game({
                ...eventBody.game
            })
            await game.save()
            return {
                statusCode: 200,
                body: JSON.stringify({msg: 'Save Complete'})
            }
        }
    } else {
        return {
            statusCode: 403,
            body: JSON.stringify({msg: 'No Game was sent'})
        }
    }
}

module.exports = { handler }
