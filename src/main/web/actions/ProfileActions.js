import {Actions} from 'react-native-router-flux';
import {
  PROFILE_DATA_FETCH,
  PROFILE_DATA_FETCH_SUCCESS,
  PROFILE_DATA_FETCH_FAIL,
  SAVE_PROFILE_CHANGES,
  SAVE_PROFILE_CHANGES_DONE,
} from './types';

const config = require('../config');

// import RNFetchBlob from 'react-native-fetch-blob'

export const profileFetch = token => {
  return dispatch => {
    dispatch({type: PROFILE_DATA_FETCH});

    fetch(config.backendURL + '/user/data', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'ProfileActions > profileFetch: ' + JSON.stringify({responseJson}),
        );
        if (responseJson.success) {
          console.warn(
            'ProfileActions > profileFetch: SUCCESS: ' +
              responseJson.user.notificationCount,
          );
          dispatch({
            type: PROFILE_DATA_FETCH_SUCCESS,
            payload: responseJson.user,
          });
        } else {
          dispatch({type: PROFILE_DATA_FETCH_FAIL});
        }
      })
      .catch(error => {
        console.warn(error);
        dispatch({type: PROFILE_DATA_FETCH_FAIL});
      });
  };
};

export const saveProfileChanges = (token, data, callback, ref) => {
  return dispatch => {
    dispatch({type: SAVE_PROFILE_CHANGES});

    fetch(config.backendURL + '/user/account/update_profile', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.warn('saveprofilechang: ' + JSON.stringify(data));
          if (callback) {
            callback(true, ref);
          }
          dispatch({type: SAVE_PROFILE_CHANGES_DONE, payload: data});
        } else {
          if (callback) {
            callback(false, ref);
          }
          dispatch({type: SAVE_PROFILE_CHANGES_DONE});
        }
      })
      .catch(error => {
        if (callback) {
          callback(false, ref);
        }
        dispatch({type: SAVE_PROFILE_CHANGES_DONE});
      });
  };
};

export const saveMoodChanges = (
  token,
  photoURL,
  profileFetch_,
  callback,
  ref,
) => {
  return dispatch => {
    //dispatch({ type: SAVE_MOOD_CHANGES });

    fetch(config.backendURL + '/user/account/update_mood', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        photoURL: photoURL,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          if (callback) {
            callback(true, token, profileFetch_, ref);
          }
          //dispatch({ type: SAVE_MOOD_CHANGES_DONE, payload: data });
        } else {
          if (callback) {
            callback(false);
          }
          // dispatch({ type: SAVE_MOOD_CHANGES_DONE });
        }
      })
      .catch(error => {
        console.warn('fetch error: ' + error);
        if (callback) {
          callback(false);
        }
        // dispatch({ type: SAVE_MOOD_CHANGES_DONE });
      });
  };
};
