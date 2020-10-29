const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectId: mongoose.Schema.Types.ObjectId,
    projectName: {
        type: String,
        required: true
    },
    projectDetails: {
        type: String,
        required: true
    },
    projectPhase: {
        type: String
    }
});

module.exports = mongoose.model('Project', ProjectSchema);