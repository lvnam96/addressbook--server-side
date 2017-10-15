import React from 'react';
import PropTypes from 'prop-types';

const ContactItem = props => {
    const handlerEditContactOnItem = e => {
            e.stopPropagation();
            props.openForm(props.id);
        },
        handlerRmContactOnItem = e => {
            e.stopPropagation();
            if (confirm('Delete this contact? Are you sure?')) {
                props.rmItem(props.id);
            }
    };
    return (
        <li className={"contact-list__item" + (props.hpbd ? ' contact-list__item--hpbd' : '')}
            onClick={() => props.onClickOnItem(props.id)}
            style={props.hpbd ? {color: props.color} : undefined}>
            <div className="contact-item__avt" onClick={e => e.stopPropagation()}>
                <input className="contact-item__checkbox" type="checkbox" id={props.id}/>
                <label className="contact-item__checkbox-label"
                    htmlFor={props.id}
                    onClick={e => props.onClickCheckbox(props.id)}></label>
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
                <div onClick={handlerEditContactOnItem} title="Edit this contact"><i className="fa fa-pencil"></i></div>
                <div onClick={handlerRmContactOnItem} title="Delete this contact"><i className="fa fa-user-times"></i></div>
            </div>
        </li>
    );
};

ContactItem.propTypes = {
    name: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    onClickOnItem: PropTypes.func.isRequired,
    onClickRemove: PropTypes.func.isRequired,
    onClickCheckbox: PropTypes.func.isRequired,
    rmItem: PropTypes.func.isRequired
};

export default ContactItem;
