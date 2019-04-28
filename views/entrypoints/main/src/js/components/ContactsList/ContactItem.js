import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { displayBirthday } from '../../helpers/timeHelper';

const ContactItem = props => (
    <div
        className={classNames('contact-item', {
            'contact-item--hpbd': !!props.contact.hpbd
        })}
        onClick={props.handlerClickOnItem}
        style={props.contact.hpbd ? {color: props.contact.color} : undefined}
    >
        <div
            className="contact-item__avt"
            onClick={e => e.stopPropagation()}
        >
            <input
                className="contact-item__checkbox"
                type="checkbox" id={props.contact.id}
                checked={props.contact.isMarked}
                onChange={props.handlerClickCheckbox}
            />
            <label className="contact-item__checkbox-label" htmlFor={props.contact.id}></label>
            <div
                className="contact-item__avt__first-letter"
                style={{backgroundColor: props.contact.color}}>
                {props.contact.name[0].toUpperCase()}
            </div>
        </div>
        <div className="contact-item__name">
            <span>{props.contact.name}</span>
        </div>
        <div className="contact-item__birth">
            <span>{props.contact.birth && displayBirthday(props.contact.birth)}</span>
        </div>
        <div className="contact-item__phone">
            <span>{props.contact.phone && '+84' + props.contact.phone}</span>
        </div>
        <div className="contact-item__btns-container">
            <div
                className="contact-item__btn"
                onClick={props.handlerClickEditBtn}
                title="Edit this contact"
            >
                <i className="fas fa-pen"></i>
            </div>
            <div
                className="contact-item__btn"
                onClick={props.handlerClickRemoveBtn}
                title="Delete this contact"
            >
                <i className="fas fa-user-times"></i>
            </div>
        </div>
    </div>
);

ContactItem.propTypes = {
    contact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        birth: PropTypes.instanceOf(Date),
        isMarked: PropTypes.bool,
        hpbd: PropTypes.bool,
        phone: PropTypes.string
    }).isRequired,
    handlerClickEditBtn: PropTypes.func.isRequired,
    handlerClickRemoveBtn: PropTypes.func.isRequired,
    handlerClickOnItem: PropTypes.func.isRequired,
    handlerClickCheckbox: PropTypes.func.isRequired
};

export default ContactItem;
