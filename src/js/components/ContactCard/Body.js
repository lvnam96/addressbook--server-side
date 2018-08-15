// import React from 'react';
import PropTypes from 'prop-types';

import { convertBirthday } from '../../helpers/timeHelper';

import DetailsRow from './DetailsRow';

const ContactCard__Body = props => (
    <div className="contact-card__body">
        <p className="contact-card__body-title">Contact Details</p>
        <div className="contact-card__details-container">
            {props.phone && (
                <DetailsRow text={<a href={"tel:+84" + props.phone} rel="nofollow">+84{props.phone}</a>} iconClass="fa fa-phone" />
            )}
            {props.birth && (
                <DetailsRow text={convertBirthday(props.birth)} iconClass="fa fa-birthday-cake" />
            )}
            {props.jobTitle && (
                <DetailsRow text={props.jobTitle} iconClass="fa fa-id-badge" />
            )}
            {props.email && (
                <DetailsRow text={<a href={"mailto:" + props.email}>{props.email}</a>} iconClass="fa fa-envelope-o" />
            )}
            {props.address && (
                <DetailsRow text={props.address} iconClass="fa fa-map-marker" />
            )}
            {props.website && (
                <DetailsRow text={<a href={props.website}>{props.website}</a>} iconClass="fa fa-globe" />
            )}
            {props.note && (
                <DetailsRow text={props.note} iconClass="fa fa-sticky-note-o" />
            )}
            {props.relationship && (
                <DetailsRow text={props.relationship} iconClass="fa fa-users" />
            )}
        </div>
    </div>
);

ContactCard__Body.propTypes = {
    phone: PropTypes.string,
    birth: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    website: PropTypes.string,
    note: PropTypes.string
};

export default ContactCard__Body;
