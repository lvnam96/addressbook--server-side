const getErrorsFromValidationError = (validationError) => {
  const FIRST_ERROR = 0;
  return validationError.inner.reduce((errors, error) => {
    return {
      ...errors,
      [error.path]: error.errors[FIRST_ERROR],
    };
  }, {});
};

const validateSyncViaYup = (schema, values = {}) => {
  try {
    schema.validateSync(values, { abortEarly: false });
    return {};
  } catch (err) {
    console.error('SHITTTTT!!!! Error in form validation!', err);
    return getErrorsFromValidationError(err);
  }
};

const validateViaYup = async (schema, values = {}) => {
  return schema.validate(values, { abortEarly: false });
};

export const yup = {
  getErrorsFromValidationError,
  validateSync: validateSyncViaYup,
  validate: validateViaYup,
};
