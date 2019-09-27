import {Actions} from 'react-native-router-flux';
import {NOTIFICATIONS_FETCH_SUCCESS, FRIENDS_FETCH_SUCCESS} from './types';

const config = require('../config');

export const readNotification = (token, notificationID) => {
  return dispatch => {
    fetch(config.backendURL + '/user/read_notification', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        notificationID: notificationID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
        } else {
        }
      })
      .catch(error => {});
  };
};

export const updateNotificationId = token => {
  return dispatch => {
    fetch(config.backendURL + '/user/account/update_notification_id', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        playerID: global.notificationPlayerId,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
        } else {
        }
      })
      .catch(error => {});
  };
};

export const notificationsFetch = ({user}, notificationsRef, callback) => {
  return dispatch => {
    fetch(config.backendURL + '/user/notifications', {
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
          callback(true, notificationsRef);
          dispatch({
            type: NOTIFICATIONS_FETCH_SUCCESS,
            payload: responseJson.notifications,
          });
        } else {
          callback(false, notificationsRef);
        }
        // else
        // loginUserFail(dispatch);
      })
      .catch(error => {
        callback(false, notificationsRef);
        console.warn(error);
        // loginUserFail(dispatch);
      });
  };
};

export const friendsFetch = ({user}, friendsRef, callback) => {
  return dispatch => {
    fetch(config.backendURL + '/user/friends', {
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
          callback(true, friendsRef);
          dispatch({
            type: FRIENDS_FETCH_SUCCESS,
            payload: responseJson.friends,
          });
        } else {
          callback(false, friendsRef);
        }
        // else
        // loginUserFail(dispatch);
      })
      .catch(error => {
        callback(false, friendsRef);
        console.warn(error);
        // loginUserFail(dispatch);
      });
  };
};
