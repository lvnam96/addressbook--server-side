import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.Component {
    constructor(props) {
        super(props);
        let data = this.props.data;
        this.state = {
            name: data.name,
            id: data.id,
            color: data.color,
            labels: data.labels,
            birth: data.birth,
            note: data.note,
            email: data.email,
            website: data.website,
            phone: data.phone
        };
        this.cboxFamily;
        this.cboxFriends;
        this.cboxCoWorker;
        this.handlerSaveForm = this.handlerSaveForm.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.handlerChangeName = this.handlerChangeName.bind(this);
        this.handlerChangePhone = this.handlerChangePhone.bind(this);
        this.handlerChangeBirth = this.handlerChangeBirth.bind(this);
        this.handlerChangeWebsite = this.handlerChangeWebsite.bind(this);
        this.handlerChangeEmail = this.handlerChangeEmail.bind(this);
        this.handlerChangeNote = this.handlerChangeNote.bind(this);
    }
    static get propTypes() {
        return {
            title: PropTypes.string.isRequired,
            data: PropTypes.shape({
                name: PropTypes.string.isRequired,
                id: PropTypes.string.isRequired,
                color: PropTypes.string.isRequired,
                labels: PropTypes.arrayOf(PropTypes.string),
                birth: PropTypes.string,
                note: PropTypes.string,
                email: PropTypes.string,
                website: PropTypes.string,
                phone: PropTypes.string
            }).isRequired,
            onClose: PropTypes.func.isRequired,
            onSave: PropTypes.func.isRequired,
            showNoti: PropTypes.func.isRequired,
            getRandomColor: PropTypes.func.isRequired
        };
    }
    handlerChangeName(e) {
        this.setState({ name: e.target.value });
    }
    handlerChangePhone(e) {
        this.setState({ phone: e.target.value });
    }
    handlerChangeBirth(e) {
        this.setState({ birth: e.target.value });
    }
    handlerChangeWebsite(e) {
        this.setState({ website: e.target.value });
    }
    handlerChangeEmail(e) {
        this.setState({ email: e.target.value });
    }
    handlerChangeNote(e) {
        this.setState({ note: e.target.value });
    }
    handlerSaveForm(e) {
        e.preventDefault();

        if (this.state.name === '') {
            this.props.showNoti('error', 'Please type a name');
            return;
        }

        // format data for labels
        let newLabels = [];
        if (this.cboxFamily.checked) { newLabels.push('family') }
        if (this.cboxCoWorker.checked) { newLabels.push('coWorker') }
        if (this.cboxFriends.checked) { newLabels.push('friends') }
        this.state.labels = newLabels;

        this.props.onSave(this.state);
    }
    changeColor(e) {
        this.setState({
            color: this.props.getRandomColor()
        });
    }
    render() {
        return (
            <div className='overlay' onClick={this.props.onClose}>
                <div className='form-container' onClick={e => e.stopPropagation()}>
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
                                <img src='http://res.cloudinary.com/nh0kvjpp0ybh/image/upload/v1502960147/photo3_styhnr.png' />
                                <div className="form-body__avt__first-letter"
                                style={{backgroundColor: this.state.color}}
                                title='We have not support avatar yet! So... choose a random color for this contact!'
                                ref={thisDiv => { this.avtDOM = thisDiv; }}
                                onClick={this.changeColor}>
                                    {this.state.name ? this.state.name[0].toUpperCase() : '?'}
                                </div>
                            </div>
                            <div className='form-body__inputs'>
                                <div className='form-body__inputs__name'>
                                    <input type='text' id='inputs__name' required value={this.state.name} onChange={this.handlerChangeName} />
                                    <label htmlFor='inputs__name'>Name</label>
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
                                <div className='form-body__inputs__phone'>
                                    <input type='number' id='inputs__phone' value={this.state.phone} onChange={this.handlerChangePhone} />
                                    <label htmlFor='inputs__phone'>Phone</label>
                                </div>
                                <div className='form-body__inputs__birth'>
                                    <input type='date' id='inputs__birth' value={this.state.birth} onChange={this.handlerChangeBirth} />
                                    <label htmlFor='inputs__birth'>Birth</label>
                                </div>
                                <div className='form-body__inputs__email'>
                                    <input type='email' id='inputs__email' value={this.state.email} onChange={this.handlerChangeEmail} />
                                    <label htmlFor='inputs__email'>Email</label>
                                </div>
                                <div className='form-body__inputs__website'>
                                    <input type='text' id='inputs__website' value={this.state.website} onChange={this.handlerChangeWebsite} />
                                    <label htmlFor='inputs__website'>Website</label>
                                </div>
                                <div className='form-body__inputs__note'>
                                    <textarea id='inputs__note' value={this.state.note} onChange={this.handlerChangeNote} />
                                    <label htmlFor='inputs__note'>Note</label>
                                </div>
                            </div>
                        </div>
                        <div className='form-footer'>
                            <div className='form-footer__reset-btn'>
                                <span>Reset</span>
                            </div>
                            <div className='form-footer__cancel-btn' onClick={this.props.onClose}>
                                <span>Cancel</span>
                            </div>
                            <div className='form-footer__save-btn' onClick={this.handlerSaveForm}>
                                <span>Save</span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default Form;
