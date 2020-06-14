import {
  // Nearby users
  NEARBY_FETCH_SUCCESS,
  NEARBY_FETCH_DETAIL_SUCCESS,
  NEARBY_DETAIL_CLEAR,
  // Nearby restaurants
  NEARBY_RESTAURANTS_FETCH_SUCCESS,
  SENDING_SHAKE,
  SHAKE_SUCCESS,
} from '../actions/types';

const INITIAL_STATE = {
  nearbyList: null,
  nearbyDetail: null,
  nearbyRestaurantList: null,
  shaking: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NEARBY_FETCH_SUCCESS:
      return {...state, nearbyList: action.payload};
    case NEARBY_FETCH_DETAIL_SUCCESS:
      return {...state, nearbyDetail: action.payload};
    case NEARBY_DETAIL_CLEAR:
      return {...state, nearbyDetail: null};
    case NEARBY_RESTAURANTS_FETCH_SUCCESS:
      return {...state, nearbyRestaurantList: action.payload};
    case SENDING_SHAKE:
      return {...state, shaking: true};
    case SHAKE_SUCCESS:
      return {...state, shaking: false};
    default:
      return state;
  }
};
