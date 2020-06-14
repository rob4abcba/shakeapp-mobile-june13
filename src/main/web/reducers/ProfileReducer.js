import {
  PROFILE_DATA_FETCH,
  PROFILE_DATA_FETCH_SUCCESS,
  PROFILE_DATA_FETCH_FAIL,
  SAVE_PROFILE_CHANGES,
  SAVE_PROFILE_CHANGES_DONE,
  CHANGE_PASSWORD,
  CHANGE_PASSWORD_DONE,
} from '../actions/types';

const INITIAL_STATE = {
  isFetchingProfileData: false,
  data: null,
  // savingProfileChanges: false,
  // changingPassword: false
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_DATA_FETCH:
      return {...state, isFetchingProfileData: true};

    case PROFILE_DATA_FETCH_SUCCESS:
      return {
        ...state,
        isFetchingProfileData: false,
        data: action.payload,
      };

    case PROFILE_DATA_FETCH_FAIL:
      return {...state, isFetchingProfileData: false};

    case SAVE_PROFILE_CHANGES:
      return {...state, savingProfileChanges: true};

    case SAVE_PROFILE_CHANGES_DONE:
      return {
        ...state,
        data: action.payload,
        savingProfileChanges: false,
      };

    case CHANGE_PASSWORD:
      return {...state, changingPassword: true};

    case CHANGE_PASSWORD_DONE:
      return {...state, changingPassword: false};

    default:
      return state;
  }
};
