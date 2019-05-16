import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TextInput from './TextInput';

class TextField extends React.PureComponent {
    render() {
        return (
            <div
                className={classNames('input-wrapper', {
                    'no-label': typeof this.props.children === 'undefined',
                })}>
                <TextInput {...this.props} />
                {this.props.children}
            </div>
        );
    }
}

TextField.propTypes = {
    children: PropTypes.element, // label element
};

TextField.defaultProps = {
    children: <label />, // label element
};

export default TextField;
