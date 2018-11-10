import React from 'react';
import PropTypes from 'prop-types';

import { displayBirthday } from '../../helpers/timeHelper';

import DetailsRow from './DetailsRow';

const ContactCard__Body = props => (
    <div className="contact-card__body">
        <p className="contact-card__body-title">Contact Details</p>
        <div className="contact-card__details-container">
            {props.contact.phone && (
                <DetailsRow text={<a href={"tel:+84" + props.contact.phone} rel="nofollow">+84{props.contact.phone}</a>} iconClass="fa fa-phone" />
            )}
            {props.contact.birth && (
                <DetailsRow text={displayBirthday(props.contact.birth)} iconClass="fa fa-birthday-cake" />
            )}
            {props.contact.jobTitle && (
                <DetailsRow text={props.contact.jobTitle} iconClass="fa fa-id-badge" />
            )}
            {props.contact.email && (
                <DetailsRow text={<a href={"mailto:" + props.contact.email} rel="nofollow">{props.contact.email}</a>} iconClass="fa fa-envelope-o" />
            )}
            {props.contact.address && (
                <DetailsRow text={props.contact.address} iconClass="fa fa-map-marker" />
            )}
            {props.contact.website && (
                <DetailsRow text={<a target="_blank" href={props.contact.website} rel="nofollow">{props.contact.website}</a>} iconClass="fa fa-globe" />
            )}
            {props.contact.note && (
                <DetailsRow text={props.contact.note} iconClass="fa fa-sticky-note-o" />
            )}
            {props.contact.relationship && (
                <DetailsRow text={props.contact.relationship} iconClass="fa fa-users" />
            )}
        </div>
    </div>
);

ContactCard__Body.propTypes = {
    contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired
};

export default ContactCard__Body;
