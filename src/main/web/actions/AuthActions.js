import { Actions } from 'react-native-router-flux';
import {
  NAME_CHANGED,
  PHONE_CHANGED,
  PASSWORD_CHANGED,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  PHONE_VERIFICATION,
  PHONE_VERIFICATION_SUCCESS,
  PHONE_VERIFICATION_FAIL,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  REPLACE_TOKEN,
  RECOVER_PASSWORD_SUCCESS,
  RECOVER_PASSWORD_FAIL,
  RECOVER_PASSWORD,
  VALID_TOKEN,
  VALID_TOKEN_DONE,
  ON_SEND_MESSAGE,
  CHATS_FETCH_SUCCESS,
  BLOCK_SHAKE,
  BLOCK_SHAKE_SUCCESS,
} from './types';

const config = require('../config');

export const nameChanged = text => {
  return {
    type: NAME_CHANGED,
    payload: text,
  };
};

export const phoneChanged = (text, countryCode) => {
  console.warn(countryCode);
  return {
    type: PHONE_CHANGED,
    payload: { phone: text, countryCode: countryCode },
  };
};

export const passwordChanged = text => {
  return {
    type: PASSWORD_CHANGED,
    payload: text,
  };
};

export const forgotPassword = (phone, thisRef, callback) => {
  return dispatch => {
    dispatch({ type: FORGOT_PASSWORD });

    fetch(config.backendURL + '/user/account/forgot_password', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        phone: phone,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          callback(true, thisRef);
          dispatch({ type: FORGOT_PASSWORD_SUCCESS });
        } else {
          callback(false, thisRef);
          dispatch({ type: FORGOT_PASSWORD_FAIL });
        }
      })
      .catch(error => {
        callback(false, thisRef);
        dispatch({ type: FORGOT_PASSWORD_FAIL });
      });
  };
};

export const verifyPhoneNumber = (phone, SMSCode, thisRef, callback) => {
  return dispatch => {
    dispatch({ type: PHONE_VERIFICATION });
    fetch(config.backendURL + '/user/register_verify', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        SMSCode,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('verifyPhoneNumber: ' + JSON.stringify(responseJson));

        if (responseJson.success) {
          callback(true, responseJson.token);
          dispatch({
            type: PHONE_VERIFICATION_SUCCESS,
            payload: responseJson.token,
          });
        } else {
          callback(false, '', thisRef);
          dispatch({ type: PHONE_VERIFICATION_FAIL });
        }
      })
      .catch(error => {
        callback(false, '', thisRef);
        dispatch({ type: PHONE_VERIFICATION_FAIL });
      });
  };
};

export const recoverPassword = (phone, SMSCode, thisRef, callback) => {
  return dispatch => {
    dispatch({ type: RECOVER_PASSWORD });
    console.log(
      'AuthActions.js > recoverPassword - BEFORE: ' + phone + SMSCode,
    );

    fetch(config.backendURL + '/user/account/recover', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone,
        SMSCode,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(
          'AuthActions.js > recoverPassword - RESPONSE: ' +
          responseJson.success,
        );

        if (responseJson.success) {
          console.log(
            'AuthActions.js > recoverPassword - ANSWER: ' + responseJson.token,
          );

          callback(true, responseJson.token);
          console.log('AuthActions.js > recoverPassword - ON SUCCESS');
          dispatch({
            type: RECOVER_PASSWORD_SUCCESS,
            payload: responseJson.token,
          });
        } else {
          callback(false, '', thisRef);
          console.log('AuthActions.js > recoverPassword - ON FAIL 1');

          dispatch({ type: RECOVER_PASSWORD_FAIL });
        }
      })
      .catch(error => {
        callback(false, '', thisRef);
        console.log('AuthActions.js > recoverPassword - ON FAIL 2');

        dispatch({ type: RECOVER_PASSWORD_FAIL });
      });
  };
};

export const registerUser = (
  fullName,
  phone,
  countryCode,
  password,
  thisRef,
  gender,
  callback,
) => {
  return dispatch => {
    dispatch({ type: REGISTER_USER });

    fetch(config.backendURL + '/user/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        countryCode: countryCode,
        password: password,
        fullName: fullName,
        phone: phone,
        gender: gender
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          console.warn(JSON.stringify(responseJson))
          dispatch({ type: REGISTER_USER_SUCCESS, payload: responseJson.token });
          callback(true, thisRef);
        } else {
          // callback(false, thisRef);
          dispatch({ type: REGISTER_USER_FAIL });
        }
      })
      .catch(error => {
        console.warn(error);
        // callback(false, thisRef);
        dispatch({ type: REGISTER_USER_FAIL });
      });
  };
};

export const loginUser = (phone, password, thisRef, callback) => {
  return dispatch => {
    dispatch({ type: LOGIN_USER });

    fetch(config.backendURL + '/user/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        password: password,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('LOGIN_USER: ' + JSON.stringify(responseJson));

        if (responseJson.success) {
          callback(true, responseJson.token, thisRef);
          dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: responseJson.token,
          });
        } else {
          callback(false, '', thisRef);
          loginUserFail(dispatch);
        }
      })
      .catch(error => {
        callback(false, '', thisRef);
        console.warn(error);
        loginUserFail(dispatch);
      });
  };
};

export const logoutUser = user => {
  return dispatch => {
    dispatch({ type: LOGOUT_USER });
  };
};

const loginUserFail = dispatch => {
  dispatch({ type: LOGIN_USER_FAIL });
};

export const loginUserSuccess = user => {
  return dispatch => {
    dispatch({
      type: LOGIN_USER_SUCCESS,
      payload: user,
    });
  };
};

export const replaceToken = user => {
  return dispatch => {
    dispatch({
      type: REPLACE_TOKEN,
      payload: user,
    });
  };
};

export const changePassword = (
  token,
  password,
  newPassword,
  thisRef,
  callback,
) => {
  return dispatch => {
    fetch(config.backendURL + '/user/account/change_password', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: token,
      },
      body: JSON.stringify({
        oldPassword: password,
        password: newPassword,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('ESTOU NA CHANGEPASSWORD: ' + JSON.stringify(responseJson));
        if (responseJson.success) {
          console.log(
            'ESTOU NA CHANGEPASSWORD SUCCESS: ' + JSON.stringify(responseJson),
          );

          callback(true, thisRef);
          dispatch({
            type: PHONE_VERIFICATION_SUCCESS,
            payload: responseJson.token,
          });
        } else {
          console.log(
            'ESTOU NA CHANGEPASSWORD FALSE 1: ' + JSON.stringify(responseJson),
          );

          callback(false, thisRef);
          dispatch({ type: PHONE_VERIFICATION_FAIL });
        }
      })
      .catch(error => {
        console.log(
          'ESTOU NA CHANGEPASSWORD FALSE 2: ' + JSON.stringify(responseJson),
        );

        callback(false, thisRef);
        dispatch({ type: PHONE_VERIFICATION_FAIL });
      });
  };
};

export const checkValidToken = (token, callback) => {
  return dispatch => {
    dispatch({ type: VALID_TOKEN });

    console.log('checking if token is valid...');
    fetch(config.backendURL + '/user/valid_token', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: token,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('valid token response: ' + JSON.stringify(responseJson));
        if (responseJson.success) {
          if (callback) {
            callback(true);
          }
          dispatch({ type: VALID_TOKEN_DONE, payload: true });
        } else {
          if (callback) {
            callback(false);
          }
          dispatch({ type: VALID_TOKEN_DONE, payload: false });
        }
      })
      .catch(error => {
        if (callback) {
          callback(false);
        }
        dispatch({ type: VALID_TOKEN_DONE, payload: true });
      });
  };
};

export const onSendMessage = (conversationId, message) => {
  return dispatch => {
    dispatch({
      type: ON_SEND_MESSAGE,
      conversationId,
      message,
    });
  };
};

export const onBlockShake = (token, phone, friendID, thisRef, callback) => {
  var call = config.backendURL + '/user/friend/block';

  return dispatch => {
    console.log('AuthActions > onBlockShake() > phone: ' + phone);
    dispatch({ type: BLOCK_SHAKE });

    fetch(call, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: token,
        phone: phone,
        friendID: friendID,
      }),
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log('Block Shake: ' + JSON.stringify(responseJson));

        if (responseJson.success) {
          callback(true, thisRef);
          dispatch({ type: BLOCK_SHAKE_SUCCESS });
        } else {
          callback(false, thisRef);
          dispatch({ type: BLOCK_SHAKE_SUCCESS });
        }
      })
      .catch(error => {
        callback(false, thisRef);
        console.warn(error);
        dispatch({ type: BLOCK_SHAKE_SUCCESS });
      });
  };
};

export const chatsFetch = ({ user }) => {
  return dispatch => {
    fetch(config.backendURL + '/user/chats', {
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
          dispatch({ type: CHATS_FETCH_SUCCESS, payload: responseJson.chats });
        }
        // else
        // loginUserFail(dispatch);
      })
      .catch(error => {
        console.warn(error);
        // loginUserFail(dispatch);
      });
  };
};
