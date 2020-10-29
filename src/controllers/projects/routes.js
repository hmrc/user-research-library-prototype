const express = require('express');
const functions = require('./functions');

const router = new express.Router();

router.get('/', functions.viewAllProjects);

router.get('/create', functions.createProjectGet);
router.post('/create', functions.createProjectPost);

router.get('/:id', functions.viewProjectById);

router.get('/:id/edit', functions.editProjectGet);
router.post('/:id/edit', functions.editProjectPost);

router.get('/:id/documents/create', functions.createDocumentGet);
router.post('/:id/documents/create', functions.createDocumentPost);

router.get('/:id/documents/:documentId/delete', functions.deleteDocumentGet);
router.post('/:id/documents/:documentId/delete', functions.deleteDocumentPost);

router.get('/:id/contacts/add', functions.addContactGet);
router.post('/:id/contacts/add', functions.addContactPost);

router.get('/:id/contacts/:contactId/delete', functions.deleteContactGet);
router.post('/:id/contacts/:contactId/delete', functions.deleteContactPost);

module.exports = router;