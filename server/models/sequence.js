var mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
    maxDocumentId: { type: Number, require: true },
    maxMessageId: { type: Number, require: true },
    maxContactId: { type: Number, require: true },
});

module.exports = mongoose.model('Sequence', sequenceSchema);