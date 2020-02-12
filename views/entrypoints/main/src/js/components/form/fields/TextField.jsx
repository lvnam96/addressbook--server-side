import React, { memo, isValidElement, Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _isEqualWith from 'lodash/isEqualWith';
import _merge from 'lodash/merge';

import TextInput from './TextInput.jsx';
import InputFeedback from './InputFeedback.jsx';

class TextField extends Component {
  shouldComponentUpdate(nextProps) {
    if (
      !_isEqualWith(nextProps, this.props, (first, second, key) => {
        if (key === 'children') {
          return true;
        }
      })
    ) {
      return true;
    }
    return false;
  }

  // // eslint-disable-next-line camelcase
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   const diff = {
  //     curr: {},
  //     next: {},
  //   };
  //   for (const key of Object.keys(nextProps)) {
  //     if (Object.prototype.hasOwnProperty.call(nextProps, key) && this.props[key] !== nextProps[key]) {
  //       diff.curr[key] = this.props[key];
  //       diff.next[key] = nextProps[key];
  //     }
  //   }
  //   if (Object.keys(diff.curr).length) {
  //     console.group(`${this.props.inputProps.name} componentWillReceiveProps()`);
  //     console.log('Diff props', diff);
  //     console.groupEnd();
  //   }
  //   return true;
  // }

  render() {
    const htmlInputProps = _merge({}, this.props.inputProps, this.props);
    delete htmlInputProps.inputProps;
    delete htmlInputProps.children;
    delete htmlInputProps.msg;
    delete htmlInputProps.label;
    delete htmlInputProps.labelFor;
    let labelElem;
    if (isValidElement(this.props.label)) {
      labelElem = this.props.label;
    } else if (typeof this.props.label === 'string') {
      labelElem = (
        <label className="" htmlFor={htmlInputProps.id}>
          <span className="">{this.props.label}</span>
        </label>
      );
    }
    return (
      <div className="form-group">
        {labelElem}
        <TextInput
          {...htmlInputProps}
          // value={this.props.value}
          // onChange={this.props.onChange}
          // onBlur={this.props.onBlur}
          className={classNames('form-control', this.props.inputProps.className)}
        />
        {this.props.msg && <InputFeedback msg={this.props.msg} />}
        {this.props.children}
      </div>
    );
  }
}

TextField.propTypes = {
  inputProps: PropTypes.object.isRequired, // should be plain object containing non-dynamic values
  // value: PropTypes.string.isRequired,
  // onChange: PropTypes.func.isRequired,
  // onBlur: PropTypes.func.isRequired,
  children: PropTypes.element, // input feeback,...
  msg: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // set to a string to add default label, or an React element to override the default label
};
TextField.defaultProps = {};

export default memo(TextField);
