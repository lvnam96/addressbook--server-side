import React from 'react';
import PropTypes from 'prop-types';

const ContactItem = function (props) {
    return (
        <li className="contact-list__item" onClick={props.onClickOnItem}>
            <div className="contact-item__avt" onClick={function(e) {e.stopPropagation();}}>
                <input className="contact-item__checkbox" type="checkbox" id={props.contact.id}/>
                <label className="contact-item__checkbox-label" htmlFor={props.contact.id}></label>
                <div className="contact-item__avt__first-letter" style={{backgroundColor: props.contact.color}}>{props.contact.name[0].toUpperCase()}</div>
            </div>
            <div className="contact-item__name">
                <span>{props.contact.name}</span>
            </div>
            <div className="contact-item__birth">
                <span>{props.contact.birth ? props.contact.birth.split('-').reverse().join('/') : ''}</span>
            </div>
            <div className="contact-item__phone">
                <span>{props.contact.phone ? '+84' + props.contact.phone : ''}</span>
            </div>
            <div className="contact-item__buttons">
                <div onClick={props.onClickEdit} title="Edit this contact"><i className="fa fa-pencil"></i></div>
                <div onClick={props.onClickRemove} title="Delete this contact"><i className="fa fa-user-times"></i></div>
            </div>
        </li>
    );
};

ContactItem.propTypes = {
    contact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        birth: PropTypes.string,
        id: PropTypes.string.isRequired,
        phone: PropTypes.string
    }).isRequired,
    onClickOnItem: PropTypes.func.isRequired,
    onClickEdit: PropTypes.func.isRequired,
    onClickRemove: PropTypes.func.isRequired,
};

export default ContactItem;