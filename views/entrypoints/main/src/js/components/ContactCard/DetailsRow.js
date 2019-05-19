import React from 'react';
import PropTypes from 'prop-types';

const DetailsRow = (props) => (
  <div className="contact-card__details">
    <div className="contact-card__details-text">
      <span>{props.child}</span>
    </div>
    <div className="contact-card__details-icon">
      <i className={props.iconClass} />
    </div>
  </div>
);

DetailsRow.propTypes = {
  child: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  iconClass: PropTypes.string.isRequired,
};

export default DetailsRow;
