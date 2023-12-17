const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const {SchemaTypes} = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: {
        type: SchemaTypes.ObjectId,
        ref: 'User'
    },
    resNumber: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    payment: {
        type: Boolean,
        defaults: false
    }

})

paymentSchema.plugin(timestamp);

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;