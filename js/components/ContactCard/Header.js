import React from 'react';
import PropTypes from 'prop-types';

import Tag from './Tag';

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
                            return (<Tag key="1" type='family' text='Family'/>);
                        case 'coWorker':
                            return (<Tag key="2" type='co-worker' text='Coworkers' />);
                        case 'friends':
                            return (<Tag key="3" type='friends' text='Friends' />);
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
