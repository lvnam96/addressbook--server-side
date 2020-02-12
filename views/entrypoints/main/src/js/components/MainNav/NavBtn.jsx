import React, { memo } from 'react';
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
          style={{
            ...props.iconStyle,
          }}
        />
        <span className="main-nav__item-label">{props.label}</span>
      </label>
    );
  }
  // React.forwardRef((props, ref) => {
  return (
    <div
      role="button"
      tabIndex="0"
      onKeyDown={(e) => {
        if (e.keyCode === 53) {
        }
      }}
      onKeyUp={(e) => {
        if (e.keyCode === 53) {
        }
      }}
      ref={props.btnRef}
      className={classNames('main-nav__item', {
        [props.moreClass]: !!props.moreClass,
      })}
      onClick={props.onClick}
      onMouseDown={props.onMouseDown}
      onMouseUp={props.onMouseUp}
      onTouchStart={props.onMouseDown}
      onTouchEnd={props.onMouseUp}>
      <i
        className={classNames('fa', {
          [props.icon]: !!props.icon,
        })}
        style={{
          ...props.iconStyle,
        }}
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
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputId: PropTypes.string,
  moreClass: PropTypes.string,
  isDropdownBtn: PropTypes.bool,
  iconStyle: PropTypes.object,
};

export default memo(NavBtn);
