import React from 'react';
import PropTypes from 'prop-types';

import Tag from './Tag';

const ContactCardHeader = (props) => (
  <div className="contact-card__header">
    <div className="contact-card__avt">
      <div className="contact-card__avt__first-letter" style={{ backgroundColor: props.contact.color }}>
        {props.contact.name[0].toUpperCase()}
      </div>
    </div>
    <div className="contact-card__name-container">
      <h2 className="contact-card__name">{props.contact.name}</h2>
      <div className="contact-card__tags-container">
        {props.contact.labels.map((label) => {
          switch (label) {
          case 'family':
            return <Tag key="1" type="family" text="Family" />;
          case 'coWorker':
            return <Tag key="2" type="co-worker" text="Coworkers" />;
          case 'friends':
            return <Tag key="3" type="friends" text="Friends" />;
          }
        })}
      </div>
    </div>
  </div>
);

ContactCardHeader.propTypes = {
  contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
};

export default ContactCardHeader;
