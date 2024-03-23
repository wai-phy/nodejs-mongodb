const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 4
    },
    resetToken: String,
    tokenExpiration: Date
});

module.exports = model("User",userSchema);