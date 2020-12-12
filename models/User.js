const mongoose = require('mongoose')

require("dotenv").config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true})

const UserSchema = mongoose.Schema({ id : Number, group : String })
const User = mongoose.model('User', UserSchema)

module.exports = User