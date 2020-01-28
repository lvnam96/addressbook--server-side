import React from 'react';
import PropTypes from 'prop-types';

const ContactCardDetailsRow = (props) => (
  <div className="contact-card__details-row">
    <div className="contact-card__details-row__text">
      <p>{props.child}</p>
    </div>
    <div className="contact-card__details-row__icon">
      <i className={props.iconClass} />
    </div>
  </div>
);

ContactCardDetailsRow.propTypes = {
  child: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  iconClass: PropTypes.string.isRequired,
};

export default ContactCardDetailsRow;
