import React from 'react';
import axios from 'axios';
import jsSHA from "jssha";
import debounce from 'lodash/debounce';
import Timeout from '../../../core/js/models/Timeout';

import SignInForm from './SignInForm';

import '../scss/styles.scss';

class SignInFormContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            unameVal: '',
            passwdVal: '',
            isWrongUnameOrPasswd: false,
            isSignedIn: false,
            isSubmitting: null
        };
        this.submitingTimes = 0;

        this.onUnameChange = this.onUnameChange.bind(this);
        this.onPasswdChange = this.onPasswdChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onUnameChange ({ target: { value: unameVal }}) {
        unameVal = unameVal.trim().toLowerCase();
        if (unameVal.length <= 20) {
            this.setState({ unameVal });
        }
    }

    onPasswdChange ({ target: { value: passwdVal }}) {
        this.setState({ passwdVal });
    }

    onSubmit (e) {
        e.preventDefault();
        const sha512Hash = new jsSHA('SHA-512', 'TEXT');
        const curState = this.state;
        if (curState.unameVal.length <= 20 && curState.passwdVal) {
            sha512Hash.update(curState.passwdVal);
            const sha512HashedPasswd = sha512Hash.getHash('HEX');
            this.setState({ isSubmitting: true }, () => {
                axios.post('/signin', {
                    uname: curState.unameVal.trim().toLowerCase(),
                    passwd: sha512HashedPasswd
                }).then(json => {
                // axios.get('http://localhost:2004/signin').then(json => {
                    if (json.status === 200) {
                        this.submitingTimes = this.submitingTimes + 1;
                        const newState = {
                            isSubmitting: false
                        };
                        if (json.data.res === true) {
                            newState.isSignedIn = true;
                            this.setState(newState, () => {
                                let t = setTimeout(() => {
                                    clearTimeout(t);
                                    window.location = "/";
                                }, 500);
                            });
                        } else {
                            newState.isWrongUnameOrPasswd = true;
                            this.setState(newState);
                        }
                    } else {
                        console.error('Sorry, server is down.');
                    }
                });
            });
        }
    }

    render () {
        let returnedUser = 'noone';
        const {
            unameVal,
            passwdVal,
            isWrongUnameOrPasswd,
            isSignedIn,
            isSubmitting
        } = this.state;
        const isReadyToSubmit = !!unameVal && !!passwdVal;
        return (<SignInForm unameVal={unameVal} passwdVal={passwdVal} isReadyToSubmit={isReadyToSubmit} onPasswdChange={this.onPasswdChange} isWrongUnameOrPasswd={isWrongUnameOrPasswd} isSignedIn={isSignedIn} submitingTimes={this.submitingTimes} onSubmit={this.onSubmit} isSubmitting={isSubmitting} onUnameChange={this.onUnameChange}/>);
    }
}

export default SignInFormContainer;
