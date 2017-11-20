import React from 'react';
import PropTypes from 'prop-types';

const ContactItem = props => (
    <div className={"contact-item" + (props.hpbd ? ' contact-item--hpbd' : '')}
        onClick={props.handlerClickOnItem}
        style={props.hpbd ? {color: props.color} : undefined}>
        <div className="contact-item__avt" onClick={e => e.stopPropagation()}>
            <input className="contact-item__checkbox" type="checkbox" id={props.id}/>
            <label className="contact-item__checkbox-label"
                htmlFor={props.id}
                onClick={props.handlerClickCheckbox}></label>
            <div className="contact-item__avt__first-letter" style={{backgroundColor: props.color}}>{props.name[0].toUpperCase()}</div>
        </div>
        <div className="contact-item__name">
            <span>{props.name}</span>
        </div>
        <div className="contact-item__birth">
            <span>{props.birth && props.birth.split('-').reverse().join('/')}</span>
        </div>
        <div className="contact-item__phone">
            <span>{props.phone && '+84' + props.phone}</span>
        </div>
        <div className="contact-item__btns-container">
            <div className="contact-item__btn" onClick={props.handlerClickEditBtn} title="Edit this contact"><i className="fa fa-pencil"></i></div>
            <div className="contact-item__btn" onClick={props.handlerClickRemoveBtn} title="Delete this contact"><i className="fa fa-user-times"></i></div>
        </div>
    </div>
);

ContactItem.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    birth: PropTypes.string,
    phone: PropTypes.string,
    handlerClickEditBtn: PropTypes.func.isRequired,
    handlerClickRemoveBtn: PropTypes.func.isRequired,
    handlerClickOnItem: PropTypes.func.isRequired,
    handlerClickCheckbox: PropTypes.func.isRequired
};

export default ContactItem;
