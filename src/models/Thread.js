const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    sender: { type: String, enum: ['user', 'bot'], required: true }
});

const threadSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    messages: [messageSchema]
});

module.exports = mongoose.model('Thread', threadSchema);