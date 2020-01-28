import React from 'react';
import PropTypes from 'prop-types';

const LabelTag = (props) => <span className={`contact-card__tag contact-card__tag--${props.type}`}>{props.text}</span>;

LabelTag.propTypes = {
  type: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default LabelTag;
