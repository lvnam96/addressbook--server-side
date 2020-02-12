import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {
  preventBodyElemScrolling,
  setBodyElemScrollable,
  stopEventBubbling,
  isPressedEscBtn,
} from '../../helpers/DOMHelper';
import { randomUUID } from '../../helpers/utilsHelper';

const popupPropTypes = {
  popupStyle: PropTypes.object,
  contentBoxStyle: PropTypes.object,
  backdropStyle: PropTypes.object,
  children: PropTypes.element.isRequired,
  isCentered: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};
let popupCounter = 0;
const doc = window.document;

class PopupContainer extends React.PureComponent {
  static get propTypes() {
    return {
      ...popupPropTypes,
      isOpen: PropTypes.bool,
    };
  }

  render() {
    const { isOpen } = this.props;
    return isOpen === undefined || (isOpen !== undefined && !!isOpen) ? <Popup {...this.props} /> : null;
  }
}

const popupStack = new adbk.classes.Stack();
// This comp receives only single comp as child
class Popup extends React.PureComponent {
  constructor(props) {
    super(props);
    this.popupRef = React.createRef();
    this.id = randomUUID();
    this.backdropZIndex = 10 + 2 * popupCounter;
    this.popupZIndex = 11 + 2 * popupCounter;

    this.dismissCurrentPopup = this.dismissCurrentPopup.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  static get propTypes() {
    return {
      ...popupPropTypes,
      // popupRef: PropTypes.object,
      // popupId: PropTypes.string.isRequired,
    };
  }

  static get defaultProps() {
    return {
      popupStyle: {},
      contentBoxStyle: {},
      backdropStyle: {},
      isCentered: true,
    };
  }

  // for accessing from other modules
  static get stack() {
    return popupStack;
  }

  componentDidMount() {
    popupCounter++;
    popupStack.push(this.id);
    preventBodyElemScrolling();

    doc.addEventListener('keyup', this.dismissCurrentPopup);
  }

  componentWillUnmount() {
    if (this.id === popupStack.last) {
      popupCounter--;
      popupStack.pull();
    }
    if (popupStack.len === 0) setBodyElemScrollable();

    doc.removeEventListener('keyup', this.dismissCurrentPopup);
  }

  dismissCurrentPopup(e) {
    if (isPressedEscBtn(e) && this.id === popupStack.last) {
      this.props.handleClose();
    }
  }

  handleClose(e) {
    this.props.handleClose();
  }

  render() {
    // React.Children.only(children); // verification step
    const children = React.cloneElement(this.props.children, {
      isOpenInPopup: true, // pointer-events: none; on .popup-dialog doesn't work
    });

    return createPortal(
      <>
        <div
          className="popup-backdrop"
          style={{
            ...this.props.backdropStyle,
            zIndex: this.backdropZIndex,
          }}
        />
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
        <div
          ref={this.popupRef}
          data-id={this.id}
          className="popup"
          onClick={this.handleClose}
          style={{
            ...this.props.popupStyle,
            zIndex: this.popupZIndex,
          }}>
          <div
            className={classNames('popup-dialog', {
              'popup-dialog--centered': this.props.isCentered,
            })}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            <div className="popup-content" style={this.props.contentBoxStyle} onClick={stopEventBubbling}>
              {children}
            </div>
          </div>
        </div>
      </>,
      document.body
    );
  }
}

export default PopupContainer;
