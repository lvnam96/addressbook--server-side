import React from 'react';
import PropTypes from 'prop-types';

const ContactCard = props => {
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
        <div className="overlay" onClick={props.onClose}>
            <div className="contact-card" onClick={e => e.stopPropagation()}>
                <div className="contact-card__buttons">
                    <div className="contact-card__buttons__close" title="Close Contact Details" onClick={props.onClose}>
                        <i className="fa fa-arrow-left"></i>
                    </div>
                    <div className="contact-card__buttons__edit" title="Edit this contact" onClick={props.onEditContact}>
                        <i className="fa fa-pencil"></i>
                    </div>
                    <div className="contact-card__buttons__remove" title="Delete this contact" onClick={props.onRemoveContact}>
                        <i className="fa fa-user-times"></i>
                    </div>
                </div>
                <div className="contact-card__header">
                    <div className="contact-card__header__avt">
                        <div className="contact-card__header__avt__first-letter" style={{backgroundColor: props.color}}>{props.name[0].toUpperCase()}</div>
                    </div>
                    <div className="contact-card__header__name">
                        <div>
                            <h2>{props.name}</h2>
                            <div className="contact-card__header__tags">
                                {props.labels.map((label) => {
                                    switch (label) {
                                        case 'family':
                                            return (<span className="contact-card__header__tag-family" key={1}>Family</span>);
                                        case 'coWorker':
                                            return (<span className="contact-card__header__tag-co-worker" key={2}>Coworkers</span>);
                                        case 'friends':
                                            return (<span className="contact-card__header__tag-friends" key={3}>Friends</span>);
                                    }
                                })}
                            </div>
                        </div>
                    </div>
                </div>
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
                                <span>{month} {props.birth.split('-')[2]}, {props.birth.split('-')[0]}</span>
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
            </div>
        </div>
    );
};

ContactCard.propTypes = {
    onClose: PropTypes.func.isRequired,
    onEditContact: PropTypes.func.isRequired,
    onRemoveContact: PropTypes.func.isRequired
};

export default ContactCard;
