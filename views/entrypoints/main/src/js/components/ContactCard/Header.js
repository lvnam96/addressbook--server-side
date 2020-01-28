import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LabelTag from './LabelTag.jsx';
import LetterAvatar from '../ContactForm/LetterAvatar.jsx';

const ContactCardHeader = (props) => {
  const hasLabels = props.contact.labels.length > 0;
  return (
    <div className="contact-card__header">
      <div className="contact-card__avt-ctnr">
        <LetterAvatar color={props.contact.color} firstLetter={props.contact.name[0].toUpperCase()} />
      </div>
      <div className="contact-card__name-ctnr">
        <h2
          className={classNames('contact-card__name', {
            'mb-0': !hasLabels,
          })}
        >
          {props.contact.name}
        </h2>
        {hasLabels && (
          <div className="contact-card__tags-ctnr">
            {props.contact.labels.map((labelObj) => {
              return <LabelTag key={labelObj.value} type={labelObj.value} text={labelObj.label} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
};

ContactCardHeader.propTypes = {
  contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
};

export default ContactCardHeader;
