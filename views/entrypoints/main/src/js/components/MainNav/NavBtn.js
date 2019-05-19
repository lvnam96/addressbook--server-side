import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const NavBtn = (props) => {
  if (props.isDropdownBtn && props.inputId) {
    return (
      <label
        ref={props.btnRef}
        htmlFor={props.inputId}
        className={classNames('main-nav__item', {
          [props.moreClass]: !!props.moreClass,
        })}
        onClick={props.onClick}>
        <i
          className={classNames('fa', {
            [props.icon]: !!props.icon,
          })}
        />
        <span className="main-nav__item-label">{props.label}</span>
      </label>
    );
  }
  // React.forwardRef((props, ref) => {
  return (
    <div
      ref={props.btnRef}
      className={classNames('main-nav__item', {
        [props.moreClass]: !!props.moreClass,
      })}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onTouchStart={props.onTouchStart}
      onTouchEnd={props.onTouchEnd}>
      <i
        className={classNames('fa', {
          [props.icon]: !!props.icon,
        })}
      />
      <span className="main-nav__item-label">{props.label}</span>
    </div>
  );
};

NavBtn.propTypes = {
  btnRef: PropTypes.object,
  onClick: PropTypes.func.isRequired,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputId: PropTypes.string,
  moreClass: PropTypes.string,
  isDropdownBtn: PropTypes.bool,
};

export default NavBtn;
