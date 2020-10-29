const i18n = require('i18next');
const errorHelper = require('../helpers/errorHelper');

const createProjectValidation = (postRequest) => {
    const errors = [];
    const errorSummary = [];

    if(postRequest['project-name'] === ''){
        errors.projectName = {
            text: i18n.t('createProject:input.project_name.errors.required'),
            visuallyHiddenText: i18n.t('app:error-message.visuallyHiddenText')
        };
    }

    if(errors.projectName !== undefined){
        errorSummary.push(errorHelper.generateGlobalError('createProject', 'project-name', errors.projectName.text));
    }

    if(postRequest.details === ''){
        errors.details = {
            text: i18n.t('createProject:text_area.details.errors.required'),
            visuallyHiddenText: i18n.t('app:error-message.visuallyHiddenText')
        };
    }  

    if(errors.details !== undefined){
        errorSummary.push(errorHelper.generateGlobalError('createProject', 'details', errors.details.text));
    }

    if(Object.keys(errors).length !== 0){
        errors.errorSummary = errorSummary;
    }

    return errors;

};

module.exports.createProjectValidation = createProjectValidation;