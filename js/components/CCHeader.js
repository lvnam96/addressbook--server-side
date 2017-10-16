import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__Header = props => (
    <div className="contact-card__header">
        <div className="contact-card__avt">
            <div className="contact-card__avt__first-letter" style={{backgroundColor: props.color}}>{props.name[0].toUpperCase()}</div>
        </div>
        <div className="contact-card__name-container">
            <h2 className="contact-card__name">{props.name}</h2>
            <div className="contact-card__tags-container">
                {props.labels.map(label => {
                    switch (label) {
                    case 'family':
                        return (<span className="contact-card__tag contact-card__tag--family" key={1}>Family</span>);
                    case 'coWorker':
                        return (<span className="contact-card__tag contact-card__tag--co-worker" key={2}>Coworkers</span>);
                    case 'friends':
                        return (<span className="contact-card__tag contact-card__tag--friends" key={3}>Friends</span>);
                    }
                })}
            </div>
        </div>
    </div>
);

ContactCard__Header.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ContactCard__Header;
