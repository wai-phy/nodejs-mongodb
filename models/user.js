const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 4,
        maxLength: 12
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    }
});

module.exports = model("User",userSchema);