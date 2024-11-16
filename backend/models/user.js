const mongoose = require('mongoose')

const user = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
})

const User = mongoose.models.user || mongoose.model("user", user);

module.exports =  mongoose.model("user", user)