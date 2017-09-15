import React from 'react';
import PropTypes from 'prop-types';

// import img from '../img/party-pattern.jpg';

const ContactItem = function (props) {
    return (
        <li className={"contact-list__item" + (props.hpbd ? ' contact-list__item--hpbd' : '')}
            onClick={props.onClickOnItem}
            style={props.hpbd ? {color: props.color} : undefined}>
            <div className="contact-item__avt" onClick={function(e) {e.stopPropagation();}}>
                <input className="contact-item__checkbox" type="checkbox" id={props.id}/>
                <label className="contact-item__checkbox-label" htmlFor={props.id}></label>
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
            <div className="contact-item__buttons">
                <div onClick={props.onClickEdit} title="Edit this contact"><i className="fa fa-pencil"></i></div>
                <div onClick={props.onClickRemove} title="Delete this contact"><i className="fa fa-user-times"></i></div>
            </div>
        </li>
    );
};

ContactItem.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClickOnItem: PropTypes.func.isRequired,
    onClickEdit: PropTypes.func.isRequired,
    onClickRemove: PropTypes.func.isRequired,
};

export default ContactItem;