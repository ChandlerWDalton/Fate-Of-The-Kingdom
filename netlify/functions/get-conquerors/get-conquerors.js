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

const handler = async function () {
    const conquerors = await Conqueror.find();
  return {
      statusCode: 200,
      body: JSON.stringify(conquerors)
  }
}

module.exports = { handler }
