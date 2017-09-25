import React, { Component } from 'react';
import PropTypes from 'prop-types';
<<<<<<< HEAD
import Form from './form';
=======
import Form from './Form';
>>>>>>> refactoring

const AddContactForm = props => (
    <Form title="Add new contact" {...props} />
);

AddContactForm.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired,
    onClose: PropTypes.func.isRequired,
    handlerSubmit: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired,
    getRandomColor: PropTypes.func.isRequired
};

export default AddContactForm;
