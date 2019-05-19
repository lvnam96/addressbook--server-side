import { combineReducers } from 'redux';
import contacts from './contactsListReducer';
import filterState from './filterStateReducer';
import notiList from './notiListReducer';

export default combineReducers({
  notiList,
  contacts,
  filterState,
});
