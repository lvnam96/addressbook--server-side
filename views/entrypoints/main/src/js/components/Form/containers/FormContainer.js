import React from 'react';
import PropTypes from 'prop-types';

import { randomUUID, getRandomColor } from '../../../helpers/utilsHelper';
import { convertDateObjToHTMLInputVal } from '../../../helpers/timeHelper';
import { fixedEncodeURIComponent, fixedEncodeURI } from '../../../helpers/encodeHelper';

import Form from '../Form';
// import { parenthesizedExpression } from 'babel-types';
import emptyContact from './emptyContactData.json';
emptyContact.id = randomUUID();
emptyContact.color = getRandomColor();

const spacePtrn = /\s/g;
const addFilledClass = e => {
    e.target.parentNode.classList.add('JS-form__input-container--filled');
};
const checkInputFilled = e => {
    const inputElem = e.target;
    if (inputElem.value === '') {
        inputElem.parentNode.classList.remove('JS-form__input-container--filled');
    }
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
            console.log(prevState);
            return {
                contact: {
                    ...emptyContact,
                    color: prevState.contact.color,
                }
            };
        });

        this.checkInputsHaveValueThen(info => {
            document.getElementById(`inputs__${info}`).parentNode.classList.remove('JS-form__input-container--filled');
        });
    }

    handlerSaveForm(e) {
        e.preventDefault();

        const submittedData = Object.assign({}, this.state.contact);

        submittedData.name = String(submittedData.name) && submittedData.name.trim();
        if (submittedData.name === '') {
            this.props.showNoti('error', 'Please type a name');
            return;
        } else {
            submittedData.name = name;
        }

        submittedData.website = (ws => {
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
        })(submittedData.website);

        // format labels data
        let newLabels = [];
        if (this.cboxFamily.checked) { newLabels.push('family'); }
        if (this.cboxCoWorker.checked) { newLabels.push('coWorker'); }
        if (this.cboxFriends.checked) { newLabels.push('friends'); }
        submittedData.labels = newLabels;
        // const labelSet = new Set();
        // labelSet.add('family');
        // labelSet.add('coWorker');
        // labelSet.add('friends');
        // this.state.labels = labelSet;

        submittedData.note = typeof note === 'string' ? submittedData.note.trim() : '';

        this.props.handlerSubmit(submittedData);
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
                refCBoxFriend={thisDOM => this.cboxFriends = thisDOM}
            />
        );
    }
}

export default FormContainer;
