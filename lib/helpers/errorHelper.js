module.exports = {
    generateGlobalError(type, fieldName, errorText, dataJourney) {
        return {
          href: `#${fieldName}`,
          text: errorText,
          attributes: { 'data-journey': dataJourney },
        };
      }
};