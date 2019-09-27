import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
// import SocialAccountsReducer from './SocialAccountsReducer';
// import PostReducer from './PostReducer';
import NearbyReducer from './NearbyReducer';
import LocationReducer from './LocationReducer';
import NotificationReducer from './NotificationReducer';

import ProfileReducer from './ProfileReducer';
// import BillingReducer from './BillingReducer';
// import BalanceReducer from './BalanceReducer';
// import ConfigReducer from './ConfigReducer';
// import NotificationReducer from './NotificationReducer';
//
//
//

const rootReducer = combineReducers({
  auth: AuthReducer,
  //   socialAccounts: SocialAccountsReducer,
  nearby: NearbyReducer,
  location: LocationReducer,
  notification: NotificationReducer,
  //   posts: PostReducer,
  profile: ProfileReducer,
  //   billing: BillingReducer,
  //   balance: BalanceReducer,
  //   config: ConfigReducer,
  //   notification: NotificationReducer
});

export default rootReducer;
