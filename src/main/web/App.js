import React, {Component} from 'react';
import {Provider} from 'react-redux';
// org.reactjs.native.example.newshake

import {createStore, applyMiddleware, compose} from 'redux';
import ReduxThunk from 'redux-thunk';
import rootReducer from './reducers';
import Router from './Router';
import {Actions} from 'react-native-router-flux';
import {AsyncStorage, View, ActivityIndicator} from 'react-native';
import {
  persistStore,
  persistCombineReducers,
  persistReducer,
} from 'redux-persist';
import storage from '@react-native-community/async-storage'; // or whatever storage you are using
import {PersistGate} from 'redux-persist/integration/react';
import OneSignal from 'react-native-onesignal';
import Loading from './Loading.js';
import {StyleSheet, Text} from 'react-native';
import {Platform} from 'react-native';

// One plus font fix
const styles = StyleSheet.create({
  defaultFontFamily: {
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
});
const oldRender = Text.render;
Text.render = function(...args) {
  const origin = oldRender.call(this, ...args);
  return React.cloneElement(origin, {
    style: [styles.defaultFontFamily, origin.props.style],
  });
};

const config = {
  key: 'primary',
  storage: storage,
  blacklist: ['posts', 'token'],
};

const persistedReducer = persistReducer(config, rootReducer);

const store = createStore(
  persistedReducer,
  compose(applyMiddleware(ReduxThunk)),
);

// --> Redux Persist
const persistor = persistStore(store, () => {
  this.setState({rehydrated: true});
});

export default class App extends Component {
  componentWillMount() {
    //Intercept react-native error handling
    this.defaultHandler = ErrorUtils.getGlobalHandler();
    ErrorUtils.setGlobalHandler(this.wrapGlobalHandler.bind(this));

    // --> One Signal

    
    OneSignal.init("ff61a010-ba89-4f27-84d8-6c9110499799");
    OneSignal.addEventListener('received', this.onReceived);

    OneSignal.addEventListener('opened', this.onOpened);
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.inFocusDisplaying(2);
  }

  onReceived(notification) {
    console.log('Notification received', notification);
  }


  onIds(device) {
    global.notificationPlayerId = device.userId;
    console.log('App.js > device.ID: ' + device.userId);
  }

  onOpened(openResult) {
    console.warn('App.js > onOpened()');

    if (Actions.myActivity) {
      Actions.myActivity({route: 0});
    } else {
      global.notificationReceived = true;
    }

    // if (openResult.notification.payload.additionalData.goToScreen == 'pending') {
    //   Actions.posts();
    // }
  }

  async wrapGlobalHandler(error, isFatal) {
    // If the error kills our app in Release mode, make sure we don't rehydrate
    // with an invalid Redux state and cleanly go back to login page instead
    if (isFatal && !__DEV__) {
      AsyncStorage.clear();
    }

    //Once finished, make sure react-native also gets the error
    if (this.defaultHandler) {
      this.defaultHandler(error, isFatal);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Loading />} persistor={persistor}>
          <Router />
        </PersistGate>
      </Provider>
    );
  }
}
