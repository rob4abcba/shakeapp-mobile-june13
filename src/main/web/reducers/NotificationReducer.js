import {
  NOTIFICATIONS_FETCH_SUCCESS,
  FRIENDS_FETCH_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  notificationsList: null,
  friendsList: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NOTIFICATIONS_FETCH_SUCCESS:
      return {...state, notificationsList: action.payload};
    case FRIENDS_FETCH_SUCCESS:
      return {...state, friendsList: action.payload};
    default:
      return state;
  }
};
