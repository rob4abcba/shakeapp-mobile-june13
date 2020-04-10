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
} from 'react-native';

import {connect} from 'react-redux';
import {
  nearbyUsersFetch,
  nearbyRestaurantsFetch,
  profileFetch,
  sendNewLocation,
  updateNotificationId,
} from '../actions';
import {Spinner} from './common';
import {Actions} from 'react-native-router-flux';
import NearbyUser from './NearbyUser';
import NearbyRestaurant from './NearbyRestaurant';
import {Icon, Badge} from 'react-native-elements';
import Preferences from './Preferences';
// import Mood from './Mood';
import Mood from './Mood2';
// import Mood from './Mood_RNCamera';

import GridView from 'react-native-super-grid';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import Modal from 'react-native-modal';
import Permissions from 'react-native-permissions';

var styles = require('../Styles');

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
    StatusBar.setHidden(true);
    const {user} = this.props;

    this.props.updateNotificationId(user);

    Permissions.check('location', {type: 'always'}).then(response => {
      if (response !== 'denied') {
        navigator.geolocation.getCurrentPosition(this.geoUpdate.bind(this));
      }
    });

    Permissions.check('location', {type: 'whenInUse'}).then(response => {
      if (response !== 'denied') {
        navigator.geolocation.getCurrentPosition(this.geoUpdate.bind(this));
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
      //   'Content-Type': 'application/x-www-form-urlencoded'
      // },
      // customize post properties
      // postTemplate: {
      //   lat: '@latitude',
      //   lon: '@longitude',
      //   token: this.props.user // you can also add your own properties
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

        navigator.geolocation.getCurrentPosition(
          position => {
            console.warn('POSITION ' + JSON.stringify(position) + ' ' + user);

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

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    // Recebeu uma notificação e a app não estava aberta, por isso salta para o ecrã
    if (global.notificationReceived) {
      global.notificationReceived = false;
      Actions.myActivity({route: 0});
    }
  }

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

  onNotificationsPress() {
    Actions.myActivity({route: 0});
  }

  renderNotificationBadge() {
    if (this.props.data.notificationCount > 0) {
      return (
        <View style={{position: 'absolute', overflow: 'visible'}}>
          <Badge
            value={this.props.data.notificationCount}
            textStyle={{color: 'white'}}
            containerStyle={{backgroundColor: '#000'}}
          />
        </View>
      );
    }
  }

  onPreferencesDone() {
    this.setState({preferencesFirstSetup: false});
  }
  onMoodDone() {
    this.setState({moodFirstSetup: false});
  }

  render() {
    if (!this.props.data) {
      return <Spinner size="large" />;
    }

    //if (this.props.data.preferences.firstSetup)
    if (this.state.preferencesFirstSetup) {
      return <Preferences onDone={this.onPreferencesDone.bind(this)} />;
    }

    //if (this.props.data.mood.firstSetup)
    if (this.state.moodFirstSetup) {
      return <Mood onDone={this.onMoodDone.bind(this)} />;
    }

    const {fullName} = this.props.data;
    var photoURL = this.props.data.mood.photoURL;

    return (
      <ScrollView style={[styles.container, {backgroundColor: 'white'}]}>
        {/* Error modal */}
        <Modal
          backdropOpacity={0}
          style={{alignItems: 'center', flex: 1}}
          isVisible={this.state.isVisible}
          // onBackdropPress={() => this.setState({ isVisible: false })}
        >
          <View
            style={{
              width: 300,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              paddingTop: 40,
              borderRadius: 8,
              shadowOpacity: 0.1,
              shadowColor: 'rgb(36, 100, 193)',
              shadowOffset: {width: 4, height: 2},
            }}>
            <Text style={{fontSize: 24, fontWeight: '800'}}>
              {this.state.modalTitle}
            </Text>

            <Text
              style={{
                selfAlign: 'center',
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
              }}>
              {this.state.modalDescription}
            </Text>

            <View
              style={{
                width: '100%',
                paddingLeft: 36,
                paddingTop: 40,
                paddingRight: 36,
                paddingBottom: 36,
              }}>
              <TouchableOpacity
                style={{
                  height: 50,
                  backgroundColor: '#62cfb9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                }}
                onPress={() => this.primaryButtonPress()}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  {this.state.modalButton}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Error modal */}

        <View
          style={{
            height: 113,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#62cfb9',
          }}>
          <TouchableOpacity
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 36,
            }}
            onPress={() => Actions.drawerOpen()}>
            <View
              style={{
                height: 44,
                width: 44,
                borderRadius: 22,
                backgroundColor: 'white',
                borderWidth: 3,
                borderColor: '#b1b1b1',
              }}>
              {photoURL ? (
                <Image
                  source={{uri: photoURL}}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              ) : (
                <Image
                  source={require('../assets/avatar.jpg')}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              )}
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                letterSpacing: 0.4,
                color: 'white',
                paddingLeft: 13,
              }}>
              {fullName}
            </Text>
          </TouchableOpacity>

          <View style={{marginRight: 24, height: 45, width: 47}}>
            <TouchableOpacity
              style={{paddingRight: 5, paddingTop: 7}}
              onPress={this.onNotificationsPress.bind(this)}>
              <Image
                source={require('../assets/shake-logo-transparent.png')}
                style={{height: 39, width: 30}}
                resizeMode={'contain'}
              />

              {this.renderNotificationBadge()}
            </TouchableOpacity>
          </View>
        </View>
        {/* Height fixa de 420 para termos 4 users apenas e aparecer alguns spots */}
        <View style={{paddingTop: 30, height: 420}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                letterSpacing: 0.3,
                paddingLeft: 36,
              }}>
              Shakers
            </Text>

            <TouchableOpacity
              style={{paddingRight: 36}}
              onPress={this.onRefreshButton.bind(this)}>
              <Icon name="refresh" type="ionicons" color="black" size={35} />
            </TouchableOpacity>
          </View>

          {this.props.nearbyList && (
            <GridView
              itemDimension={75}
              items={this.props.nearbyList}
              renderItem={item => (
                <NearbyUser nearbyUser={item} nearby={true} />
              )}
              horizontal
            />
          )}
        </View>

        <View style={{paddingTop: 30, marginBottom: 40, paddingLeft: 36}}>
          <Text style={{fontSize: 18, fontWeight: '700', letterSpacing: 0.3}}>
            Spots
          </Text>

          {this.props.nearbyRestaurantList && (
            <GridView
              itemDimension={75}
              items={this.props.nearbyRestaurantList}
              renderItem={item => <NearbyRestaurant nearbyRestaurant={item} />}
              horizontal
            />
          )}
        </View>
      </ScrollView>
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
