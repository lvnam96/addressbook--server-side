import { combineReducers } from 'redux';
import user from './userReducer';
import confirm from './confirmationReducer';
import cbooks from './cbooksReducer';
import contacts from './contactsListReducer';
import filterState from './filterStateReducer';
import notiList from './notiListReducer';
import { connectRouter } from 'connected-react-router';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    user,
    confirm,
    cbooks,
    notiList,
    contacts,
    filterState,
  });
