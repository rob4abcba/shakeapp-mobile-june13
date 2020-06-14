import {Actions} from 'react-native-router-flux';
import {
  // Nearby users
  NEARBY_FETCH_SUCCESS,
  NEARBY_FETCH_DETAIL_SUCCESS,
  NEARBY_DETAIL_CLEAR,
  // Nearby restaurants
  NEARBY_RESTAURANTS_FETCH_SUCCESS,
  SENDING_SHAKE,
  SHAKE_SUCCESS,
  REPORT_CONTENT,
  REPORT_CONTENT_SUCCESS,
} from './types';

const config = require('../config');

// import RNFetchBlob from 'react-native-fetch-blob'

export const nearbyDetailClear = () => {
  return dispatch => {
    dispatch({type: NEARBY_DETAIL_CLEAR, payload: null});
  };
};

export const nearbyUsersFetch = ({user}, nearbyRef, callback) => {
  return dispatch => {
    fetch(config.backendURL + '/user/nearby_users', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: user,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.log(JSON.stringify(responseJson));
          callback(true, nearbyRef);
          dispatch({type: NEARBY_FETCH_SUCCESS, payload: responseJson.users});
        } else {
          callback(false, nearbyRef);
        }
        // else
        // loginUserFail(dispatch);
      })
      .catch(error => {
        callback(false, nearbyRef);
        console.warn(error);
        // loginUserFail(dispatch);
      });
  };
};

export const nearbyRestaurantsFetch = ({user}, nearbyRef, callback) => {
  return dispatch => {
    fetch(config.backendURL + '/user/nearby_restaurants', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: user,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          callback(true, nearbyRef);
          dispatch({
            type: NEARBY_RESTAURANTS_FETCH_SUCCESS,
            payload: responseJson.result.restaurants,
          });
        } else {
          callback(false, nearbyRef);
        }
        // else
        // loginUserFail(dispatch);
      })
      .catch(error => {
        callback(false, nearbyRef);
        console.warn(error);
        // loginUserFail(dispatch);
      });
  };
};

export const sendShake = (
  accept,
  token,
  userID,
  thisRef,
  callback,
  restaurantID,
) => {
  var call = config.backendURL + '/user/shake';
  if (accept) {
    call = config.backendURL + '/user/shake_action';
  }

  return dispatch => {
    console.log('NearbyActions > sendShake() > userID: ' + userID);
    dispatch({type: SENDING_SHAKE});

    fetch(call, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        userID: userID,
        action: accept ? 'accept' : undefined,
        restaurantID: restaurantID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('SENDING_SHAKE: ' + JSON.stringify(responseJson));

        if (responseJson.success) {
          callback(true, thisRef);
          dispatch({type: SHAKE_SUCCESS});
        } else {
          callback(false, thisRef);
          dispatch({type: SHAKE_SUCCESS});
        }
      })
      .catch(error => {
        callback(false, thisRef);
        console.warn(error);
        dispatch({type: SHAKE_SUCCESS});
      });
  };
};

export const reportAbuseOrContent = (
  token,
  userID,
  thisRef,
  callback,
  description,
) => {
  var call = config.backendURL + '/user/report';

  return dispatch => {
    console.log(
      'NearbyActions > reportAbuseOrContent() > userID: ' +
        userID +
        ':' +
        description,
    );
    dispatch({type: REPORT_CONTENT});

    fetch(call, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        userID: userID,
        description: description,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('REPORT_CONTENT: ' + JSON.stringify(responseJson));

        if (responseJson.success) {
          callback(true, thisRef);
          dispatch({type: REPORT_CONTENT_SUCCESS});
        } else {
          callback(false, thisRef);
          dispatch({type: REPORT_CONTENT_SUCCESS});
        }
      })
      .catch(error => {
        callback(false, thisRef);
        console.warn(error);
        dispatch({type: REPORT_CONTENT_SUCCESS});
      });
  };
};
