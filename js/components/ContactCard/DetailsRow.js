import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__DetailsRow = props => (
    <div className="contact-card__details">
        <div className="contact-card__details-text">
            <span>{props.text}</span>
        </div>
        <div className="contact-card__details-icon">
            <div>
                <i className={props.iconClass}></i>
            </div>
        </div>
    </div>
);

ContactCard__DetailsRow.propTypes = {
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    iconClass: PropTypes.string.isRequired
};

export default ContactCard__DetailsRow;
