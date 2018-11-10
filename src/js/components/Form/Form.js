import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../HOCs/Popup';
import Header from './Header';
import Avt from './Avt';

const firstNotSpecialCharPtrn = /[^\u0000-\u007F]|[0-9a-zA-Z]/g;

const Form = props => {
    const firstLetterIdx = props.contact.name.search(firstNotSpecialCharPtrn),
        firstLetter = props.contact.name.trim() !== '' && firstLetterIdx !== -1 ? props.contact.name[firstLetterIdx].toUpperCase() : '?';

    return (
        <Popup onCloseHandler={props.closeForm}>
            <div className="form-container">
                <form onSubmit={props.handlerSaveForm}>
                    <Header title={props.title} handlerCloseBtn={props.closeForm} />
                    <div className="form-body">
                        <Avt color={props.contact.color}
                            changeColor={props.changeColor}
                            firstLetter={firstLetter} />
                        <div className="form__inputs-container">
                            <div className="form__input-container form__input-container--name">
                                <input type="text" id="inputs__name" required autoFocus
                                    value={props.contact.name}
                                    onChange={props.handlerChangeInput}
                                    onFocus={props.addFilledClass}
                                    onBlur={props.checkInputFilled}
                                className="form__input-field"/>
                                <label className="form__input-label" htmlFor="inputs__name"><span className="form__input-label__text">Name</span></label>
                            </div>
                            <div className="form__cb-container">
                                <div className="form__input-container--labels">
                                    <input type="checkbox" id="form_cb-family"
                                        ref={props.refCBoxFamily}
                                        defaultChecked={(props.contact.labels.indexOf("family") > -1) ? true : false}/>
                                    <label className="form__cb-box" htmlFor="form_cb-family"></label>
                                    <label className="form__cb-label" htmlFor="form_cb-family">Family</label>
                                </div>
                                <div className="form__input-container--labels">
                                    <input type="checkbox" id="form_cb-coWorker"
                                        ref={props.refCBoxCoWorker}
                                        defaultChecked={(props.contact.labels.indexOf("coWorker") > -1) ? true : false}/>
                                    <label className="form__cb-box" htmlFor="form_cb-coWorker"></label>
                                    <label className="form__cb-label" htmlFor="form_cb-coWorker">Co-worker</label>
                                </div>
                                <div className="form__input-container--labels">
                                    <input type="checkbox" id="form_cb-friends"
                                        ref={props.refCBoxFriend}
                                        defaultChecked={(props.contact.labels.indexOf("friends") > -1) ? true : false}/>
                                    <label className="form__cb-box" htmlFor="form_cb-friends"></label>
                                    <label className="form__cb-label" htmlFor="form_cb-friends">Friends</label>
                                </div>
                            </div>
                            <div className="form__input-container form__input-container--phone">
                                <input type="number" id="inputs__phone"
                                    value={props.contact.phone}
                                    onChange={props.handlerChangeInput}
                                    onFocus={props.addFilledClass}
                                    onBlur={props.checkInputFilled}
                                    className="form__input-field"
                                />
                                <label className="form__input-label" htmlFor="inputs__phone"><span className="form__input-label__text">Phone</span></label>
                            </div>
                            <div className="form__input-container form__input-container--birth">
                                <input type="date" id="inputs__birth"
                                    value={props.contact.birth}
                                    onChange={props.handlerChangeInput}
                                    onFocus={props.addFilledClass}
                                    onBlur={props.checkInputFilled}
                                    className="form__input-field"
                                />
                                <label className="form__input-label" htmlFor="inputs__birth"><span className="form__input-label__text">Birth</span></label>
                            </div>
                            <div className="form__input-container form__input-container--email">
                                <input type="email" id="inputs__email"
                                    value={props.contact.email}
                                    onChange={props.handlerChangeInput}
                                    onFocus={props.addFilledClass}
                                    onBlur={props.checkInputFilled}
                                    className="form__input-field"
                                    placeholder="hello@garyle.me"
                                />
                                <label className="form__input-label" htmlFor="inputs__email"><span className="form__input-label__text">Email</span></label>
                            </div>
                            <div className="form__input-container form__input-container--website">
                                <input type="url" id="inputs__website"
                                    value={props.contact.website}
                                    onChange={props.handlerChangeInput}
                                    onFocus={props.addFilledClass}
                                    onBlur={props.checkInputFilled}
                                    className="form__input-field"
                                    pattern="^https?:\/\/\S*"
                                    placeholder="https://facebook.com/lvnam96"
                                title="Website's link should start by 'http://'' or 'https://'"/>
                                <label className="form__input-label" htmlFor="inputs__website"><span className="form__input-label__text">Website</span></label>
                            </div>
                            <div className="form__input-container form__input-container--note">
                                <input type="text" id="inputs__note"
                                    value={props.contact.note}
                                    onChange={props.handlerChangeInput}
                                    onFocus={props.addFilledClass}
                                    onBlur={props.checkInputFilled}
                                className="form__input-field"/>
                                <label className="form__input-label" htmlFor="inputs__note"><span className="form__input-label__text">Note</span></label>
                            </div>
                        </div>
                    </div>
                    <div className="form-footer">
                        <input type="reset" value="Reset"
                            className="form__btn form__btn--reset"
                            onClick={props.resetForm}/>
                        <input type="button" value="Cancel"
                            className="form__btn"
                            onClick={props.closeForm}/>
                        <input type="button"
                            value={props.title === "Edit Contact" ? "Save" : "Add"}
                            className="form__btn"
                            onClick={props.handlerSaveForm}/>
                    </div>
                </form>
            </div>
        </Popup>
    );
}

Form.propTypes = {
    contact: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        labels: PropTypes.arrayOf(PropTypes.string).isRequired,
        birth: PropTypes.string,
        note: PropTypes.string,
        email: PropTypes.string,
        website: PropTypes.string,
        phone: PropTypes.string
    }).isRequired,
    title: PropTypes.string.isRequired,
    closeForm: PropTypes.func.isRequired,
    handlerSaveForm: PropTypes.func.isRequired,
    changeColor: PropTypes.func.isRequired,
    handlerChangeInput: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired
};

export default Form;
