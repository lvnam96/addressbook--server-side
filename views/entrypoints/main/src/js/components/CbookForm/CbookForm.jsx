import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import TextInput from '../form/fields/TextInput';
// import FormLabel from '../form/FormLabel.jsx';
import SketchColorPicker from '../form/SketchColorPicker.jsx';
import IconBtn from '../buttons/IconBtn.jsx';
import { getCSSColorString } from '../../helpers/utilsHelper';

class CbookForm extends React.PureComponent {
  constructor (props) {
    super(props);

    this.changeColor = this.changeColor.bind(this);
  }

  static get propTypes () {
    return {
      isOpenInPopup: PropTypes.bool,
      isInlineForm: PropTypes.bool,
      handleClose: PropTypes.func,
      setFieldValue: PropTypes.func.isRequired,
    };
  }

  changeColor (newColor) {
    this.props.setFieldValue('color', newColor, true);
  }

  render () {
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      isSubmitting,
      // resetForm,
      setFieldValue,
    } = this.props;
    const colorStr = getCSSColorString(values.color);
    const isNeedToClose = this.props.isOpenInPopup || this.props.isInlineForm;
    return (
      <form onSubmit={handleSubmit} onReset={handleReset}>
        <div className="row align-items-center">
          <div className="col pr-1">
            <div className="input-group">
              <div className="input-group-prepend">
                <SketchColorPicker type="hex" color={values.color} changeColor={this.changeColor}>
                  <label
                    className="input-group-text"
                    htmlFor="inputGroupSelect01"
                    style={{
                      borderColor: colorStr,
                      backgroundColor: colorStr,
                    }}
                  >
                    <i className="fas fa-address-book" />
                  </label>
                </SketchColorPicker>
              </div>
              <TextInput
                msg={touched.name && errors.name ? errors.name : ''}
                type="text"
                id="input--cbook-name"
                required
                autoFocus
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control form__input-field"
              />
            </div>
          </div>
          <div
            className={classNames('col-auto pl-1', {
              'pr-1': isNeedToClose,
            })}
          >
            <p className="mb-0">
              <IconBtn type="submit" className={classNames('font-weight-bold', { disabled: isSubmitting })}>
                <i className="fas fa-check text-success" />
              </IconBtn>
            </p>
          </div>
          {isNeedToClose && (
            <div className="col-auto pl-1">
              <p className="text-right mb-0">
                <IconBtn
                  className={classNames('font-weight-bold', { disabled: isSubmitting })}
                  onClick={this.props.handleClose}
                >
                  <i className="fas fa-times text-danger" />
                </IconBtn>
              </p>
            </div>
          )}
        </div>
      </form>
    );
  }
}

export default CbookForm;
