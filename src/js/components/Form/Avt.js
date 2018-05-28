import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class FormAvt extends PureComponent {
    static get propTypes() {
        return {
            color: PropTypes.string.isRequired,
            changeColor: PropTypes.func.isRequired,
            firstLetter: PropTypes.string.isRequired
        };
    }

    render() {
        return (
            <div className="form-avt">
                <div className="form-avt__first-letter"
                    style={{ backgroundColor: this.props.color }}
                    title="We have not support avatar yet! So... choose a random color for this contact!"
                    onClick={this.props.changeColor}>
                    {this.props.firstLetter}
                </div>
            </div>
        );
    }
}

export default FormAvt;
