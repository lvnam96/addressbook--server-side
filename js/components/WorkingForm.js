import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditContactForm from './EditContactForm';
import AddContactForm from './AddContactForm';

const WorkingForm = props => {
    if (props.isEditing) {
        return (
            <EditContactForm {...props.editingContact}
                onClose={props.onClose}
                showNoti={props.showNoti}
                // handlerSubmit={props.onSave}
                refresh={props.refresh}
                changeContactIndex={props.changeContactIndex}
                getRandomColor={props.getRandomColor} />
        );
    }
    return (
        <AddContactForm {...props.newContact}
            onClose={props.onClose}
            showNoti={props.showNoti}
            refresh={props.refresh}
            // handlerSubmit={props.onAdd}
            getRandomColor={props.getRandomColor} />
    );
};

WorkingForm.propTypes = {
    isEditing: PropTypes.bool.isRequired,
    newContact: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    refresh: PropTypes.func.isRequired,
    changeContactIndex: PropTypes.func.isRequired,
    showNoti: PropTypes.func.isRequired,
    getRandomColor: PropTypes.func.isRequired
};

export default WorkingForm;
