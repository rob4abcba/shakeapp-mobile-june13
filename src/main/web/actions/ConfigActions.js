import {Actions} from 'react-native-router-flux';
import {
  TERMS_AND_CONDITIONS_FETCH,
  FAQ_FETCH,
  HOW_IT_WORKS_FETCH,
  CONFIG_FETCH,
} from './types';

const config = require('../config');

export const tosFetch = () => {
  return dispatch => {
    fetch(config.backendURL + '/tos', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          dispatch({
            type: TERMS_AND_CONDITIONS_FETCH,
            payload: responseJson.html,
          });
        } else {
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };
};

export const faqFetch = () => {
  return dispatch => {
    fetch(config.backendURL + '/faq', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          dispatch({type: FAQ_FETCH, payload: responseJson.html});
        } else {
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };
};

export const howItWorksFetch = () => {
  return dispatch => {
    fetch(config.backendURL + '/how_it_works', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.success) {
          dispatch({type: HOW_IT_WORKS_FETCH, payload: responseJson.html});
        } else {
        }
      })
      .catch(error => {
        console.warn(error);
      });
  };
};

export const configFetch = () => {
  return dispatch => {
    fetch(config.backendURL + '/config', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        dispatch({type: CONFIG_FETCH, payload: responseJson});
      })
      .catch(error => {
        console.warn(error);
      });
  };
};
