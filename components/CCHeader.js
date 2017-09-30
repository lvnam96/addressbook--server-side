import React from 'react';
import PropTypes from 'prop-types';

const ContactCard__Header = props => (
    <div className="contact-card__header">
        <div className="contact-card__header__avt">
            <div className="contact-card__header__avt__first-letter" style={{backgroundColor: props.color}}>{props.name[0].toUpperCase()}</div>
        </div>
        <div className="contact-card__header__name">
            <div>
                <h2>{props.name}</h2>
                <div className="contact-card__header__tags">
                    {props.labels.map(label => {
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
);

ContactCard__Header.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    labels: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ContactCard__Header;
