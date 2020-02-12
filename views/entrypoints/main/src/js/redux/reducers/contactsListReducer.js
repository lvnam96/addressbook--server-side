import * as ActionTypes from '../actions/actionTypes/contactsListActionTypes';
import Contact from '../../models/Contact';

const initialState = [];
const contactsListReducer = (state = initialState, action) => {
  let index;

  switch (action.type) {
  case ActionTypes.ADD:
    return [...state, new Contact(action.contact)];
  case ActionTypes.EDIT:
    // index = find(action.contact.id, state);
    index = state.findIndex((contact) => contact.id === action.contact.id);
    if (index === -1) {
      throw new Error("Cannot find contact's index");
    }
    return [...state.slice(0, index), new Contact(action.contact), ...state.slice(index + 1)];
  case ActionTypes.MARK:
    index = state.findIndex((contact) => contact.id === action.contact.id);
    if (index === -1) {
      throw new Error("Cannot find contact's index");
    }
    return [
      ...state.slice(0, index),
      new Contact({
        ...action.contact,
        isMarked: true,
      }),
      ...state.slice(index + 1),
    ];
  case ActionTypes.MARK_ALL:
    return state.map((contact) => {
      return new Contact({
        ...contact,
        isMarked: true,
      });
    });
  case ActionTypes.UNMARK_ALL:
    return state.map((contact) => {
      return new Contact({
        ...contact,
        isMarked: false,
      });
    });
  case ActionTypes.UNMARK:
    index = state.findIndex((contact) => contact.id === action.contact.id);
    if (index === -1) {
      throw new Error("Cannot find contact's index");
    }
    return [
      ...state.slice(0, index),
      new Contact({
        ...action.contact,
        isMarked: false,
      }),
      ...state.slice(index + 1),
    ];
  case ActionTypes.TOGGLE_MARKER:
    index = state.findIndex((contact) => contact.id === action.contact.id);
    if (index === -1) {
      throw new Error("Cannot find contact's index");
    }
    return [
      ...state.slice(0, index),
      new Contact({
        ...action.contact,
        isMarked: !action.contact.isMarked,
      }),
      ...state.slice(index + 1),
    ];
  case ActionTypes.REMOVE:
    index = state.findIndex((contact) => contact.id === action.id);
    return [...state.slice(0, index), ...state.slice(index + 1)];
  case ActionTypes.MULTI_REMOVE:
    return [...state.filter((contact) => !contact.isMarked)];
  case ActionTypes.REMOVE_ALL:
    return [];
  case ActionTypes.REPLACE_ALL:
    return [...action.data];
  default:
    return state;
  }
};

export default contactsListReducer;
