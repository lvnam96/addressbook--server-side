import React from 'react';
import PropTypes from 'prop-types';
// import Dropdown from 'react-bootstrap/Dropdown';
import classNames from 'classnames';
import { push } from 'connected-react-router';

// import AsyncCbookFormPopup from '../CbookForm/AsyncCbookFormPopup.jsx';
import { stopEventBubbling } from '../../helpers/DOMHelper';
import { getCSSColorString } from '../../helpers/utilsHelper';
import CbookFormContainer from '../CbookForm/CbookFormContainer.jsx';
import IconBtn from '../buttons/IconBtn.jsx';

const CbookSwitcher = (props) => {
  return (
    <div className="cbooks-switcher">
      <div className="cbooks-switcher__header">
        <p className="font-weight-bold">Your Contact Books</p>
      </div>
      <div className="mb-3 cbooks-switcher__body">
        {props.cbooks.map((cbook, idx) => {
          // const isLast = idx + 1 === props.cbooks.length;
          const cbookId = cbook.id;
          const isDefaultCbook = props.defaultCbookId === cbookId;
          const cbookColor = cbook.color;
          const colorStr = getCSSColorString(cbookColor);
          return (
            <React.Fragment key={cbookId}>
              {props.isShowInlineCbookForm[cbookId] ? (
                <div className="py-3 px-1 px-md-2">
                  <CbookFormContainer
                    cbook={cbook}
                    isInlineForm
                    handleClose={() => props.hideInlineCbookForm(cbookId)}
                  />
                </div>
              ) : (
                <div
                  className={classNames('cbooks-switcher__cbook row align-items-center py-3 px-md-2', {
                    'text-gray': !isDefaultCbook,
                  })}
                  style={{
                    color: colorStr,
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    adbk.redux.store.dispatch(push(`/cbooks/${cbookId}/`));
                  }}
                >
                  <div className="col-auto">
                    <p className="mb-0 text-center">
                      <i className="fas fa-address-book" style={{ fontSize: '1.3rem' }} />
                    </p>
                  </div>
                  <div className="col">
                    <p className="mb-0 ">{cbook.name}</p>
                  </div>
                  {/* <div className="col-auto" onClick={stopEventBubbling}>
                      <Dropdown alignRight={isLast} drop="left">
                        <Dropdown.Toggle
                          bsPrefix="a"
                          href="#"
                          variant=""
                          id="dropdown-basic"
                          className="icon-btn icon-btn--dark-bg">
                          <i className="fas fa-ellipsis-v text-gray" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="border-0 shadow" style={{ overflow: 'hidden' }}>
                          <Dropdown.Item
                            className={classNames('py-2', {
                              disabled: isDefaultCbook,
                              'text-gray': isDefaultCbook,
                            })}
                            onClick={(e) => adbk.redux.store.dispatch(push(`/cbooks/${cbookId}/`))}>
                            <i
                              className={classNames('far fa-star', {
                                'text-warning': !isDefaultCbook,
                              })}
                            />
                            &nbsp;&nbsp;Mark as default
                          </Dropdown.Item>
                          <Dropdown.Item className="py-2" onClick={(e) => props.showInlineCbookForm(cbookId)}>
                            <i className="far fa-edit text-info" />
                            &nbsp;&nbsp;Edit
                          </Dropdown.Item>
                          <hr className="my-2" />
                          <Dropdown.Item
                            className="py-2"
                            onClick={(e) => {
                              props.setDeletedCbook(cbook);
                              props.openConfirmDialog();
                            }}>
                            <i className="far fa-trash-alt text-danger" />
                            &nbsp;&nbsp;Delete
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div> */}
                  <div className="col-auto pr-1" onClick={stopEventBubbling}>
                    <IconBtn
                      className={classNames('icon-btn--dark-bg font-weight-bold')}
                      onClick={(e) => props.showInlineCbookForm(cbookId)}
                    >
                      <i className="far fa-edit" />
                    </IconBtn>
                  </div>
                  <div className="col-auto pl-1" onClick={stopEventBubbling}>
                    <IconBtn
                      className={classNames('icon-btn--dark-bg font-weight-bold')}
                      onClick={(e) => {
                        props.handleDeleteCbook(cbook);
                      }}
                    >
                      <i className="fas fa-times" />
                    </IconBtn>
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {props.newCbooks.length > 0 &&
        props.newCbooks.map((cbook) => {
          return (
            <div key={cbook.id} className="my-3 px-md-2">
              <CbookFormContainer cbook={cbook} isInlineForm handleClose={() => props.removeNewCbookForm(cbook.id)} />
            </div>
          );
        })}
      <div className="cbooks-switcher__foooter row align-items-center justify-content-end">
        <div className="col-auto">
          <p className="text-right mb-0">
            <button className="btn btn-primary font-weight-bold" onClick={props.addNewCbookForm}>
              Add
            </button>
          </p>
        </div>
        {props.isOpenInPopup && (
          <div className="col-auto">
            <p className="text-right mb-0">
              <button className="btn btn-primary font-weight-bold" onClick={props.onClose}>
                Close
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
CbookSwitcher.propTypes = {
  // openingCbook: PropTypes.instanceOf(adbk.classes.Cbook),
  // activatingCbook: PropTypes.instanceOf(adbk.classes.Cbook),
  defaultCbookId: PropTypes.string.isRequired,
  handleDeleteCbook: PropTypes.func.isRequired,
  isOpenInPopup: PropTypes.bool,
  onClose: PropTypes.func,
  cbooks: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Cbook).isRequired).isRequired,
  isShowInlineCbookForm: PropTypes.object.isRequired,
  showInlineCbookForm: PropTypes.func.isRequired,
  hideInlineCbookForm: PropTypes.func.isRequired,
  newCbooks: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Cbook)),
  addNewCbookForm: PropTypes.func.isRequired,
  removeNewCbookForm: PropTypes.func.isRequired,
};

export default CbookSwitcher;
