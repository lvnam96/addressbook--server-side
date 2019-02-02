import React from 'react';
import axios from 'axios';
import jsSHA from "jssha";
import debounce from 'lodash/debounce';
import Timeout from '../../../core/js/models/Timeout';

import SignUpForm from './SignUpForm';

import '../scss/styles.scss';

// basic implementation from Underscore.js
// Used for checking uname available
// checkPasswdMatch is using debounce-way manually
// function debounce(func, wait, immediate) {
//     var timeout;
//     return function() {
//         var args = arguments;
//         var later = () => {
//             timeout = null;
//             if (!immediate) func.apply(this, args);
//         };
//         var callNow = immediate && !timeout;
//         clearTimeout(timeout);
//         timeout = setTimeout(later, wait);
//         if (callNow) func.apply(this, args);
//     };
// };

class SignUpFormContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            unameVal: '',
            passwdVal: '',
            cfPasswdVal: '',
            isUnameUsed: null,
            isSubmitting: null,
            isSigningUpFailed: false,
            isSignedUp: false,
            isPasswdMatched: null
        };
        this.checkPasswdMatchTimeout = null;
        this.submitingTimes = 0;

        this.onUnameChange = this.onUnameChange.bind(this);
        this.onPasswdChange = this.onPasswdChange.bind(this);
        this.onCfPasswdChange = this.onCfPasswdChange.bind(this);
        this.checkUnameAvail = this.checkUnameAvail.bind(this);
        this.checkPasswdsMatch = this.checkPasswdsMatch.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.checkUnameDebouncedFunc = debounce(((uname) => {
            this.checkUnameAvail(uname).then(json => {
                this.setState((prevState, props) => {
                    if (prevState.isUnameUsed === json.data.res) return;
                    return { isUnameUsed: json.data.res };
                });
            }).catch(console.error);// CREATE UI FOR ERROR, SUCCESS,...
        }).bind(this), 500);
    }

    // shouldComponentUpdate () {}

    componentDidUpdate (prevProps, prevState, snapshot) {
        // if (this.state.isSubmitting === true) {
        //     axios.get('http://localhost:3000/signup').then(json => {
        //         if (json.status === 200) {
        //             setTimeout(() => {
        //                 this.setState({ isSubmitting: false });
        //             }, 2000);
        //         } else {
        //             this.setState({ isSubmitting: false });
        //             console.error('Sorry. Server is down.');
        //         }
        //     });
        // }
    }

    checkPasswdsMatch (passwdVal, cfPasswdVal) {
        if (!passwdVal.length && !cfPasswdVal.length) {
            return;
        }

        const clearCheckPasswdTimeout = () => {
            if (this.checkPasswdMatchTimeout.isTiming) {
                // console.log('have timeout', this.checkPasswdMatchTimeout.isTiming);
                this.checkPasswdMatchTimeout.clear();
                // console.log('clear timeout', this.checkPasswdMatchTimeout.isTiming);
            }// else console.log('don\' have timeout');
        };

        // setup
        if (!this.checkPasswdMatchTimeout) {
            this.checkPasswdMatchTimeout = new Timeout(() => {
                // console.log('run cb in timeout');
                // console.log(this.state);

                const curState = this.state;
                if (curState.passwdVal.length && curState.cfPasswdVal.length && curState.passwdVal !== curState.cfPasswdVal) {
                    if (curState.isPasswdMatched) {
                        // console.log('set state', false);
                        // this.setState({ isPasswdMatched: false }, clearCheckPasswdTimeout);
                        this.setState({ isPasswdMatched: false });
                        clearCheckPasswdTimeout();
                    }
                } else {
                    if (!curState.isPasswdMatched) {
                        // console.log('set state', true);
                        // this.setState({ isPasswdMatched: true }, clearCheckPasswdTimeout);
                        this.setState({ isPasswdMatched: true });
                        clearCheckPasswdTimeout();
                    }
                }
            }, 500);
            // console.log('set timeout');
        }

        clearCheckPasswdTimeout();
        this.checkPasswdMatchTimeout.set();
    }

    checkUnameAvail (uname) {
        return axios.get('/backdoor/is-uname-used', {
            params: { uname }
        });
    }

    onUnameChange ({ target: { value: unameVal } }) {
        if (unameVal === '') {
            this.checkUnameDebouncedFunc.cancel();
            return this.setState((prevState, props) => {
                const newState = { unameVal };
                if (prevState.isUnameUsed !== null) {
                    newState.isUnameUsed = null;
                }
                return newState;
            });
        }
        unameVal = unameVal.trim().toLowerCase();
        this.setState({ unameVal, isSigningUpFailed: false }, () => {
            this.checkUnameDebouncedFunc(unameVal);
        });
    }

    onPasswdChange ({ target: { value: passwdVal } }) {
        this.setState((prevState, props) => {
            const newState = { passwdVal, isSigningUpFailed: false };
            // console.log(passwdVal, prevState.cfPasswdVal.length);
            this.checkPasswdsMatch(passwdVal, prevState.cfPasswdVal);
            // newState.isPasswdMatched = this.checkPasswdsMatch(passwdVal, prevState.cfPasswdVal);
            return newState;
        });
    }

    onCfPasswdChange ({ target: { value: cfPasswdVal } }) {
        this.setState((prevState, props) => {
            const newState = { cfPasswdVal };
            // console.log(prevState.passwdVal, cfPasswdVal);
            this.checkPasswdsMatch(prevState.passwdVal, cfPasswdVal);
            // newState.isPasswdMatched = this.checkPasswdsMatch(prevState.passwdVal, cfPasswdVal);
            return newState;
        });
    }

    onSubmit (e) {
        e.preventDefault();// to use AJAX sign in
        const sha512Hash = new jsSHA('SHA-512', 'TEXT');
        const curState = this.state;

        if (curState.passwdVal && curState.cfPasswdVal && (curState.passwdVal === curState.cfPasswdVal) && curState.isPasswdMatched && !curState.isUnameUsed) {
            sha512Hash.update(curState.passwdVal);
            const sha512HashedPasswd = sha512Hash.getHash('HEX');
            this.setState({ isSubmitting: true }, () => {
                axios.post('/signup', {
                    uname: curState.unameVal.trim().toLowerCase(),
                    passwd: sha512HashedPasswd
                }).then(json => {
                // axios.get('http://localhost:2004/signup').then(json => {
                    if (json.status === 200) {
                        this.submitingTimes = this.submitingTimes + 1;
                        const newState = {
                            isSubmitting: false
                        };
                        if (json.data.res === true) {
                            newState.isSignedUp = true;
                            this.setState(newState, () => {
                                let t = setTimeout(() => {
                                    clearTimeout(t);
                                    window.location = "/signin";
                                }, 500);
                            });
                        } else {
                            newState.isSignedUp = false;
                            newState.isUnameUsed = null;
                            // newState.isPasswdMatched = null;
                            newState.isSigningUpFailed = true;
                            this.setState(newState);
                        }
                    } else {
                        this.setState({ isSubmitting: false });
                        console.error('Sorry. Server is down.');
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
            cfPasswdVal,
            isUnameUsed,
            isSubmitting,
            isSigningUpFailed,
            isSignedUp,
            isPasswdMatched
        } = this.state;
        const isReadyToSubmit = !!unameVal && !!passwdVal && !!cfPasswdVal && isPasswdMatched === true && isUnameUsed === false;
        // const isSigningUpFailed = !isSignedUp && this.submitingTimes > 0;
        return (
            <SignUpForm unameVal={unameVal} passwdVal={passwdVal} cfPasswdVal={cfPasswdVal} isUnameUsed={isUnameUsed} isPasswdMatched={isPasswdMatched} onPasswdChange={this.onPasswdChange} onCfPasswdChange={this.onCfPasswdChange} onUnameChange={this.onUnameChange} isReadyToSubmit={isReadyToSubmit} isSubmitting={isSubmitting} isSignedUp={isSignedUp} isSigningUpFailed={isSigningUpFailed} onSubmit={this.onSubmit} />
        );
    }
}

export default SignUpFormContainer;
