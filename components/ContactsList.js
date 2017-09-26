import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';

const ContactsList = props => (
    <ul className='contact-list'>
        <TransitionGroup>
            {props.contacts.length > 0 && props.contacts}
        </TransitionGroup>
    </ul>
);

ContactsList.propTypes = {
    contacts: PropTypes.array.isRequired
};

export default ContactsList;
