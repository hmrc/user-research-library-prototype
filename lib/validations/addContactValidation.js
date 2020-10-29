const i18n = require('i18next');
const errorHelper = require('../helpers/errorHelper');

const addContactValidation = (postRequest) => {
    const errors = [];
    const errorSummary = [];

    if(postRequest['contact-name'] === ''){
        errors.contactName = {
            text: i18n.t('addContact:input.contact_name.errors.required'),
            visuallyHiddenText: i18n.t('app:error-message.visuallyHiddenText')
        };
    }

    if(errors.contactName !== undefined){
        errorSummary.push(errorHelper.generateGlobalError('contactName', 'contact-name', errors.contactName.text));
    }

    if(postRequest['contact-email'] === ''){
      errors.contactEmail = {
          text: i18n.t('addContact:input.contact_email.errors.required'),
          visuallyHiddenText: i18n.t('app:error-message.visuallyHiddenText')
      };
  }

  if(errors.contactEmail !== undefined){
      errorSummary.push(errorHelper.generateGlobalError('contactEmail', 'contact-email', errors.contactEmail.text));
  }

    if(Object.keys(errors).length !== 0){
        errors.errorSummary = errorSummary;
    }

    return errors;

};

module.exports.addContactValidation = addContactValidation;