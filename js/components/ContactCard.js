import React from 'react';
import PropTypes from 'prop-types';

import CCButtonsContainer from './CCButtonsContainer';
import CCHeader from './CCHeader';
import CCBody from './CCBody';

const ContactCard = props => (
    <div className="overlay" onClick={props.onClose}>
        <div className="contact-card" onClick={e => e.stopPropagation()}>
            <CCButtonsContainer contactId={props.id} contactIndex={props.contactIndex} onClose={props.onClose} onEditContact={props.onEditContact} onRemoveContact={props.onRemoveContact} />
            <CCHeader name={props.name} labels={props.labels} color={props.color} />
            <CCBody phone={props.phone} birth={props.birth} email={props.email} address={props.address} website={props.website} note={props.note} />
        </div>
    </div>
);

ContactCard.propTypes = {
    contactIndex: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onEditContact: PropTypes.func.isRequired,
    onRemoveContact: PropTypes.func.isRequired
};

export default ContactCard;
