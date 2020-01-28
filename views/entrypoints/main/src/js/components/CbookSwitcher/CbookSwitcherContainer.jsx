import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CbookSwitcher from './CbookSwitcher.jsx';

class CbookSwitcherContainer extends React.PureComponent {
  constructor (props) {
    super(props);
    const isShowInlineFormState = {};
    props.cbooks.forEach((cbook) => {
      isShowInlineFormState[cbook.id] = false;
    });
    this.state = {
      isOpenCbookForm: false,
      openingCbook: null,
      isOpenConfirmDialog: false,
      isShowInlineCbookForm: isShowInlineFormState,
      newCbooks: [],
    };
    this.deletedCbook = null;

    this.handleDeleteCbook = this.handleDeleteCbook.bind(this);
    this.setDeletedCbook = this.setDeletedCbook.bind(this);
    this.onClose = this.onClose.bind(this);
    this.showInlineCbookForm = this.showInlineCbookForm.bind(this);
    this.hideInlineCbookForm = this.hideInlineCbookForm.bind(this);
    this.addNewCbookForm = this.addNewCbookForm.bind(this);
    this.removeNewCbookForm = this.removeNewCbookForm.bind(this);
  }

  static get propTypes () {
    return {
      isOpenInPopup: PropTypes.bool,
      handleClose: PropTypes.func,
      defaultCbookId: PropTypes.string.isRequired,
      cbooks: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Cbook).isRequired).isRequired,
    };
  }

  showInlineCbookForm (cbookId) {
    this.setState((prevState) => {
      return {
        isShowInlineCbookForm: {
          ...prevState.isShowInlineCbookForm,
          [cbookId]: true,
        },
      };
    });
  }

  hideInlineCbookForm (cbookId) {
    this.setState((prevState) => {
      return {
        isShowInlineCbookForm: {
          ...prevState.isShowInlineCbookForm,
          [cbookId]: false,
        },
      };
    });
  }

  setDeletedCbook (cbook) {
    this.deletedCbook = cbook;
  }

  handleDeleteCbook (cbook) {
    this.setDeletedCbook(cbook);
    adbk.openConfirmDialog((ans) => {
      if (ans) {
        adbk.deleteCbook(this.deletedCbook).then(() => {
          this.deletedCbook = null;
          adbk.closeConfirmDialog();
        });
      } else {
        adbk.closeConfirmDialog();
      }
    });
  }

  onClose (e) {
    this.props.handleClose();
  }

  addNewCbookForm () {
    this.setState((prevState) => {
      return {
        newCbooks: [...prevState.newCbooks, adbk.classes.Cbook.fromScratch()],
      };
    });
  }

  removeNewCbookForm (cbookId) {
    this.setState((prevState) => {
      return {
        newCbooks: prevState.newCbooks.filter((cbook) => cbook.id !== cbookId),
      };
    });
  }

  render () {
    return (
      <CbookSwitcher
        isOpenInPopup={this.props.isOpenInPopup}
        handleClose={this.props.handleClose}
        defaultCbookId={this.props.defaultCbookId}
        cbooks={this.props.cbooks}
        isOpenConfirmDialog={this.state.isOpenConfirmDialog}
        openingCbook={this.state.openingCbook}
        handleDeleteCbook={this.handleDeleteCbook}
        closeConfirmDialog={this.closeConfirmDialog}
        onClose={this.onClose}
        isShowInlineCbookForm={this.state.isShowInlineCbookForm}
        showInlineCbookForm={this.showInlineCbookForm}
        hideInlineCbookForm={this.hideInlineCbookForm}
        newCbooks={this.state.newCbooks}
        addNewCbookForm={this.addNewCbookForm}
        removeNewCbookForm={this.removeNewCbookForm}
      />
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  cbooks: state.cbooks,
  defaultCbookId: state.user.meta.lastActivatedCbookId,
});
export default connect(mapStateToProps)(CbookSwitcherContainer);
// export default CbookSwitcherContainer;
