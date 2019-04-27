import React from 'react';
import PropTypes from 'prop-types';

import { getRandomColor } from '../../../helpers/utilsHelper';
import { convertDateObjToHTMLInputVal } from '../../../helpers/timeHelper';

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
    },
    emptyContact = {// default empty contact's values
        name: '',
        labels: [],
        birth: '',
        note: '',
        email: '',
        website: '',
        phone: ''
    };

class FormContainer extends React.Component {
    constructor(props) {
        super(props);
        const contact = this.props.contact;
        this.state = {
            contact: {
                name: contact.name || emptyContact.name,
                id: contact.id || emptyContact.id,
                color: contact.color || emptyContact.color,
                labels: (contact.labels && Array.from(contact.labels)) || emptyContact.labels,
                birth: (contact.birth && convertDateObjToHTMLInputVal(contact.birth)) || emptyContact.birth,
                note: contact.note || emptyContact.note,
                email: contact.email || emptyContact.email,
                website: contact.website || emptyContact.website,
                phone: contact.phone || emptyContact.phone
            }
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
            contact: PropTypes.instanceOf(adbk.classes.Contact).isRequired,
            closeForm: PropTypes.func.isRequired,
            handlerSubmit: PropTypes.func.isRequired,
            showNoti: PropTypes.func.isRequired
        };
    }

    // shouldComponentUpdate(nextProps, nextState) {}

    componentDidMount() {
        this.checkInputsHaveValueThen(info => {
            document.getElementById(`inputs__${info}`).parentNode.classList.add('JS-form__input-container--filled');
        });
    }

    checkInputsHaveValueThen(callback) {
        const infoKeys = Object.keys(this.state.contact);
        for (let info of infoKeys) {
            switch (info) {
                case 'labels':
                case 'id':
                case 'color':
                    continue;
            }

            if (this.state.contact[info]) {
                callback(info);
            }
        }
    }

    handlerChangeInput(e) {
        let inputText = e.target.value;
        switch (e.target.id) {
            case 'inputs__name':
                if (inputText !== ' ' && inputText.length < 25) {
                    this.setState((prevState) => {
                        return {
                            contact: {
                                ...prevState.contact,
                                name: inputText
                            }
                        };
                    });
                }
                break;
            case 'inputs__phone':
                if (inputText[0] !== '0') {
                    this.setState((prevState) => {
                        return {
                            contact: {
                                ...prevState.contact,
                                phone: inputText
                            }
                        };
                    });
                }
                break;
            case 'inputs__birth':
                // console.log(inputText);// YYYY-MM-DD
                this.setState((prevState) => {
                    return {
                        contact: {
                            ...prevState.contact,
                            birth: inputText
                        }
                    };
                });
                break;
            case 'inputs__email':
                inputText = inputText.replace(spacePtrn, '');
                this.setState((prevState) => {
                    return {
                        contact: {
                            ...prevState.contact,
                            email: inputText
                        }
                    };
                });
                break;
            case 'inputs__website':
                this.setState((prevState) => {
                    return {
                        contact: {
                            ...prevState.contact,
                            website: inputText
                        }
                    };
                });
                break;
            case 'inputs__note':
                this.setState((prevState) => {
                    return {
                        contact: {
                            ...prevState.contact,
                            note: inputText
                        }
                    };
                });
                break;
            default:
                console.error('Uncatched change. Input\'s id:', e.target.id);
                break;
        }
    }

    resetForm() {
        this.setState((prevState) => {
            return {
                contact: {
                    ...emptyContact,
                    color: prevState.color
                }
            };
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
        } = this.state.contact;

        name = typeof name === 'string' && name.trim();
        if (name === '') {
            this.props.showNoti('error', 'Please type a name');
            return;
        } else {
            this.state.contact.name = name;
        }

        this.state.contact.website = (ws => {
            ws = typeof ws === 'string' ? ws.trim() : '';
            if (ws.length) {
                const hasURLSyntax = ws.search(/^https?:\/\/\S+/g) === 0 ? true : false,
                    hasOnlyProtocol = ws.search(/^https?:\/\/$|^h?ttps?:\/\/$|^ht?tps?:\/\/$|^http?s?:\/\/$/g) === 0 ? true : false;
                if (hasURLSyntax) {
                    return fixedEncodeURI(ws);
                } else if (hasOnlyProtocol) {
                    return '';
                } else {
                    return "http://" + fixedEncodeURIComponent(ws);
                }
            } else {
                return ws;
            }
        })(website);

        // format labels data
        let newLabels = [];
        if (this.cboxFamily.checked) { newLabels.push('family'); }
        if (this.cboxCoWorker.checked) { newLabels.push('coWorker'); }
        if (this.cboxFriends.checked) { newLabels.push('friends'); }
        this.state.contact.labels = newLabels;
        // const labelSet = new Set();
        // labelSet.add('family');
        // labelSet.add('coWorker');
        // labelSet.add('friends');
        // this.state.labels = labelSet;

        this.state.contact.note = typeof note === 'string' ? note.trim() : '';

        this.props.handlerSubmit(this.state.contact);
    }

    changeColor(e) {
        this.setState((prevState) => {
            return {
                contact: {
                    ...prevState.contact,
                    color: getRandomColor()
                }
            };
        });
    }

    render () {
        return (
            <Form
                // {...this.props}
                title={this.props.title}
                contact={this.state.contact}
                checkInputFilled={checkInputFilled}
                addFilledClass={addFilledClass}
                handlerSaveForm={this.handlerSaveForm}
                changeColor={this.changeColor}
                handlerChangeInput={this.handlerChangeInput}
                resetForm={this.resetForm}
                closeForm={this.props.closeForm}
                refCBoxFamily={thisDOM => this.cboxFamily = thisDOM}
                refCBoxCoWorker={thisDOM => this.cboxCoWorker = thisDOM}
                refCBoxFriend={thisDOM => this.cboxFriends = thisDOM} />
        );
    }
}

export default FormContainer;
