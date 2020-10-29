const i18n = require('i18next');
const errorHelper = require('../helpers/errorHelper');

const createDocumentValidation = (postRequest) => {
    const errors = [];
    const errorSummary = [];

    if(postRequest['document-name'] === ''){
        errors.documentName = {
            text: i18n.t('createDocument:input.document_name.errors.required'),
            visuallyHiddenText: i18n.t('app:error-message.visuallyHiddenText')
        };
    }

    if(errors.documentName !== undefined){
        errorSummary.push(errorHelper.generateGlobalError('documentName', 'document-name', errors.documentName.text));
    }

    if(postRequest['document-link'] === ''){
        errors.documentLink = {
            text: i18n.t('createDocument:input.document_link.errors.required'),
            visuallyHiddenText: i18n.t('app:error-message.visuallyHiddenText')
        };
    }

    if(errors.documentLink !== undefined){
        errorSummary.push(errorHelper.generateGlobalError('documentLink', 'document-link', errors.documentLink.text));
    }

    if(Object.keys(errors).length !== 0){
        errors.errorSummary = errorSummary;
    }

    return errors;

};

module.exports.createDocumentValidation = createDocumentValidation;