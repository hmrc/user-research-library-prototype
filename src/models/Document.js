const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    documentId: mongoose.Schema.Types.ObjectId,
    documentName: {
        type: String,
        required: true
    },
    documentLink: {
        type: String,
        required: true
    },
    documentType: {
        type: String
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId
    }
});

module.exports = mongoose.model('Document', DocumentSchema);