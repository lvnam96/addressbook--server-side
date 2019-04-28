import React from 'react';
import PropTypes from 'prop-types';

import Popup from '../HOCs/Popup';
import Header from './Header';
import Avt from './Avt';
import TextField from './fields/TextField';
import CheckboxField from './fields/CheckboxField';
import { getFirstLetterOf } from '../../helpers/findHelper';

const Form = props => {
    const firstLetter = getFirstLetterOf(props.contact.name);

    return (
        <Popup onCloseHandler={props.closeForm}>
            <div className="form-container">
                <form onSubmit={props.handlerSaveForm}>
                    <Header title={props.title} handlerCloseBtn={props.closeForm} />
                    <div className="form-body">
                        <Avt
                            color={props.contact.color}
                            changeColor={props.changeColor}
                            firstLetter={firstLetter}
                        />
                        <div className="form__inputs-container">
                            <div className="form__input-container form__input-container--name">
                                <TextField
                                    type="text"
                                    id="inputs__name"
                                    required
                                    autoFocus
                                    value={props.contact.name}
                                    handlerChangeInput={props.handlerChangeInput}
                                    addFilledClass={props.addFilledClass}
                                    checkInputFilled={props.checkInputFilled}
                                    className="form__input-field"
                                >
                                    <label className="form__input-label" htmlFor="inputs__name"><span className="form__input-label__text">Name</span></label>
                                </TextField>
                            </div>
                            <div className="form__cb-container">
                                <div className="form__input-container--labels">
                                    <CheckboxField
                                        labels={props.contact.labels}
                                        id="form_cb-family"
                                        ref={props.refCBoxFamily}
                                        value="family"
                                        label="Family"
                                    />
                                </div>
                                <div className="form__input-container--labels">
                                    <CheckboxField
                                        labels={props.contact.labels}
                                        id="form_cb-coWorker"
                                        ref={props.refCBoxCoWorker}
                                        value="coWorker"
                                        label="Co-worker"
                                    />
                                </div>
                                <div className="form__input-container--labels">
                                    <CheckboxField
                                        labels={props.contact.labels}
                                        id="form_cb-friends"
                                        ref={props.refCBoxFriend}
                                        value="friends"
                                        label="Friends"
                                    />
                                </div>
                            </div>
                            <div className="form__input-container form__input-container--phone">
                                <TextField
                                    type="number"
                                    id="inputs__phone"
                                    value={props.contact.phone}
                                    handlerChangeInput={props.handlerChangeInput}
                                    addFilledClass={props.addFilledClass}
                                    checkInputFilled={props.checkInputFilled}
                                    className="form__input-field"
                                >
                                    <label className="form__input-label" htmlFor="inputs__phone"><span className="form__input-label__text">Phone</span></label>
                                </TextField>
                            </div>
                            <div className="form__input-container form__input-container--birth">
                                <TextField
                                    type="date"
                                    id="inputs__birth"
                                    value={props.contact.birth}
                                    handlerChangeInput={props.handlerChangeInput}
                                    addFilledClass={props.addFilledClass}
                                    checkInputFilled={props.checkInputFilled}
                                    className="form__input-field"
                                >
                                    <label className="form__input-label" htmlFor="inputs__birth"><span className="form__input-label__text">Birth</span></label>
                                </TextField>
                            </div>
                            <div className="form__input-container form__input-container--email">
                                <TextField
                                    type="email"
                                    id="inputs__email"
                                    value={props.contact.email}
                                    handlerChangeInput={props.handlerChangeInput}
                                    addFilledClass={props.addFilledClass}
                                    checkInputFilled={props.checkInputFilled}
                                    className="form__input-field"
                                    placeholder="hello@garyle.me"
                                >
                                    <label className="form__input-label" htmlFor="inputs__email"><span className="form__input-label__text">Email</span></label>
                                </TextField>
                            </div>
                            <div className="form__input-container form__input-container--website">
                                <TextField
                                    type="url"
                                    id="inputs__website"
                                    value={props.contact.website}
                                    handlerChangeInput={props.handlerChangeInput}
                                    addFilledClass={props.addFilledClass}
                                    checkInputFilled={props.checkInputFilled}
                                    className="form__input-field"
                                    pattern="^https?:\/\/\S*"
                                    placeholder="https://facebook.com/lvnam96"
                                    title="Website's link should start by 'http://'' or 'https://'"
                                >
                                    <label className="form__input-label" htmlFor="inputs__website"><span className="form__input-label__text">Website</span></label>
                                </TextField>
                            </div>
                            <div className="form__input-container form__input-container--note">
                                <TextField
                                    type="text"
                                    id="inputs__note"
                                    value={props.contact.note}
                                    handlerChangeInput={props.handlerChangeInput}
                                    addFilledClass={props.addFilledClass}
                                    checkInputFilled={props.checkInputFilled}
                                    className="form__input-field"
                                >
                                    <label className="form__input-label" htmlFor="inputs__note"><span className="form__input-label__text">Note</span></label>
                                    </TextField>
                            </div>
                        </div>
                    </div>
                    <div className="form-footer">
                        <input
                            type="reset"
                            value="Reset"
                            className="form__btn form__btn--reset"
                            onClick={props.resetForm}
                        />
                        <input
                            type="button"
                            value="Cancel"
                            className="form__btn"
                            onClick={props.closeForm}
                        />
                        <input
                            type="button"
                            value={props.title === "Edit Contact" ? "Save" : "Add"}
                            className="form__btn"
                            onClick={props.handlerSaveForm}
                        />
                    </div>
                </form>
            </div>
        </Popup>
    );
};

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
    resetForm: PropTypes.func.isRequired,
    addFilledClass: PropTypes.func.isRequired,
    checkInputFilled: PropTypes.func.isRequired,
};

export default Form;
