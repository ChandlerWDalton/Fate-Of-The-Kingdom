const Game = require('./game');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8000
const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true
    }
)
.then(e => console.log('MongoDB Ready'))
.catch(console.error);


app.use(express.static('game'))
app.use(bodyParser.json());

app.get('/game/:id', async (req, res) => {
    if(req.params.id){
       const id = req.params.id
       let game = await Game.findOne({id});
       if (game){
        res.status(200).send(game);
       } else {
            res.status(403).send({msg: 'Unable to find game'})
       }
    } else {
        res.status(403).send({msg: 'Request must have an id '})
    }
});

app.post('/game', async (req, res) => {
    if(req.body.game){
        const game = new Game({
            ...req.body.game
        })
        await game.save().then(doc => {
            console.log('new game saved to DB');
            console.log(doc)
        })
        res.status(200).send('Save Complete')
    } else {
        res.status(403).send({msg: 'Request Body must contain a valid game object'})
    }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})