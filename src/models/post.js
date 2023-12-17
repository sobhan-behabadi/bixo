const mongoose = require('mongoose');
const timestamp = require('mongoose-timestamp');
const {SchemaTypes} = require("mongoose");

const postSchema = new mongoose.Schema({
    // user: {
    //     type: SchemaTypes.ObjectId,
    //     ref: 'User'
    // },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    }

})

postSchema.plugin(timestamp);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;