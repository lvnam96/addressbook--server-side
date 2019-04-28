import React from 'react';
import PropTypes from 'prop-types';

class FormHeader extends React.PureComponent {
    static get propTypes() {
        return {
            title: PropTypes.string.isRequired,
            handlerCloseBtn: PropTypes.func.isRequired
        };
    }

    render() {
        return (
            <div className="form-header">
                <div className="form-title">
                    <h2 className="form-title__text">{this.props.title}</h2>
                </div>
                <div className="form__close-btn" onClick={this.props.handlerCloseBtn}>
                    <i className="fa fa-times"></i>
                </div>
            </div>
        );
    }
}

export default FormHeader;
