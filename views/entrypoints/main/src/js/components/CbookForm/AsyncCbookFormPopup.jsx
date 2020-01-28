import React from 'react';
import PropTypes from 'prop-types';

import AsyncPopup from '../Popup/AsyncPopup.jsx';
const CbookFormContainer = React.lazy(() => import(/* webpackPreload: true */ './CbookFormContainer.jsx'));

class AsyncCbookFormPopup extends React.PureComponent {
  constructor (props) {
    super(props);
    this.state = {};
  }

  static get propTypes () {
    return {
      modalProps: PropTypes.shape({
        isOpen: PropTypes.bool.isRequired,
        onClose: PropTypes.func.isRequired,
      }).isRequired,
    };
  }

  render () {
    const commonPopupProps = {
      isOpen: this.props.modalProps.isOpen,
      handleClose: this.props.modalProps.onClose,
    };
    const cbookFormProps = { ...this.props };
    delete cbookFormProps.modalProps;
    return (
      <AsyncPopup modalProps={{ ...commonPopupProps }} fallbackModalProps={{ ...commonPopupProps }}>
        <CbookFormContainer {...cbookFormProps} handleClose={this.props.modalProps.onClose} />
      </AsyncPopup>
    );
  }
}

export default AsyncCbookFormPopup;
