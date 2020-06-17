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
import Geolocation from '@react-native-community/geolocation';
import Modal from 'react-native-modal';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import StickyHeaderFooterScrollView from 'react-native-sticky-header-footer-scroll-view';
import {request} from "react-native-permissions";
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
        this.geoUpdate.bind(this);


        check(PERMISSIONS.IOS.LOCATION_ALWAYS)
            .then((result) => {
                switch (result) {
                    case RESULTS.UNAVAILABLE:
                        console.log(
                            'This feature is not available (on this device / in this context)',
                        );
                        break;
                    case RESULTS.DENIED:
                        console.log(
                            'The permission has not been requested / is denied but requestable',
                        );
                        break;
                    case RESULTS.GRANTED: {
                        try {
                            Geolocation.getCurrentPosition(
                                ({coords}) => {
                                    console.log("this is the coordinates", coords)
                                    this.geoUpdate({coords: {latitude: coords.latitude, longitude: coords.longitude}})

                                },
                                (err) => {
                                    console.log('err = ');
                                    console.log(err);
                                    this.geoUpdate({coords: {latitude: "39.773972", longitude: "-129.431297"}})
                                },
                                {enableHighAccuracy: false, timeout: 20000, maximumAge: 3000}
                            );
                        } catch (e) {
                            console.log('e = ');
                            console.log(e);  // getCurrentPosition is not a function
                        }
                    }
                        break;
                    case RESULTS.BLOCKED:
                        console.log('The permission is denied and not requestable anymore');
                        break;
                }
            })
            .catch((error) => {
                console.log(error)
            });

        // Permissions.check('location', {type: 'always'}).then(response => {
        //     if (response !== 'denied') {
        //         try {
        //             Geolocation.getCurrentPosition(
        //                 ({coords}) => {
        //                     console.log("this is the coordinates", coords)
        //                     this.geoUpdate.bind(this);
        //                     this.geoUpdate({coords: {latitude: coords.latitude, longitude: coords.longitude}})
        //
        //                 },
        //                 (err) => {
        //                     console.log('err = ');
        //                     console.log(err);
        //                 },
        //                 { enableHighAccuracy: false, timeout: 20000, maximumAge: 3000 }
        //             );
        //         } catch (e) {
        //             console.log('e = ');
        //             console.log(e);  // getCurrentPosition is not a function
        //         }
        //         // navigator.geolocation.getCurrentPosition(this.geoUpdate.bind(this));
        //     }
        //     else {
        //         console.log("Permission denied Geoupdate call");
        //         this.geoUpdate({coordinates: {latitude: "39.773972", longitude: "-129.431297"}})
        //     }
        // });

        // Permissions.check('location', {type: 'whenInUse'}).then(response => {
        //     if (response !== 'denied') {
        //         try {
        //             Geolocation.getCurrentPosition(
        //                 ({coords}) => {
        //                     this.geoUpdate.bind(this);
        //                     console.log("this is the coordinates", coords)
        //                     this.geoUpdate({coords: {latitude: coords.latitude, longitude: coords.longitude}})
        //
        //                 },
        //                 (err) => {
        //                     console.log('err = ');
        //                     console.log(err);
        //                 },
        //                 { enableHighAccuracy: false, timeout: 20000, maximumAge: 3000 }
        //             );
        //         } catch (e) {
        //             console.log('e = ');
        //             console.log(e); // getCurrentPosition is not a function
        //         }
        //         // navigator.geolocation.getCurrentPosition(this.geoUpdate.bind(this));
        //     }
        //     else {
        //         console.log("Permission denied Geoupdate call");
        //         this.geoUpdate({coords: {latitude: "39.773972", longitude: "-129.431297"}})
        //     }
        // });
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
 
  render2() {
  // render() {
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
  render() { //Swap render2 & render to get profile icon & Shake logo notification footer on top
  // render2() {
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
          // renderStickyFooter={() => (
          //   <Footer
          //     photoURL={this.props.data.mood.photoURL}
          //     notificationCount={this.props.data.notificationCount}
          //   />
          //)}
      >
          <View style={{height: viewportHeight}}>
              <UserSwiper nearbyUsers={this.props.nearbyList} photoURL={this.props.data.mood.photoURL}
                          notificationCount={this.props.data.notificationCount}/>
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
