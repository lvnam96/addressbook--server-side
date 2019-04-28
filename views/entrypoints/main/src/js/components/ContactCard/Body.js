import React from 'react';
import PropTypes from 'prop-types';

import { displayBirthday } from '../../helpers/timeHelper';

import DetailsRow from './DetailsRow';

const ContactCard__Body = props => (
    <div className="contact-card__body">
        <p className="contact-card__body-title">Contact Details</p>
        <div className="contact-card__details-container">
            {props.contact.phone && (
                <DetailsRow text={<a href={"tel:+84" + props.contact.phone} rel="nofollow">+84{props.contact.phone}</a>} iconClass="fas fa-phone" />
            )}
            {props.contact.birth && (
                <DetailsRow text={displayBirthday(props.contact.birth)} iconClass="fas fa-birthday-cake" />
            )}
            {props.contact.jobTitle && (
                <DetailsRow text={props.contact.jobTitle} iconClass="fas fa-id-badge" />
            )}
            {props.contact.email && (
                <DetailsRow text={<a href={"mailto:" + props.contact.email} rel="nofollow">{props.contact.email}</a>} iconClass="fas fa-envelope" />
            )}
            {props.contact.address && (
                <DetailsRow text={props.contact.address} iconClass="fas fa-map-marker-alt" />
            )}
            {props.contact.website && (
                <DetailsRow text={<a target="_blank" href={props.contact.website} rel="nofollow noopener noreferrer">{props.contact.website}</a>} iconClass="fas fa-globe" />
            )}
            {props.contact.note && (
                <DetailsRow text={props.contact.note} iconClass="fas fa-sticky-note" />
            )}
            {props.contact.relationship && (
                <DetailsRow text={props.contact.relationship} iconClass="fas fa-user-friends" />
            )}
        </div>
    </div>
);

ContactCard__Body.propTypes = {
    contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired
};

export default ContactCard__Body;
