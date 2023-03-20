const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require('luxon')

const Message = new Schema({
    user: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 20
    },
    message: {
        type: String,
        maxLength: 1000,
        minLength: 1,
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    }
})

MessageSchema.virtual("date").get(function() {
  return DateTime.fromJSDate(this.timestamp).toFormat("yyyy-MM-dd, HH:mm");
});

module.exports = mongoose.model('Message', MessageSchema)