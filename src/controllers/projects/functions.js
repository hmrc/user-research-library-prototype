const path = require('path');
const root = require('../../util/path');

const createProjectValidation = require('../../../lib/validations/createProjectValidation');
const editProjectValidation = require('../../../lib/validations/editProjectValidation');
const documentValidation = require('../../../lib/validations/createDocumentValidation');
const contactValidation = require('../../../lib/validations/addContactValidation');

const Project = require('../../models/Project');
const Document = require('../../models/Document');
const Contact = require('../../models/Contact');

const viewAllProjects = async (req, res) => {
    try {
        const projects = await Project.find(
                { 
                    projectName: { $regex: `${req.query['keywords'] || ''}`, $options: 'i' },
                    projectPhase: { $regex: `${req.query['phase'] || ''}`, $options: 'i' }
                }
            ).exec();
        res.render(path.join(root, 'src/views/pages', 'projects.html'), { projects: projects });
    } catch (error) {
        res.status(500).send(error);
    }
}

const viewProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).exec();
        const documents = await Document.find({ projectId: req.params.id });
        const contacts = await Contact.find({ projectId: req.params.id });

        res.render(path.join(root, 'src/views/pages', 'project.html'), { project: project, documents: documents, contacts: contacts });
    } catch (error) {
        res.status(500).send(error);
    }
}

const createProjectGet = (req, res) => {
    res.render(path.join(root, 'src/views/pages', 'create-project.html'));
};

const createProjectPost = async (req, res) => {

    const errors = createProjectValidation.createProjectValidation(req.body);

    if(Object.keys(errors).length === 0){
        const data = req.body;

        const project = new Project({
            projectName: data['project-name'],
            projectDetails: data.details,
            projectPhase: data.phase
        });

        try {
            const newProject = await project.save();
            res.redirect(`/projects/${newProject.id}`);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.render(path.join(root, 'src/views/pages', 'create-project.html'), { errors: errors });
    }
};

const searchProjects = async (req, res) => {

    const data = req.body;

    try {
        const projects = await Project.find({}).exec();
        res.render(path.join(root, 'src/views/pages', 'projects.html'), { projects: projects });
    } catch (error) {
        res.status(500).send(error);
    }

};

const createDocumentGet = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id).exec();
        res.render(path.join(root, 'src/views/pages', 'create-document.html'), { project: project });
    } catch (error) {
        res.status(500).send(error);
    }
};

const createDocumentPost = async (req, res) => {
    const errors = documentValidation.createDocumentValidation(req.body);

    if(Object.keys(errors).length === 0){
        const data = req.body;

        const document = new Document({
            documentName: data['document-name'],
            documentLink: data['document-link'],
            documentType: data['document-type'],
            projectId: req.params.id
        });

        try {
            const newDocument = await document.save();
            res.redirect(`/projects/${newDocument.projectId}`);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.render(path.join(root, 'src/views/pages', 'create-document.html'), { errors: errors });
    }
};

const deleteDocumentGet = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).exec();
        const document = await Document.findById(req.params.documentId).exec();

        res.render(path.join(root, 'src/views/pages', 'delete-document.html'), { project: project, document: document });
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteDocumentPost = async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.documentId);

        const project = await Project.findById(req.params.id).exec();
        const documents = await Document.find({ projectId: req.params.id });
        const contacts = await Contact.find({ projectId: req.params.id });

        res.render(path.join(root, 'src/views/pages', 'project.html'), { project: project, documents: documents, contacts: contacts });

    } catch (error) {
        res.status(500).send(error);
    }
};

const addContactGet = async (req, res) => {
    try{
        const project = await Project.findById(req.params.id).exec();
        res.render(path.join(root, 'src/views/pages', 'add-contact.html'), { project: project });
    } catch (error) {
        res.status(500).send(error);
    }
    
};

const addContactPost = async (req, res) => {
    const errors = contactValidation.addContactValidation(req.body);

    if(Object.keys(errors).length === 0){
        const data = req.body;

        const existingContact = await Contact.findOne({ contactEmail: data['contact-email'] });

        if(existingContact){
            await Contact.update(
                { "_id": existingContact.id },
                { $push: { projectId: req.params.id }}
            );

            res.redirect(`/projects/${req.params.id}`);
            
        } else {
            const contact = new Contact({
                contactName: data['contact-name'],
                contactEmail: data['contact-email'],
                projectId: req.params.id
            });

            try {
                await contact.save();
                res.redirect(`/projects/${req.params.id}`);
            } catch (error) {
                res.status(400).json({ message: error.message });
            }
        }
    } else {
        res.render(path.join(root, 'src/views/pages', 'add-contact.html'), { errors: errors });
    }
};

const deleteContactGet = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).exec();
        const contact = await Contact.findById(req.params.contactId).exec();

        res.render(path.join(root, 'src/views/pages', 'delete-contact.html'), { project: project, contact: contact });
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteContactPost = async (req, res) => {
    try{
        await Contact.update(
            { "_id": req.params.contactId },
            { $pull: { projectId: req.params.id }}
        );

        const project = await Project.findById(req.params.id).exec();
        const documents = await Document.find({ projectId: req.params.id });
        const contacts = await Contact.find({ projectId: req.params.id });

        res.render(path.join(root, 'src/views/pages', 'project.html'), { project: project, documents: documents, contacts: contacts });

    } catch (error) {
        res.status(500).send(error);
    }
};

const editProjectGet = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).exec();

        res.render(path.join(root, 'src/views/pages', 'edit-project.html'), { project: project });
    } catch (error) {
        res.status(500).send(error);
    }
};

const editProjectPost = async (req, res) => {
    const errors = editProjectValidation.editProjectValidation(req.body);

    if(Object.keys(errors).length === 0){
        const data = req.body;

        try {
            await Project.update(
                { "_id": req.params.id },
                { 
                    projectName: data['project-name'],
                    projectDetails: data.details,
                    projectPhase: data.phase
                }
            );
            res.redirect(`/projects/${req.params.id}`);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    } else {
        res.render(path.join(root, 'src/views/pages', 'edit-project.html'), { errors: errors });
    }
};


module.exports.viewAllProjects = viewAllProjects;
module.exports.viewProjectById = viewProjectById;
module.exports.createProjectGet = createProjectGet;
module.exports.createProjectPost = createProjectPost;
module.exports.searchProjects = searchProjects;
module.exports.createDocumentGet = createDocumentGet;
module.exports.createDocumentPost = createDocumentPost;
module.exports.deleteDocumentGet = deleteDocumentGet;
module.exports.deleteDocumentPost = deleteDocumentPost;
module.exports.addContactGet = addContactGet;
module.exports.addContactPost = addContactPost;
module.exports.deleteContactGet = deleteContactGet;
module.exports.deleteContactPost = deleteContactPost;
module.exports.editProjectGet = editProjectGet;
module.exports.editProjectPost = editProjectPost;