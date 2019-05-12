import React from 'react';
import PropTypes from 'prop-types';

import { displayBirthday } from '../../helpers/timeHelper';

import DetailsRow from './DetailsRow';

const ContactCard__Body = props => (
    <div className="contact-card__body">
        <p className="contact-card__body-title">Contact Details</p>
        <div className="contact-card__details-container">
            {props.contact.phone && (
                <DetailsRow
                    child={<a href={"tel:+84" + props.contact.phone} rel="nofollow">+84{props.contact.phone}</a>}
                    iconClass="fas fa-phone"
                />
            )}
            {props.contact.birth && (
                <DetailsRow
                    child={displayBirthday(props.contact.birth)}
                    iconClass="fas fa-birthday-cake"
                />
            )}
            {props.contact.jobTitle && (
                <DetailsRow
                    child={props.contact.jobTitle}
                    iconClass="fas fa-id-badge"
                />
            )}
            {props.contact.email && (
                <DetailsRow
                    child={<a href={"mailto:" + props.contact.email} rel="nofollow">{props.contact.email}</a>}
                    iconClass="fas fa-envelope"
                />
            )}
            {props.contact.address && (
                <DetailsRow
                    child={props.contact.address}
                    iconClass="fas fa-map-marker-alt"
                />
            )}
            {props.contact.website && (
                <DetailsRow
                    child={<a target="_blank" href={props.contact.website} rel="nofollow noopener noreferrer">{props.contact.website}</a>}
                    // child={<a href={props.contact.website} rel="nofollow">{props.contact.website}</a>}// when to use target="_blank" https://css-tricks.com/use-target_blank/
                    iconClass="fas fa-globe"
                />
            )}
            {props.contact.note && (
                <DetailsRow
                    child={props.contact.note}
                    iconClass="fas fa-sticky-note"
                />
            )}
            {props.contact.relationship && (
                <DetailsRow
                    child={props.contact.relationship}
                    iconClass="fas fa-user-friends"
                />
            )}
        </div>
    </div>
);

ContactCard__Body.propTypes = {
    contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired
};

export default ContactCard__Body;
