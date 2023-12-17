const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const {SchemaTypes} = require("mongoose");

const signalSchema = new mongoose.Schema({
    // user: {
    //     type: SchemaTypes.ObjectId,
    //     ref: 'User'
    // },
    symbol: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    target: {
        type: Array,
        required: true
    },
    stop: {
        type: Array,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    deActive: {
        type: Boolean,
        default: false
    }

})

signalSchema.plugin(timestamp);

const Signal = mongoose.model("Signal", signalSchema);
module.exports = Signal;