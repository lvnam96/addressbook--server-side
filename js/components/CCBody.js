import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__Body = props => {
    let month;
    if (props.birth) {
        switch (parseInt(props.birth.split('-')[1])) {
        case 1:
            month = 'Jan';
        break;
        case 2:
            month = 'Feb';
        break;
        case 3:
            month = 'Mar';
        break;
        case 4:
            month = 'Apr';
        break;
        case 5:
            month = 'May';
        break;
        case 6:
            month = 'Jun';
        break;
        case 7:
            month = 'Jul';
        break;
        case 8:
            month = 'Aug';
        break;
        case 9:
            month = 'Sep';
        break;
        case 10:
            month = 'Oct';
        break;
        case 11:
            month = 'Nov';
        break;
        case 12:
            month = 'Dec';
        break;
        }
    }

    return (
        <div className="contact-card__body">
            <p>Contact Details</p>
            <div className="contact-card__details">
                {props.phone && (<div>
                    <div className="contact-card__details__info">
                        <span><a href={"tel:+84" + props.phone} rel="nofollow">+84{props.phone}</a></span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-phone"></i>
                        </div>
                    </div>
                </div>)}
                {props.birth && (<div>
                    <div className="contact-card__details__info">
                        <span>{`${month} ${props.birth.split('-')[2]}, ${props.birth.split('-')[0]}`}</span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-birthday-cake"></i>
                        </div>
                    </div>
                </div>)}
                {props.jobTitle && (<div>
                    <div className="contact-card__details__info">
                        <span>{props.jobTitle}</span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-id-badge"></i>
                        </div>
                    </div>
                </div>)}
                {props.email && (<div>
                    <div className="contact-card__details__info">
                        <span><a href={"mailto:" + props.email}>{props.email}</a></span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-envelope-o"></i>
                        </div>
                    </div>
                </div>)}
                {props.address && (<div>
                    <div className="contact-card__details__info">
                        <span>{props.address}</span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-map-marker"></i>
                        </div>
                    </div>
                </div>)}
                {props.website && (<div>
                    <div className="contact-card__details__info">
                        <span><a href={props.website}>{props.website}</a></span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-globe"></i>
                        </div>
                    </div>
                </div>)}
                {props.note && (<div>
                    <div className="contact-card__details__info">
                        <span>{props.note}</span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-sticky-note-o"></i>
                        </div>
                    </div>
                </div>)}
                {props.relationship && (<div>
                    <div className="contact-card__details__info">
                        <span>{props.relationship}</span>
                    </div>
                    <div className="contact-card__details__icon">
                        <div>
                            <i className="fa fa-users"></i>
                        </div>
                    </div>
                </div>)}
            </div>
        </div>
    );
};

ContactCard__Body.propTypes = {
    phone: PropTypes.string,
    birth: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    website: PropTypes.string,
    note: PropTypes.string
};

export default ContactCard__Body;
