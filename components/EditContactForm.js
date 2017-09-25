import React, { Component } from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import Form from './form';
=======
import Form from './Form';
>>>>>>> refactoring

const EditContactForm = props => (
    <Form title="Edit Contact" {...props} />
);

EditContactForm.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
    handlerSubmit: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired,
    getRandomColor: PropTypes.func.isRequired
};

export default EditContactForm;
