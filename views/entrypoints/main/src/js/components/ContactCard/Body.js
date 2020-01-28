import React from 'react';
import PropTypes from 'prop-types';
import _get from 'lodash/get';

import { displayDate } from '../../helpers/timeHelper';

import DetailsRow from './DetailsRow';
import { extractCallingCode } from '../../helpers/phoneHelper';

const ContactCardBody = (props) => {
  const countryCode = extractCallingCode(props.contact.phone.callingCode).numb;
  const phoneNumb = '+' + countryCode + props.contact.phone.phoneNumb;
  return (
    <div className="contact-card__body">
      <p className="contact-card__body__title">Contact Details</p>
      <div className="contact-card__details-container">
        {_get(props, 'contact.phone.phoneNumb') && (
          <DetailsRow
            child={
              <a href={'tel:' + phoneNumb} rel="nofollow">
                {phoneNumb}
              </a>
            }
            iconClass="fas fa-phone"
          />
        )}
        {props.contact.birth && (
          // should be a way to add birthday to OS calendar (Windows, Android, iOS, MacOSX)
          <DetailsRow child={displayDate(props.contact.birth)} iconClass="fas fa-birthday-cake" />
        )}
        {props.contact.jobTitle && <DetailsRow child={props.contact.jobTitle} iconClass="fas fa-id-badge" />}
        {props.contact.email && (
          <DetailsRow
            child={
              <a href={'mailto:' + props.contact.email} rel="nofollow">
                {props.contact.email}
              </a>
            }
            iconClass="fas fa-envelope"
          />
        )}
        {props.contact.address && <DetailsRow child={props.contact.address} iconClass="fas fa-map-marker-alt" />}
        {props.contact.website && (
          <DetailsRow
            child={
              <a target="_blank" href={props.contact.website} rel="nofollow noopener noreferrer">
                {props.contact.website}
              </a>
            }
            // child={<a href={props.contact.website} rel="nofollow">{props.contact.website}</a>}// when to use target="_blank" https://css-tricks.com/use-target_blank/
            iconClass="fas fa-globe"
          />
        )}
        {props.contact.note && <DetailsRow child={props.contact.note} iconClass="fas fa-sticky-note" />}
        {props.contact.relationship && (
          <DetailsRow child={props.contact.relationship} iconClass="fas fa-user-friends" />
        )}
      </div>
    </div>
  );
};

ContactCardBody.propTypes = {
  contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
};

export default ContactCardBody;
