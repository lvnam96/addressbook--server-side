import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

const ContactsList = props => (
    <TransitionGroup component="ul" className="contact-list">
        {props.children}
    </TransitionGroup>
);

ContactsList.propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired
};

export default ContactsList;
