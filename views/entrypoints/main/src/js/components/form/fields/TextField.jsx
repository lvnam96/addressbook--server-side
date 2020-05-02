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
    const { inputProps, children, msg, label, labelFor, ...htmlAttrs } = _merge({}, this.props.inputProps, this.props);
    delete htmlAttrs.inputProps;
    delete htmlAttrs.children;
    delete htmlAttrs.msg;
    delete htmlAttrs.label;
    delete htmlAttrs.labelFor;
    let labelElem;
    if (isValidElement(label)) {
      labelElem = label;
    } else if (typeof label === 'string') {
      labelElem = (
        <label className="" htmlFor={htmlAttrs.id}>
          <span className="">{label}</span>
        </label>
      );
    }
    return (
      <div className="form-group">
        {labelElem}
        <TextInput
          {...htmlAttrs}
          // value={value}
          // onChange={onChange}
          // onBlur={onBlur}
          className={classNames('form-control', inputProps.className)}
        />
        {msg && <InputFeedback msg={msg} />}
        {children}
      </div>
    );
  }
}

TextField.propTypes = {
  inputProps: PropTypes.object.isRequired, // should be plain object containing non-dynamic values
  // value: PropTypes.string.isRequired,
  // onChange: PropTypes.func.isRequired,
  // onBlur: PropTypes.func.isRequired,
  children: PropTypes.element, // custom input feeback,...
  msg: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]), // set to a string to add default label, or an React element to override the default label
};
TextField.defaultProps = {};

export default memo(TextField);
