var mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    maxDocumentId: { type: String },
    maxMessageId: { type: String },
    MaxContactId: { type: String },
});

module.exports = mongoose.model('Sequence', sequenceSchema);