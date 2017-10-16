import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Form extends Component {
    constructor(props) {
        super(props);
        const {
            name,
            id,
            color,
            labels,
            birth = '',
            note = '',
            email = '',
            website = '',
            phone = ''
        } = this.props;
        this.state = {
            name,
            id,
            color,
            labels,
            birth,
            note,
            email,
            website,
            phone
        };

        this.cboxFamily;
        this.cboxFriends;
        this.cboxCoWorker;
        this.firstNotSpecialCharPtrn = /[^\u0000-\u007F]|[0-9a-zA-Z]/g;
        this.spacePtrn = /\s/g;

        this.handlerSaveForm        = this.handlerSaveForm.bind(this);
        this.changeColor            = this.changeColor.bind(this);
        this.handlerChangeName      = this.handlerChangeName.bind(this);
        this.handlerChangePhone     = this.handlerChangePhone.bind(this);
        this.handlerChangeBirth     = this.handlerChangeBirth.bind(this);
        this.handlerChangeWebsite   = this.handlerChangeWebsite.bind(this);
        this.handlerChangeEmail     = this.handlerChangeEmail.bind(this);
        this.handlerChangeNote      = this.handlerChangeNote.bind(this);
        this.resetForm              = this.resetForm.bind(this);
    }

    static get propTypes() {
        return {
            title: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            labels: PropTypes.arrayOf(PropTypes.string).isRequired,
            onClose: PropTypes.func.isRequired,
            handlerSubmit: PropTypes.func.isRequired,
            showNoti: PropTypes.func.isRequired,
            getRandomColor: PropTypes.func.isRequired
        };
    }

    addFilledClass(e) {
        e.target.parentNode.classList.add('JS-form__input-container--filled');
    }

    checkInputFilled(e) {
        const inputElem = e.target;
        if (inputElem.value === '') {
            inputElem.parentNode.classList.remove('JS-form__input-container--filled');
        }
    }

    checkInputsHaveValueThen(callback) {
        const infoKeys = Object.keys(this.state);
        for (let info of infoKeys) {
            switch (info) {
            case 'labels':
            case 'id':
            case 'color':
                continue;
            break;
            }

            if (this.state[info]) {
                callback(info);
            }
        }
    }

    componentDidMount() {
        this.checkInputsHaveValueThen(info => {
            document.getElementById(`inputs__${info}`).parentNode.classList.add('JS-form__input-container--filled');
        });
    }

    handlerChangeName({ target: { value: name } }) {
        if (name !== ' ' && name.length < 25) {
            this.setState({ name });
        }
    }

    handlerChangePhone({ target: { value: phone } }) {
        if (phone[0] !== '0') {
            this.setState({ phone });
        }
    }

    handlerChangeBirth({ target: { value: birth } }) {
        this.setState({ birth });
    }

    handlerChangeWebsite({ target: { value: website } }) {
        this.setState({ website });
    }

    handlerChangeEmail({ target: { value: email } }) {
        email = email.replace(this.spacePtrn, '');
        this.setState({ email });
    }

    handlerChangeNote({ target: { value: note } }) {
        this.setState({ note });
    }

    static fixedEncodeURIComponent(str) {
        return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
    }

    static fixedEncodeURI(str) {
        return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
    }

    resetForm() {
        this.setState({
            name: '',
            labels: [],
            birth: '',
            note: '',
            email: '',
            website: '',
            phone: ''
        });

        this.checkInputsHaveValueThen(info => {
            document.getElementById(`inputs__${info}`).parentNode.classList.remove('JS-form__input-container--filled');
        });
    }

    handlerSaveForm(e) {
        e.preventDefault();

        let {
            name,
            id,
            color,
            labels,
            birth,
            note,
            email,
            website,
            phone
        } = this.state;

        name = name.trim();
        if (name === '') {
            this.props.showNoti('error', 'Please type a name');
            return;
        } else {
            this.state.name = name;
        }

        this.state.website = (website => {
            website = website.trim();
            if (website.length) {
                const hasURLSyntax = website.search(/^https?:\/\/\S+/g) === 0 ? true : false,
                    hasOnlyProtocol = website.search(/^https?:\/\/$|^h?ttps?:\/\/$|^ht?tps?:\/\/$|^http?s?:\/\/$/g) === 0 ? true : false;
                if (hasURLSyntax) {
                    return Form.fixedEncodeURI(website);
                } else if (hasOnlyProtocol) {
                    return '';
                } else {
                    return "http://" + Form.fixedEncodeURIComponent(website);
                }
            } else {
                return website;
            }
        })(website);

        // format labels data
        let newLabels = [];
        if (this.cboxFamily.checked) { newLabels.push('family') }
        if (this.cboxCoWorker.checked) { newLabels.push('coWorker') }
        if (this.cboxFriends.checked) { newLabels.push('friends') }
        this.state.labels = newLabels;

        this.state.note = this.state.note.trim();

        this.props.handlerSubmit(this.state);
    }

    changeColor(e) {
        this.setState({ color: this.props.getRandomColor() });
    }

    render() {
        const firstLetterIdx = this.state.name.search(this.firstNotSpecialCharPtrn),
            firstLetter = this.state.name.trim() !== '' && firstLetterIdx !== -1 ? this.state.name[firstLetterIdx].toUpperCase() : '?';

        return (
            <div className="overlay" onClick={this.props.onClose}>
                <div className="form-container" onClick={e => e.stopPropagation()}>
                    <form onSubmit={this.handlerSaveForm}>
                        <div className="form-header">
                            <div className="form-title">
                                <h2 className="form-title__text">{this.props.title}</h2>
                            </div>
                            <div className="form__close-btn" onClick={this.props.onClose}>
                                <div><i className="fa fa-times"></i></div>
                            </div>
                        </div>
                        <div className="form-body">
                            <div className="form-avt">
                                <div className="form-avt__first-letter"
                                    style={{backgroundColor: this.state.color}}
                                    title="We have not support avatar yet! So... choose a random color for this contact!"
                                    ref={thisDiv => { this.avtDOM = thisDiv; }}
                                    onClick={this.changeColor}>
                                    {firstLetter}
                                </div>
                            </div>
                            <div className="form__inputs-container">
                                <div className="form__input-container form__input-container--name">
                                    <input type="text" id="inputs__name" required autoFocus
                                        value={this.state.name}
                                        onChange={this.handlerChangeName}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label className="form__input-label" htmlFor="inputs__name"><span className="form__input-label__text">Name</span></label>
                                </div>
                                <div className="form__cb-container">
                                    <div className="form__input-container--labels">
                                        <input type="checkbox" id="form_cb-family"
                                            ref={thisDOM => this.cboxFamily = thisDOM}
                                            defaultChecked={(this.state.labels.indexOf("family") > -1) ? true : false} />
                                        <label className="form__cb-box" htmlFor="form_cb-family"></label>
                                        <label className="form__cb-label" htmlFor="form_cb-family">Family</label>
                                    </div>
                                    <div className="form__input-container--labels">
                                        <input type="checkbox" id="form_cb-coWorker"
                                            ref={thisDOM => this.cboxCoWorker = thisDOM}
                                            defaultChecked={(this.state.labels.indexOf("coWorker") > -1) ? true : false} />
                                        <label className="form__cb-box" htmlFor="form_cb-coWorker"></label>
                                        <label className="form__cb-label" htmlFor="form_cb-coWorker">Co-worker</label>
                                    </div>
                                    <div className="form__input-container--labels">
                                        <input type="checkbox" id="form_cb-friends"
                                            ref={thisDOM => this.cboxFriends = thisDOM}
                                            defaultChecked={(this.state.labels.indexOf("friends") > -1) ? true : false} />
                                        <label className="form__cb-box" htmlFor="form_cb-friends"></label>
                                        <label className="form__cb-label" htmlFor="form_cb-friends">Friends</label>
                                    </div>
                                </div>
                                <div className="form__input-container form__input-container--phone">
                                    <input type="number" id="inputs__phone"
                                        value={this.state.phone}
                                        onChange={this.handlerChangePhone}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label className="form__input-label" htmlFor="inputs__phone"><span className="form__input-label__text">Phone</span></label>
                                </div>
                                <div className="form__input-container form__input-container--birth">
                                    <input type="date" id="inputs__birth"
                                        value={this.state.birth}
                                        onChange={this.handlerChangeBirth}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label className="form__input-label" htmlFor="inputs__birth"><span className="form__input-label__text">Birth</span></label>
                                </div>
                                <div className="form__input-container form__input-container--email">
                                    <input type="email" id="inputs__email"
                                        value={this.state.email}
                                        onChange={this.handlerChangeEmail}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"
                                        placeholder="hello@garyle.me"/>
                                    <label className="form__input-label" htmlFor="inputs__email"><span className="form__input-label__text">Email</span></label>
                                </div>
                                <div className="form__input-container form__input-container--website">
                                    <input type="url" id="inputs__website"
                                        value={this.state.website}
                                        onChange={this.handlerChangeWebsite}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"
                                        pattern="^https?:\/\/\S*"
                                        placeholder="https://facebook.com/lvnam96"
                                        title="Website's link should start by 'http://'' or 'https://'"/>
                                    <label className="form__input-label" htmlFor="inputs__website"><span className="form__input-label__text">Website</span></label>
                                </div>
                                <div className="form__input-container form__input-container--note">
                                    <input type="text" id="inputs__note"
                                        value={this.state.note}
                                        onChange={this.handlerChangeNote}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label className="form__input-label" htmlFor="inputs__note"><span className="form__input-label__text">Note</span></label>
                                </div>
                            </div>
                        </div>
                        <div className="form-footer">
                            <input type="reset" value="Reset"
                                className="form__btn form__btn--reset"
                                onClick={this.resetForm}/>
                            <input type="button" value="Cancel"
                                className="form__btn"
                                onClick={this.props.onClose}/>
                            <input type="button"
                                value={this.props.title === "Edit Contact" ? "Save" : "Add"}
                                className="form__btn"
                                onClick={this.handlerSaveForm}/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Form;
