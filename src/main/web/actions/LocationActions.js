import {Actions} from 'react-native-router-flux';
import {SENDING_LOCATION, LOCATION_SENT} from './types';

const config = require('../config');

export const sendNewLocation = (lat, lon, user, thisRef, callback) => {
  return dispatch => {
    dispatch({type: SENDING_LOCATION});
    fetch(config.backendURL + '/user/update_location', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lon,
        token: user,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          callback(true, thisRef);
          dispatch({type: LOCATION_SENT});
        } else {
          callback(false, thisRef);
          dispatch({type: LOCATION_SENT});
        }
      })
      .catch(error => {
        callback(false, thisRef);
        dispatch({type: LOCATION_SENT});
      });
  };
};
