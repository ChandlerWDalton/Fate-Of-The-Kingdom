const mongoose = require('mongoose');
const {model, models, Schema} = require('mongoose');

mongoose.connect(
    process.env.MONGO_URI,
    {
        useNewUrlParser: true
    }
).then(e => console.log('MongoDB Ready'))
.catch(console.error)

const ConquerorSchema = new Schema({
    user: Object
});
let Conqueror = models.conqueror || model("conqueror", ConquerorSchema);

const handler = async function (event) {
    const eventBody = JSON.parse(event.body);
    if(eventBody.user){
        const conqueror = new Conqueror({
            user: eventBody.user
        })
        await conqueror.save()
        return {
            statusCode: 200,
            body: JSON.stringify({msg: 'Save Complete'})
        }
    } else {
        return {
            statusCode: 403,
            body: JSON.stringify({msg: 'No User was sent'})
        }
    }
}

module.exports = { handler }
