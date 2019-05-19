import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getListOfBirthsToday, filterBirthsToday } from './helpers/timeHelper';
import { checkStorageAvailable } from './helpers/checkSupportedFeaturesHelper';
import * as storeActions from './storeActions';

import MainNav from './components/MainNav/containers/MainNavContainer';
import NotiBar from './components/NotiBar';
import MainContent from './components/MainContent/containers/MainContentContainer';
import WorkingForm from './components/Form/WorkingForm';
import ConfirmDialog from './components/Modals/ConfirmDialog';
import LoadingPopup from './components/Popup/LoadingPopup';
const ContactCard = React.lazy(() => import(/* webpackPreload: true */ './components/ContactCard/ContactCard'));

const bodyElem = document.body;
const CONTACT_EDIT_FORM_SLUG = 'contact-edit-form';
const MODAL_DIALOG_SLUG = 'modal-dialog';
const CONTACT_CARD_SLUG = 'contact-card';
const preventBodyElemScrolling = () => {
  bodyElem.classList.add('popup-open');
};
const setBodyElemScrollable = () => {
  bodyElem.classList.remove('popup-open');
};

class App extends React.Component {
  constructor (props) {
    super(props);
    this.boundActions = adbk.redux.action;
    this.state = {
      contactIndex: 0,
      openingContactId: null,
      // isShowCC: false,
      // isConfirming: false,
      // isShowForm: false,
      prevOpenedPopupList: new adbk.classes.Stack(),
      dialogContent: null,
      popupTogglersManager: new adbk.classes.BooleanTogglers([
        CONTACT_CARD_SLUG,
        MODAL_DIALOG_SLUG,
        CONTACT_EDIT_FORM_SLUG,
      ]),
    };
    this.handleAfterConfirming = null;
    this.checkedItemsCounter = 0;

    // this.filterBirthsToday = this.filterBirthsToday.bind(this);
    this.rmContact = this.rmContact.bind(this);
    this.openForm = this.openForm.bind(this);
    this.closeForm = this.closeForm.bind(this);
    this.openConfirmDialog = this.openConfirmDialog.bind(this);
    this.closeConfirmDialog = this.closeConfirmDialog.bind(this);
    this.openContactCard = this.openContactCard.bind(this);
    this.closeContactCard = this.closeContactCard.bind(this);
    this.changeContactIndex = this.changeContactIndex.bind(this);
    this.dismissCurrentPopup = this.dismissCurrentPopup.bind(this);
  }

  static get propTypes () {
    return {
      // props from redux store provider:
      dispatch: PropTypes.func.isRequired,
      filterState: PropTypes.number.isRequired,
      notiList: PropTypes.arrayOf(PropTypes.object).isRequired,
      // contactIndex: PropTypes.number.isRequired,
      contacts: PropTypes.arrayOf(PropTypes.instanceOf(adbk.classes.Contact)).isRequired,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //     if (nextProps.contacts !== this.props.contacts) {
  //         return true;
  //     }
  //     if (nextProps.filterState !== this.props.filterState) {
  //         return true;
  //     }
  //     return false;
  // }// should extends PureComponent

  componentDidMount () {
    (() => {
      const birthsToday = getListOfBirthsToday(this.props.contacts);
      const prepBirthNoti = (contactsNames) => {
        birthsToday.forEach((contact, idx) => {
          if (idx === 0) {
            return;
          }
          contactsNames += ` & ${contact.name}`;
        });
        return `Today is ${contactsNames}'s birthday!! Wish ${
          birthsToday.length > 1 ? 'them' : 'him/her'
        } a happy birthday!`;
      };

      if (birthsToday.length > 0) {
        let contactsNames = birthsToday[0].name;
        storeActions.showNoti('alert', prepBirthNoti(contactsNames));
      }
    })();

    document.addEventListener('keyup', (e) => {
      e = e || window.event;
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        if (this.state.prevOpenedPopupList.len > 0) {
          this.dismissCurrentPopup(this.state.prevOpenedPopupList.last);
        }
      }
    });

    if (!checkStorageAvailable('localStorage')) {
      storeActions.showNoti('alert', 'Sorry, your browser does NOT support saving your data locally.');
    }
  }

  // filterBirthsToday () {// re-update happy-birthday list
  //     const newData = filterBirthsToday(this.props.contacts);
  //     console.log('filterBirthsToday', newData);
  //     this.boundActions.contacts.replaceAllContacts(newData);
  // }

  rmContact (contactId) {
    const contact = storeActions.findContact(contactId);
    storeActions.asyncRemoveContact(contact).then((res) => {
      if (res.isSuccess) {
        storeActions.showNoti('success', 'Removed!');
      } else {
        storeActions.notifyServerFailed(res.errMsg);
      }
    });
  }

  changeContactIndex (contactId, cb) {
    this.setState({ contactIndex: storeActions.findContactIndex(contactId) }, cb);
  }

  dismissCurrentPopup (popupName, contactId) {
    switch (popupName) {
    case CONTACT_CARD_SLUG:
      this.closeContactCard(contactId);
      break;
    case CONTACT_EDIT_FORM_SLUG:
      this.closeForm(contactId);
      break;
    case MODAL_DIALOG_SLUG:
      this.closeConfirmDialog();
      break;
    default:
      break;
    }
  }

  openContactCard (contactId) {
    this.setState(
      (prevState, prevProps) => {
        return {
          contactIndex: storeActions.findContactIndex(contactId),
          openingContactId: contactId,
          // isShowCC: true,
          prevOpenedPopupList: prevState.prevOpenedPopupList.push(CONTACT_CARD_SLUG),
          popupTogglersManager: prevState.popupTogglersManager.toggleOn(CONTACT_CARD_SLUG),
        };
      },
      () => {
        preventBodyElemScrolling();
      }
    );
  }

  closeContactCard (contactId) {
    this.setState(
      (prevState, prevProps) => {
        const newState = {
          // isShowCC: false,
          // openingContactId: null,
        };

        if (prevState.prevOpenedPopupList.last === CONTACT_CARD_SLUG) {
          newState.prevOpenedPopupList = prevState.prevOpenedPopupList.pull();
        }
        if (prevState.prevOpenedPopupList.len > 0) {
          newState.popupTogglersManager = prevState.popupTogglersManager.toggleOn(prevState.prevOpenedPopupList.last);
        } else {
          newState.openingContactId = null;
          newState.popupTogglersManager = prevState.popupTogglersManager.toggleOff(CONTACT_CARD_SLUG);
        }
        if (contactId) {
          newState.contactIndex = storeActions.findContactIndex(contactId);
        }
        return newState;
      },
      () => {
        if (this.state.prevOpenedPopupList.len === 0) {
          setBodyElemScrollable();
        }
      }
    );
  }

  openForm (contactId = null) {
    let contactIndex;
    if (typeof contactId === 'string') {
      contactIndex = storeActions.findContactIndex(contactId);
    }

    this.setState(
      (prevState, prevProps) => {
        const newState = {
          contactIndex,
          openingContactId: contactId,
          // isShowForm: true,
          prevOpenedPopupList: prevState.prevOpenedPopupList.push(CONTACT_EDIT_FORM_SLUG),
          popupTogglersManager: prevState.popupTogglersManager.toggleOn(CONTACT_EDIT_FORM_SLUG),
        };
        return newState;
      },
      () => {
        preventBodyElemScrolling();
      }
    );
  }

  closeForm (contactId) {
    const contactIndex = storeActions.findContactIndex(contactId);
    this.setState(
      (prevState, prevProps) => {
        const newState = {
          // isShowForm: false,
        };
        if (typeof contactId === 'string') {
          newState.contactIndex = contactIndex;
        }
        if (prevState.prevOpenedPopupList.last === CONTACT_EDIT_FORM_SLUG) {
          newState.prevOpenedPopupList = prevState.prevOpenedPopupList.pull();
        }
        if (prevState.prevOpenedPopupList.len > 0) {
          newState.popupTogglersManager = prevState.popupTogglersManager.toggleOn(prevState.prevOpenedPopupList.last);
        } else {
          newState.openingContactId = null;
          newState.popupTogglersManager = prevState.popupTogglersManager.toggleOff(CONTACT_EDIT_FORM_SLUG);
        }
        return newState;
      },
      () => {
        if (this.state.prevOpenedPopupList.len === 0) {
          setBodyElemScrollable();
        }
      }
    );
  }

  openConfirmDialog (content, cb) {
    if (!cb) {
      throw new Error('Callback is not provided! Check openConfirmDialog method in App.js');
    }
    this.handleAfterConfirming = cb;
    this.setState(
      (prevState, prevProps) => {
        return {
          // isConfirming: true,
          prevOpenedPopupList: prevState.prevOpenedPopupList.push(MODAL_DIALOG_SLUG),
          popupTogglersManager: prevState.popupTogglersManager.toggleOn(MODAL_DIALOG_SLUG),
        };
      },
      () => {
        preventBodyElemScrolling();
      }
    );
  }

  closeConfirmDialog (response) {
    // if (this.state.popupTogglersManager.activatedToggler === MODAL_DIALOG_SLUG) {
    this.setState(
      (prevState, prevProps) => {
        const newState = {
          // isConfirming: false,
        };
        if (prevState.prevOpenedPopupList.last === MODAL_DIALOG_SLUG) {
          newState.prevOpenedPopupList = prevState.prevOpenedPopupList.pull();
        }
        if (prevState.prevOpenedPopupList.len > 0) {
          newState.popupTogglersManager = prevState.popupTogglersManager.toggleOn(prevState.prevOpenedPopupList.last);
        } else {
          newState.openingContactId = null;
          newState.popupTogglersManager = prevState.popupTogglersManager.toggleOff(MODAL_DIALOG_SLUG);
        }
        return newState;
      },
      () => {
        if (typeof this.handleAfterConfirming === 'function') {
          this.handleAfterConfirming(response);
          this.handleAfterConfirming = null;
        }
        if (this.state.prevOpenedPopupList.len === 0) {
          setBodyElemScrollable();
        }
      }
    );
    // }
  }

  render () {
    const notifications = this.props.notiList.map(({ type, msg, displayTimeDuration, id }) => (
      <NotiBar displayTimeDuration={displayTimeDuration} type={type} msg={msg} key={id} />
    ));
    let elemInPopup;
    const activatedToggler = this.state.popupTogglersManager.activatedToggler;

    this.checkedItemsCounter = this.props.contacts.filter((contact) => contact.isMarked).length;

    if (activatedToggler) {
      switch (activatedToggler) {
      case CONTACT_CARD_SLUG:
        elemInPopup = (
          <React.Suspense fallback={<LoadingPopup handleClose={this.closeContactCard} />}>
            <ContactCard
              contact={this.props.contacts[this.state.contactIndex]}
              contactIndex={this.state.contactIndex}
              onClose={this.closeContactCard}
              onEditContact={this.openForm}
              openModalDialog={this.openConfirmDialog}
              onRemoveContact={this.rmContact}
            />
          </React.Suspense>
        );
        break;
      case CONTACT_EDIT_FORM_SLUG:
        elemInPopup = (
          <WorkingForm
            isEditing={this.state.contactIndex > -1}
            contactId={this.state.openingContactId}
            // contact={this.state.contactIndex > -1 ? this.props.contacts[this.state.contactIndex] : adbk.classes.Contact.fromScratch()}
            closeForm={this.closeForm}
            changeContactIndex={this.changeContactIndex}
          />
        );
        break;
      case MODAL_DIALOG_SLUG:
        elemInPopup = <ConfirmDialog closeModalDialog={this.closeConfirmDialog} {...this.state.dialogContent} />;
        break;
      default:
        console.error(`Uncatched ${activatedToggler}`);
        break;
      }
    }

    return (
      <>
        <MainContent
          contacts={this.props.contacts}
          filterState={this.props.filterState}
          totalContactsAmount={this.props.contacts.length}
          openContactCard={this.openContactCard}
          rmItem={this.rmContact}
          openModalDialog={this.openConfirmDialog}
          openForm={this.openForm}
          toggleMarkedItem={storeActions.toggleMarkedItem}
        />
        {notifications}
        <MainNav
          totalContactsAmount={this.props.contacts.length}
          openForm={this.openForm}
          showNoti={storeActions.showNoti}
          openConfirmDialog={this.openConfirmDialog}
          numOfCheckedItems={this.checkedItemsCounter}
        />
        {activatedToggler !== undefined && elemInPopup}
      </>
    );
  }
}

const mapStateToProps = (state) => ({ ...state });

export default connect(mapStateToProps)(App);
