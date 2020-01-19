import React from 'react';
//import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Share,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {socialAccountsFetch, profileFetch} from '../actions';
import {connect} from 'react-redux';

import {Spinner} from './common';

import Icon from 'react-native-vector-icons/Octicons';
// import UserAvatar from 'react-native-user-avatar';

var stylesFile = require('../Styles');

class DrawerContent extends React.Component {
  componentWillMount() {
    // fetch data do profile
    this.props.profileFetch(this.props.user);
  }

  componentWillReceiveProps(nextProps) {
    // nextProps are the next set of props that this component
    // will be rendered with
    // this.props is still the old set of props
    console.log(
      'DrawerContent > componentWillReceiveProps: ' +
        JSON.stringify(nextProps.data),
    );

    // if (nextProps.data) {
    // }
  }

  onNotificationsPress() {
    Actions.myActivity({route: 0});
  }

  // onChatPress() {
  //   Actions.myActivity({route: 1});
  // }

  onProfilePress() {
    Actions.profile();
  }

  onSettingsPress() {
    Actions.settings();
  }

  amazingCircle(user) {
    var colors = [];
    var preferences = user.preferences;
    if (preferences) {
      if (preferences.meat) {
        colors.push('#d94f4f');
      }
      if (preferences.veggie) {
        colors.push('#62c769');
      }
      if (preferences.drinks) {
        colors.push('#f7cc02');
      }
      if (preferences.seaFood) {
        colors.push('#6ec7ec');
      }
    }

    if (colors.length == 3) {
      return (
        <View
          style={{
            height: 108,
            width: 108,
            borderRadius: 54,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_3.png')}
          />
          <Image
            style={{
              transform: [{rotate: '120deg'}],
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[1],
              opacity: 1,
            }}
            source={require('../assets/circle_3.png')}
          />
          <Image
            style={{
              transform: [{rotate: '240deg'}],
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[2],
              opacity: 1,
            }}
            source={require('../assets/circle_3.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 100,
              width: 100,
              borderRadius: 50,
              backgroundColor: 'white',
            }}
          />

          {user.photoURL ? (
            <Image
              source={{uri: user.photoURL}}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
        </View>
      );
    } else if (colors.length == 4) {
      return (
        <View
          style={{
            height: 108,
            width: 108,
            borderRadius: 54,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_4.png')}
          />
          <Image
            style={{
              transform: [{rotate: '90deg'}],
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[1],
              opacity: 1,
            }}
            source={require('../assets/circle_4.png')}
          />
          <Image
            style={{
              transform: [{rotate: '180deg'}],
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[2],
              opacity: 1,
            }}
            source={require('../assets/circle_4.png')}
          />
          <Image
            style={{
              transform: [{rotate: '270deg'}],
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[3],
              opacity: 1,
            }}
            source={require('../assets/circle_4.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 100,
              width: 100,
              borderRadius: 50,
              backgroundColor: 'white',
            }}
          />

          {user.photoURL ? (
            <Image
              source={{uri: user.photoURL}}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
        </View>
      );
    } else if (colors.length == 2) {
      return (
        <View
          style={{
            height: 108,
            width: 108,
            borderRadius: 54,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_2.png')}
          />
          <Image
            style={{
              transform: [{rotate: '180deg'}],
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[1],
              opacity: 1,
            }}
            source={require('../assets/circle_2.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 100,
              width: 100,
              borderRadius: 50,
              backgroundColor: 'white',
            }}
          />

          {user.photoURL ? (
            <Image
              source={{uri: user.photoURL}}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
        </View>
      );
    } else {
      return (
        <View
          style={{
            height: 108,
            width: 108,
            borderRadius: 54,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 108,
              width: 108,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_1.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 100,
              width: 100,
              borderRadius: 50,
              backgroundColor: 'white',
            }}
          />

          {user.photoURL ? (
            <Image
              source={{uri: user.photoURL}}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 100,
                width: 100,
                borderRadius: 50,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
        </View>
      );
    }
  }

  render() {
    if (!this.props.data) {
      return <Spinner size="large" />;
    }

    const {fullName, shakes} = this.props.data;
    var photoURL = this.props.data.mood.photoURL;

    return (
      <View style={styles.container}>
        <View style={{margin: 36, marginRight: 10, flexDirection: 'column'}}>
          <TouchableOpacity
            style={{
              height: 108,
              width: 108,
              borderRadius: 50,
              backgroundColor: 'white',
            }}
            onPress={() => {
              Actions.mood();
            }}>
            {/* {photoURL ?
              <Image
                source={{ uri: photoURL }}
                style={{ height: '100%', width: '100%', borderRadius: 48, backgroundColor: 'rgba(0,0,0,0)' }}
              /> :
              <Image
                source={require('../assets/avatar.jpg')}
                style={{ height: '100%', width: '100%', borderRadius: 48, backgroundColor: 'rgba(0,0,0,0)' }}
              />
            } */}

            {this.amazingCircle(this.props.data)}
          </TouchableOpacity>

          <View style={{flexDirection: 'column', paddingTop: 20}}>
            <Text
              style={{
                fontSize: 23,
                fontWeight: '700',
                letterSpacing: 0.4,
                color: 'black',
              }}>
              {fullName}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: 5,
              }}>
              <Image
                source={require('../assets/shakes.png')}
                style={{
                  height: 18,
                  width: 18,
                  borderRadius: 9,
                  backgroundColor: 'white',
                }}
              />

              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '500',
                  letterSpacing: 0.2,
                  paddingLeft: 11,
                }}>
                {shakes} Shakes
              </Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={{paddingLeft: 36, paddingTop: 70}}>
          <TouchableOpacity
            style={{paddingBottom: 12}}
            onPress={this.onProfilePress.bind(this)}>
            <Text
              style={{fontSize: 22, fontWeight: '500', letterSpacing: -0.4}}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={{paddingBottom: 12}}
            onPress={this.onChatPress.bind(this)}>
            <Text
              style={{fontSize: 22, fontWeight: '500', letterSpacing: -0.4}}>
              Chat
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            style={{paddingBottom: 12}}
            onPress={this.onNotificationsPress.bind(this)}>
            <Text
              style={{fontSize: 22, fontWeight: '500', letterSpacing: -0.4}}>
              Notifications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{paddingBottom: 12}}
            onPress={this.onSettingsPress.bind(this)}>
            <Text
              style={{fontSize: 22, fontWeight: '500', letterSpacing: -0.4}}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingLeft: 36,
            paddingBottom: 50,
          }}>
          <Text style={{fontSize: 14, fontWeight: '500', color: '#3f3f3f'}}>
            Shake v1.0
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = ({auth, profile}) => {
  const {user} = auth;
  const {isFetchingProfileData, data} = profile;
  return {user, isFetchingProfileData, data};
};

// export default DrawerContent;
export default connect(
  mapStateToProps,
  {profileFetch},
)(DrawerContent);
