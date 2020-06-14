import {
  NAME_CHANGED,
  PHONE_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER,
  LOGOUT_USER,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAIL,
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAIL,
  PHONE_VERIFICATION,
  PHONE_VERIFICATION_FAIL,
  PHONE_VERIFICATION_SUCCESS,
  REPLACE_TOKEN,
  RECOVER_PASSWORD_SUCCESS,
  RECOVER_PASSWORD_FAIL,
  RECOVER_PASSWORD,
  VALID_TOKEN,
  VALID_TOKEN_DONE,
  ON_SEND_MESSAGE,
  CHATS_FETCH_SUCCESS,
} from '../actions/types';

const PHONE_STATE = {
  phone: '',
  countryCode: '',
};

const INITIAL_STATE = {
  name: '',
  password: '',
  category: '',
  gender: '',
  user: null,
  error: '',
  loading: false,
  verifyingPhoneNumber: false,
  phoneVerificationCodeSending: false,
  recoveringPassword: false,
  validToken: false,
  validatingToken: true,
  recoverSuccess: false,
  conversations: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case NAME_CHANGED:
      return {...state, name: action.payload};
    case PHONE_CHANGED:
      console.warn(action.payload.countryCode);
      return {
        ...state,
        phone: action.payload.phone,
        countryCode: action.payload.countryCode,
      };
    case PASSWORD_CHANGED:
      return {...state, password: action.payload};
    case LOGIN_USER:
      return {...state, loading: true, error: ''};
    case LOGOUT_USER:
      return {...state, ...INITIAL_STATE, ...PHONE_STATE};
    case LOGIN_USER_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        ...PHONE_STATE,
        user: action.payload,
        validToken: true,
      };
    case REPLACE_TOKEN:
      return {...state, user: action.payload};
    case LOGIN_USER_FAIL:
      return {...state, password: '', loading: false, validToken: false};
    case REGISTER_USER:
      return {...state, loading: true, error: ''};
    case REGISTER_USER_SUCCESS:
      return {...state, ...INITIAL_STATE, user: action.payload};
    case REGISTER_USER_FAIL:
      return {
        ...state,
        error: 'Authentication Failed.',
        password: '',
        loading: false,
        validToken: true,
      };

    case FORGOT_PASSWORD:
      return {...state, phoneVerificationCodeSending: true};
    case FORGOT_PASSWORD_SUCCESS:
      return {...state, phoneVerificationCodeSending: false};
    case FORGOT_PASSWORD_FAIL:
      return {...state, phoneVerificationCodeSending: false};

    case PHONE_VERIFICATION:
      return {...state, verifyingPhoneNumber: true};
    case PHONE_VERIFICATION_SUCCESS:
      return {
        ...state,
        ...INITIAL_STATE,
        ...PHONE_STATE,
        user: action.payload,
        validToken: true,
      };
    case PHONE_VERIFICATION_FAIL:
      return {
        ...state,
        error: 'Phone Verification Failed.',
        verifyingPhoneNumber: false,
        validToken: false,
      };

    case RECOVER_PASSWORD:
      return {
        ...state,
        recoveringPassword: true,
        validToken: false,
        recoverSuccess: false,
      };
    case RECOVER_PASSWORD_SUCCESS:
      return {
        ...state,
        recoveringPassword: false,
        user: action.payload,
        validToken: true,
        recoverSuccess: true,
      };
    case RECOVER_PASSWORD_FAIL:
      return {
        ...state,
        recoveringPassword: false,
        validToken: false,
        recoverSuccess: false,
      };

    case VALID_TOKEN:
      return {...state, validatingToken: true, validToken: false};
    case VALID_TOKEN_DONE:
      return {
        ...state,
        validatingToken: action.payload,
        validToken: action.payload,
      };

    case ON_SEND_MESSAGE:
      if (state.conversations[action.conversationId]) {
        return {
          ...state,
          conversations: {
            ...state.conversations,
            [action.conversationId]: [
              ...state.conversations[action.conversationId],
              action.message,
            ],
          },
        };
      } else {
        return {
          ...state,
          conversations: {
            ...state.conversations,
            [action.conversationId]: [action.message],
          },
        };
      }
    case CHATS_FETCH_SUCCESS:
      var s = {
        ...state,
        conversations: action.payload,
      };

      //console.warn(JSON.stringify(action.payload));
      //console.warn(JSON.stringify(s.conversations));

      return s;

    default:
      return state;
  }
};
