const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const Schema = mongoose.Schema;


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0
    },
    signal: {
        type: [Schema.Types.ObjectId],
        ref : 'Signal'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.plugin(timestamp);

const User = mongoose.model("User", userSchema);
module.exports = User;