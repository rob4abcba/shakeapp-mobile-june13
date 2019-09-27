import {SENDING_LOCATION, LOCATION_SENT} from '../actions/types';

const INITIAL_STATE = {
  sendingLocation: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SENDING_LOCATION:
      return {...state, sendingLocation: true};
    case LOCATION_SENT:
      return {...state, sendingLocation: false};
    default:
      return state;
  }
};
