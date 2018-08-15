// import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getRandomColor } from '../../../helpers/utilsHelper';

import { fixedEncodeURIComponent, fixedEncodeURI } from '../../../helpers/encodeHelper';

import Form from '../Form';

const spacePtrn = /\s/g,
    addFilledClass = e => {
        e.target.parentNode.classList.add('JS-form__input-container--filled');
    },
    checkInputFilled = e => {
        const inputElem = e.target;
        if (inputElem.value === '') {
            inputElem.parentNode.classList.remove('JS-form__input-container--filled');
        }
    };

class FormContainer extends React.Component {
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

        this.handlerSaveForm = this.handlerSaveForm.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.handlerChangeInput = this.handlerChangeInput.bind(this);
        this.resetForm = this.resetForm.bind(this);
    }

    static get propTypes() {
        return {
            title: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            id: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            labels: PropTypes.arrayOf(PropTypes.string).isRequired,
            closeForm: PropTypes.func.isRequired,
            handlerSubmit: PropTypes.func.isRequired,
            showNoti: PropTypes.func.isRequired
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState !== this.state) {
            return true;
        }
        return false;
    }

    componentDidMount() {
        this.checkInputsHaveValueThen(info => {
            document.getElementById(`inputs__${info}`).parentNode.classList.add('JS-form__input-container--filled');
        });
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

    handlerChangeInput(e) {
        let inputText = e.target.value;
        switch (e.target.id) {
            case 'inputs__name':
                if (inputText !== ' ' && inputText.length < 25) {
                    this.setState({ name: inputText });
                }
                break;
            case 'inputs__phone':
                if (inputText[0] !== '0') {
                    this.setState({ phone: inputText });
                }
                break;
            case 'inputs__birth':
                this.setState({ birth: inputText });
                break;
            case 'inputs__email':
                inputText = inputText.replace(spacePtrn, '');
                this.setState({ email: inputText });
                break;
            case 'inputs__website':
                this.setState({ website: inputText });
                break;
            case 'inputs__note':
                this.setState({ note: inputText });
                break;
            default:
            console.log('Uncatched change. Input\'s id:', e.target.id);
                break;
        }
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
                    return fixedEncodeURI(website);
                } else if (hasOnlyProtocol) {
                    return '';
                } else {
                    return "http://" + fixedEncodeURIComponent(website);
                }
            } else {
                return website;
            }
        })(website);

        // format labels data
        let newLabels = [];
        if (this.cboxFamily.checked) { newLabels.push('family'); }
        if (this.cboxCoWorker.checked) { newLabels.push('coWorker'); }
        if (this.cboxFriends.checked) { newLabels.push('friends'); }
        this.state.labels = newLabels;

        this.state.note = note.trim();

        this.props.handlerSubmit(this.state);
    }

    changeColor(e) {
        this.setState({ color: getRandomColor() });
    }

    render () {
        return (
            <Form
                {...this.props}
                {...this.state}
                checkInputFilled={checkInputFilled}
                addFilledClass={addFilledClass}
                handlerSaveForm={this.handlerSaveForm}
                changeColor={this.changeColor}
                handlerChangeInput={this.handlerChangeInput}
                resetForm={this.resetForm}
                refCBoxFamily={thisDOM => this.cboxFamily = thisDOM}
                refCBoxCoWorker={thisDOM => this.cboxCoWorker = thisDOM}
                refCBoxFriend={thisDOM => this.cboxFriends = thisDOM} />
        );
    }
}

export default FormContainer;
