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
        this.handlerSaveForm = this.handlerSaveForm.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.handlerChangeName = this.handlerChangeName.bind(this);
        this.handlerChangePhone = this.handlerChangePhone.bind(this);
        this.handlerChangeBirth = this.handlerChangeBirth.bind(this);
        this.handlerChangeWebsite = this.handlerChangeWebsite.bind(this);
        this.handlerChangeEmail = this.handlerChangeEmail.bind(this);
        this.handlerChangeNote = this.handlerChangeNote.bind(this);
        this.preventCloseForm = this.preventCloseForm.bind(this);
        this.resetForm = this.resetForm.bind(this);
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
        e.target.parentNode.classList.add('form-body__input--filled');
    }
    checkInputFilled(e) {
        const inputElem = e.target;
        if (inputElem.value === '') {
            inputElem.parentNode.classList.remove('form-body__input--filled');
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
        this.checkInputsHaveValueThen((info) => {
            document.getElementById(`inputs__${info}`).parentNode.classList.add('form-body__input--filled');
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
    handlerChangeEmail(e) {
        const email = e.target.value.replace(this.spacePtrn, '');
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
        this.checkInputsHaveValueThen((info) => {
            document.getElementById(`inputs__${info}`).parentNode.classList.remove('form-body__input--filled');
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
        this.setState({
            color: this.props.getRandomColor()
        });
    }
    preventCloseForm(e) {
        e.stopPropagation();
    }
    render() {
        const firstLetterIdx = this.state.name.search(this.firstNotSpecialCharPtrn),
            firstLetter = this.state.name.trim() !== '' && firstLetterIdx !== -1 ? this.state.name[firstLetterIdx].toUpperCase() : '?';
        return (
            <div className='overlay' onClick={this.props.onClose}>
                <div className='form-container' onClick={this.preventCloseForm}>
                    <form onSubmit={this.handlerSaveForm}>
                        <div className='form-header'>
                            <div className='form-header__title'>
                                <h2>{this.props.title}</h2>
                            </div>
                            <div className='form-header__close-btn' onClick={this.props.onClose}>
                                <div><i className='fa fa-times'></i></div>
                            </div>
                        </div>
                        <div className='form-body'>
                            <div className='form-body__avt'>
                                <div className="form-body__avt__first-letter"
                                    style={{backgroundColor: this.state.color}}
                                    title='We have not support avatar yet! So... choose a random color for this contact!'
                                    ref={thisDiv => { this.avtDOM = thisDiv; }}
                                    onClick={this.changeColor}>
                                    {firstLetter}
                                </div>
                            </div>
                            <div className='form-body__inputs'>
                                <div className='form-body__input form-body__inputs__name'>
                                    <input type='text' id='inputs__name' required autoFocus
                                        value={this.state.name}
                                        onChange={this.handlerChangeName}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label htmlFor='inputs__name'><span>Name</span></label>
                                </div>
                                <div className='form-body__inputs__labels'>
                                    <div className='form-body__inputs__labels__family'>
                                        <input type='checkbox' id='checkbox__family'
                                            ref={thisDOM => this.cboxFamily = thisDOM}
                                            defaultChecked={(this.state.labels.indexOf('family') > -1) ? true : false} />
                                        <label className='checkbox__label' htmlFor='checkbox__family'></label>
                                        <label htmlFor='checkbox__family'>Family</label>
                                    </div>
                                    <div className='form-body__inputs__labels__coWorker'>
                                        <input type='checkbox' id='checkbox__coWorker'
                                            ref={thisDOM => this.cboxCoWorker = thisDOM}
                                            defaultChecked={(this.state.labels.indexOf('coWorker') > -1) ? true : false} />
                                        <label className='checkbox__label' htmlFor='checkbox__coWorker'></label>
                                        <label htmlFor='checkbox__coWorker'>Co-worker</label>
                                    </div>
                                    <div className='form-body__inputs__labels__friends'>
                                        <input type='checkbox' id='checkbox__friends'
                                            ref={thisDOM => this.cboxFriends = thisDOM}
                                            defaultChecked={(this.state.labels.indexOf('friends') > -1) ? true : false} />
                                        <label className='checkbox__label' htmlFor='checkbox__friends'></label>
                                        <label htmlFor='checkbox__friends'>Friends</label>
                                    </div>
                                </div>
                                <div className='form-body__input form-body__inputs__phone'>
                                    <input type='number' id='inputs__phone'
                                        value={this.state.phone}
                                        onChange={this.handlerChangePhone}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label htmlFor='inputs__phone'><span>Phone</span></label>
                                </div>
                                <div className='form-body__input form-body__inputs__birth'>
                                    <input type='date' id='inputs__birth'
                                        value={this.state.birth}
                                        onChange={this.handlerChangeBirth}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label htmlFor='inputs__birth'><span>Birth</span></label>
                                </div>
                                <div className='form-body__input form-body__inputs__email'>
                                    <input type='email' id='inputs__email'
                                        value={this.state.email}
                                        onChange={this.handlerChangeEmail}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"
                                        placeholder="hello@garyle.me"/>
                                    <label htmlFor='inputs__email'><span>Email</span></label>
                                </div>
                                <div className='form-body__input form-body__inputs__website'>
                                    <input type='url' id='inputs__website'
                                        value={this.state.website}
                                        onChange={this.handlerChangeWebsite}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"
                                        pattern="^https?:\/\/\S*"
                                        placeholder="https://facebook.com/lvnam96"
                                        title="Website's link should start by 'http://' or 'https://'"/>
                                    <label htmlFor='inputs__website'><span>Website</span></label>
                                </div>
                                <div className='form-body__input form-body__inputs__note'>
                                    <input type="text" id='inputs__note'
                                        value={this.state.note}
                                        onChange={this.handlerChangeNote}
                                        onFocus={this.addFilledClass}
                                        onBlur={this.checkInputFilled}
                                        className="form__input-field"/>
                                    <label htmlFor='inputs__note'><span>Note</span></label>
                                </div>
                            </div>
                        </div>
                        <div className='form-footer'>
                            <input type='reset' value='Reset'
                                className='form-footer__reset-btn'
                                onClick={this.resetForm}/>
                            <input type='button' value='Cancel'
                                className='form-footer__cancel-btn'
                                onClick={this.props.onClose}/>
                            <input type='submit'
                                value={this.props.title === 'Edit Contact' ? 'Save' : 'Add'}
                                className='form-footer__save-btn'
                                onClick={this.handlerSaveForm}/>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Form;
