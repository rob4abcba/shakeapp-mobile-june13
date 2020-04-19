/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import {
  nearbyUsersFetch,
  nearbyRestaurantsFetch,
  profileFetch,
  sendNewLocation,
  updateNotificationId,
} from '../actions';
import {Spinner, Footer} from './common';
import {Actions} from 'react-native-router-flux';
import NearbyUser from './NearbyUser';
import UserSwiper from './UserSwiper';
import UserSwiper2 from './UserSwiper2';
//import UserSwiper5 from './UserSwiper5';
import UserSwiper55 from './UserSwiper55';
import NearbyRestaurant from './NearbyRestaurant';
import {Icon, Badge} from 'react-native-elements';
import Preferences from './Preferences';
// import Mood from './Mood';
import Mood from './Mood2';
// import Mood from './Mood_RNCamera';
import GridView from 'react-native-super-grid';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Modal from 'react-native-modal';
import Permissions from 'react-native-permissions';
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';
var styles = require('../Styles');

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

class Nearby extends Component {
  state = {
    data: [],
    // Modal Error
    isVisible: false,
    modalTitle: '',
    modalButton: '',
    modalDescription: '',
    modalSecondaryButton: '',

    preferencesFirstSetup: true,
    moodFirstSetup: true,
  };

  componentWillUnmount() {
    // unregister all event listeners
    BackgroundGeolocation.events.forEach(event =>
      BackgroundGeolocation.removeAllListeners(event),
    );
  }

  geoUpdate(position) {
    const {user} = this.props;

    console.warn(
      'REACT NATIVE POSITION ' + JSON.stringify(position) + ' ' + user,
    );

    this.props.sendNewLocation(
      position.coords.latitude,
      position.coords.longitude,
      user,
      this,
      function(success, thisRef) {
        if (success) {
          thisRef.props.profileFetch(user);
          thisRef.props.nearbyUsersFetch({user}, thisRef, function(
            success,
            nearbyRef,
          ) {});
          thisRef.props.nearbyRestaurantsFetch({user}, thisRef, function(
            success,
            nearbyRestaurantRef,
          ) {});
        } else {
          // try again pop up
        }
      },
    );
  }

  onRefreshButton() {
    this.props.profileFetch(this.props.user);
    const {user} = this.props;
    this.props.nearbyUsersFetch({user}, this, function(success, nearbyRef) {});
    this.props.nearbyRestaurantsFetch({user}, this, function(
      success,
      nearbyRestaurantRef,
    ) {});
  }

  componentWillMount() {
    console.log('this.props.nearbyList = ', this.props.nearbyList)
    StatusBar.setHidden(true);
    const {user} = this.props;

    this.props.updateNotificationId(user);

    Permissions.check('location', {type: 'always'}).then(response => {
      if (response !== 'denied') {
        try {
          navigator.geolocation.getCurrentPosition(
            ({coords}) => {
              this.geoUpdate.bind(this);
            },
            (err) => {
              console.log('err = ');
              console.log(err);
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 3000 }
            );
          } catch (e) {
            console.log('e = ');
            console.log(e);  // getCurrentPosition is not a function
          }
        // navigator.geolocation.getCurrentPosition(this.geoUpdate.bind(this));
      }
    });

    Permissions.check('location', {type: 'whenInUse'}).then(response => {
      if (response !== 'denied') {
        try {
        navigator.geolocation.getCurrentPosition(
          ({coords}) => {
            this.geoUpdate.bind(this);
          },
          (err) => {
            console.log('err = ');
            console.log(err);
          },
          { enableHighAccuracy: false, timeout: 20000, maximumAge: 3000 }
          );
        } catch (e) {
          console.log('e = ');
          console.log(e); // getCurrentPosition is not a function
        }
        // navigator.geolocation.getCurrentPosition(this.geoUpdate.bind(this));
      }
    });

    BackgroundGeolocation.configure({
      desiredAccuracy:
        Platform.OS === 'android'
          ? BackgroundGeolocation.LOW_ACCURACY
          : BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 20,
      distanceFilter: 20,
      notificationTitle: 'Background tracking',
      notificationText: 'disabled',
      debug: false, // sound
      startOnBoot: false,
      stopOnTerminate: false,
      maxLocations: 1,
      locationProvider: BackgroundGeolocation.DISTANCE_FILTER_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
      // url: 'https://shakeapp-backend.net/node_app/user/update_location',
      // httpHeaders: {
      // 'Content-Type': 'application/x-www-form-urlencoded'
      // },
      // customize post properties
      // postTemplate: {
      // lat: '@latitude',
      // lon: '@longitude',
      // token: this.props.user // you can also add your own properties
      // }
    });

    BackgroundGeolocation.on('location', location => {
      console.log('[INFO] New location: ', location);
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        this.props.sendNewLocation(
          location.latitude,
          location.longitude,
          this.props.user,
          this,
          function(success, thisRef) {
            if (!thisRef.state.moodFirstSetup) {
              thisRef.props.profileFetch(thisRef.props.user);
              const {user} = thisRef.props;
              thisRef.props.nearbyUsersFetch({user}, thisRef, function(
                success,
                nearbyRef,
              ) {});
              thisRef.props.nearbyRestaurantsFetch({user}, thisRef, function(
                success,
                nearbyRestaurantRef,
              ) {});
            }

            BackgroundGeolocation.endTask(taskKey);
          },
        );
      });
    });

    BackgroundGeolocation.on('stationary', stationaryLocation => {
      // handle stationary locations here
      // Actions.sendLocation(stationaryLocation);

      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        this.props.sendNewLocation(
          stationaryLocation.latitude,
          stationaryLocation.longitude,
          this.props.user,
          function(success) {
            BackgroundGeolocation.endTask(taskKey);
          },
        );
      });
      console.log('WARN STATIONARY LOCATION: ' + stationaryLocation);
    });

    BackgroundGeolocation.on('error', error => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');
    });

    BackgroundGeolocation.on('authorization', status => {
      console.warn(
        '[INFO] BackgroundGeolocation authorization status: ' + status,
      );
      if (status === BackgroundGeolocation.AUTHORIZED) {
        this.setState({isVisible: false});

        // navigator.geolocation.getCurrentPosition(
        console.log("navigatorYZ = " + navigator);  
        if (!navigator.geolocation) 
        {
          this.props.sendNewLocation(
            // RL Add dummy coordinates for SF (37, -122) just in case position.coords.latitude & longitude are invalid.
            // position.coords.latitude || "37.773972",
            // position.coords.longitude || "-122.431297",              
            "39.773972",
            "-129.431297",
            user,
            this,
            function(success, thisRef) {
              if (success) {
                thisRef.props.profileFetch(user);
                thisRef.props.nearbyUsersFetch({user}, thisRef, function(
                  success,
                  nearbyRef,
                ) {});
                thisRef.props.nearbyRestaurantsFetch(
                  {user},
                  thisRef,
                  function(success, nearbyRestaurantRef) {},
                );
              } else {
                // try again pop up
              }
            },
          );
        } else {
        navigator.geolocation.getCurrentPosition(  
          position => {
            console.warn('POSITION_Yo ' + JSON.stringify(position) + ' ' + user);

            this.props.sendNewLocation(
              // RL Add dummy coordinates for SF (37, -122) just in case position.coords.latitude & longitude are invalid.
              // position.coords.latitude || "37.773972",
              // position.coords.longitude || "-122.431297",              
              position.coords.latitude || "39.773972",
              position.coords.longitude || "-129.431297",
              user,
              this,
              function(success, thisRef) {
                if (success) {
                  thisRef.props.profileFetch(user);
                  thisRef.props.nearbyUsersFetch({user}, thisRef, function(
                    success,
                    nearbyRef,
                  ) {});
                  thisRef.props.nearbyRestaurantsFetch(
                    {user},
                    thisRef,
                    function(success, nearbyRestaurantRef) {},
                  );
                } else {
                  // try again pop up
                }
              },
            );
          },
          error => this.setState({error: error.message}),
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
        );
      }
      } else {
        // Unable to procceed

        this.setState({
          modalTitle: 'Location permission',
          modalDescription:
            "We noticed you've removed\nlocation permissions for Shake.\n\nPlease turn ON location\nsharing to get an\nimproved experience.",
          modalButton: 'Change settings',
          isVisible: true,
        });
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log(
        '[INFO] BackgroundGeolocation service is running',
        status.isRunning,
      );
      console.log(
        '[INFO] BackgroundGeolocation service has permissions',
        status.hasPermissions,
      );
      console.log(
        '[INFO] BackgroundGeolocation auth status: ' + status.authorization,
      );

      if (!status.hasPermissions) {
        console.warn(
          '[INFO] BackgroundGeolocation service has permissions',
          status.hasPermissions,
        );
      }

      // you don't need to check status before start (this is just the
      // example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); // triggers start on start event
      }
    });

    // Recebeu uma notificação e a app não estava aberta, por isso salta para o
    // ecrã
    if (global.notificationReceived) {
      global.notificationReceived = false;
      Actions.myActivity({route: 0});
    }
  }

  // // RL
  // componentDidMount() {
  //   this.onSendMessage()
  // }
  // // RL

  primaryButtonPress() {
    BackgroundGeolocation.showLocationSettings();
  }

  componentDidReceiveProps(nextProps) {
    this.forceUpdate();
  }

  renderRow(nearbyUser) {
    return <NearbyUser nearbyUser={nearbyUser} nearby={true} />;
  }

  renderRestaurantRow(nearbyRestaurant) {
    return <NearbyRestaurant nearbyRestaurant={nearbyRestaurant} />;
  }

  onRefresh() {
    this.setState({refreshing: true});
    const {user} = this.props;
    console.log('im here on refresh ');

    this.props.nearbyUsersFetch({user}, this, function(success, nearbyRef) {
      nearbyRef.setState({refreshing: false});
    });
  }

  onPreferencesDone() {
    this.setState({preferencesFirstSetup: false});
  }
  onMoodDone() {
    this.setState({moodFirstSetup: false});
  }
 
  // render2() {
  render() {
    if (!this.props.data) {
      return <Spinner size="large" />;
    }

    if (this.props.data.preferences.firstSetup) {
      // if (this.state.preferencesFirstSetup)
      return <Preferences onDone={this.onPreferencesDone.bind(this)} />;
    }

    // if (this.props.data.mood.firstSetup)
    if (this.state.moodFirstSetup) {
      console.log(this.props)
      // return <Mood onDone={this.onMoodDone.bind(this)} />;
    }

    const {fullName} = this.props.data;
    var photoURL = this.props.data.mood.photoURL;

    return (
      <View>
        {/* <UserSwiper55 nearbyUsers={this.props.nearbyList} /> */}
        <UserSwiper nearbyUsers={this.props.nearbyList} />
        {/* <UserSwiper2 nearbyUsers={this.props.nearbyList} /> */}

        <Footer
          photoURL={this.props.data.mood.photoURL}
          notificationCount={this.props.data.notificationCount}
        />
      </View>
    );
  }
  // render() {
  render2() {
    console.log(this.props.nearbyList)
    if (!this.props.data) {
      return <Spinner size="large" />;
    }

    if (this.props.data.preferences.firstSetup) {
      // if (this.state.preferencesFirstSetup)
      return <Preferences onDone={this.onPreferencesDone.bind(this)} />;
    }

    if (this.props.data.mood.firstSetup) {
      //    if (this.state.moodFirstSetup)
      console.log(this.props)
      // return <Mood onDone={this.onMoodDone.bind(this)} />;
    }

    return (
      <StickyHeaderFooterScrollView
        makeScrollable={false}
        renderStickyFooter={() => (
          <Footer
            photoURL={this.props.data.mood.photoURL}
            notificationCount={this.props.data.notificationCount}
          />
        )}>
        <View style={{height: viewportHeight - 50}}>
          <UserSwiper nearbyUsers={this.props.nearbyList} />
          {/* <UserSwiper2 nearbyUsers={this.props.nearbyList} /> */}
          {/* <UserSwiper55 nearbyUsers={this.props.nearbyList} /> */}
        </View>
      </StickyHeaderFooterScrollView>
    );
  }
}

const mapStateToProps = ({auth, nearby, profile}) => {
  const {user} = auth;
  const {nearbyList, nearbyRestaurantList} = nearby;
  const {data} = profile;
  return {user, nearbyList, data, nearbyRestaurantList};
};

export default connect(
  mapStateToProps,
  {
    nearbyUsersFetch,
    nearbyRestaurantsFetch,
    profileFetch,
    sendNewLocation,
    updateNotificationId,
  },
)(Nearby);
