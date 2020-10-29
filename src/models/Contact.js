const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
    contactId: mongoose.Schema.Types.ObjectId,
    contactName: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: true
    },
    projectId: [
      {
        type: mongoose.Schema.Types.ObjectId
      } 
    ]
});

module.exports = mongoose.model('Contact', ContactSchema);