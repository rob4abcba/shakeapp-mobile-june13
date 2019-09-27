import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Card, CardSection} from './common';
import Icon from 'react-native-vector-icons/FontAwesome';
import {readNotification} from '../actions';

import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';
// Add locale-specific relative date/time formatting rules.
TimeAgo.locale(en);
// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US');

function prettyDistance(distance) {
  return distance > 1
    ? distance.toFixed(1) + 'km'
    : (distance * 1000).toFixed(0) + 'm';
}

class NearbyUser extends Component {
  state = {
    selected: false,
    isRead: false,
  };

  componentWillMount() {
    // Local state to quickly update the unreadNotification icon
    if (this.props.nearbyUser.user.isRead) {
      this.setState({
        isRead: true,
      });
    } else {
      this.setState({
        isRead: false,
      });
    }
  }

  onRowPress() {
    if (this.props.callbackShakers) {
      this.props.callbackShakers(this.props.nearbyUser, !this.state.selected);
      this.setState({
        selected: !this.state.selected,
      });
    } else if (this.props.nearby) {
      Actions.nearbyUserDetail({
        nearbyUser: this.props.nearbyUser,
        notification: this.props.notification,
      });
    } else if (this.props.notification) {
      if (!this.state.isRead) {
        console.log(
          'read NOTIFICATION: ' +
            this.props.user +
            this.props.nearbyUser.user.notificationID,
        );

        // Either way (shake or chat message), if pressed, we read the notification
        this.props.readNotification(
          this.props.user,
          this.props.nearbyUser.user.notificationID,
        );
        this.setState({
          isRead: true,
        });
      }

      if (this.props.nearbyUser.user.notificationType == 'shake') {
        Actions.nearbyUserDetail({
          nearbyUser: this.props.nearbyUser,
          notification: this.props.notification,
        });
      } else {
        this.props.chatCallback(this.props.nearbyUser.user);
      }
    } else if (this.props.friend) {
      this.props.chatCallback(this.props.nearbyUser.user);
    }
  }

  unreadNotification(isRead) {
    if (isRead) {
    } else if (this.props.notification) {
      return (
        <View
          style={{
            marginLeft: 12,
            marginRight: 14,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#FC3768',
          }}
        />
      );
    }
  }

  amazingCircle(nearbyUser) {
    var colors = [];
    var preferences = nearbyUser.user.preferences;
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
            height: 72,
            width: 72,
            borderRadius: 36,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_3.png')}
          />
          <Image
            style={{
              transform: [{rotate: '120deg'}],
              flex: 1,
              height: 72,
              width: 72,
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
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[2],
              opacity: 1,
            }}
            source={require('../assets/circle_3.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 64,
              width: 64,
              borderRadius: 32,
              backgroundColor: 'white',
            }}
          />

          {nearbyUser.user.photoURL ? (
            <Image
              source={{uri: nearbyUser.user.photoURL}}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
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
            height: 72,
            width: 72,
            borderRadius: 36,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_4.png')}
          />
          <Image
            style={{
              transform: [{rotate: '90deg'}],
              flex: 1,
              height: 72,
              width: 72,
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
              height: 72,
              width: 72,
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
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[3],
              opacity: 1,
            }}
            source={require('../assets/circle_4.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 64,
              width: 64,
              borderRadius: 32,
              backgroundColor: 'white',
            }}
          />

          {nearbyUser.user.photoURL ? (
            <Image
              source={{uri: nearbyUser.user.photoURL}}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
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
            height: 72,
            width: 72,
            borderRadius: 36,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_2.png')}
          />
          <Image
            style={{
              transform: [{rotate: '180deg'}],
              flex: 1,
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[1],
              opacity: 1,
            }}
            source={require('../assets/circle_2.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 64,
              width: 64,
              borderRadius: 32,
              backgroundColor: 'white',
            }}
          />

          {nearbyUser.user.photoURL ? (
            <Image
              source={{uri: nearbyUser.user.photoURL}}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
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
            height: 72,
            width: 72,
            borderRadius: 36,
            backgroundColor: 'white',
            borderWidth: 4,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: '#b1b1b1',
          }}>
          <Image
            style={{
              flex: 1,
              height: 72,
              width: 72,
              position: 'absolute',
              tintColor: colors[0],
            }}
            source={require('../assets/circle_1.png')}
          />

          <Image
            style={{
              position: 'absolute',
              height: 64,
              width: 64,
              borderRadius: 32,
              backgroundColor: 'white',
            }}
          />

          {nearbyUser.user.photoURL ? (
            <Image
              source={{uri: nearbyUser.user.photoURL}}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          ) : (
            <Image
              source={require('../assets/avatar.jpg')}
              style={{
                height: 64,
                width: 64,
                borderRadius: 32,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
        </View>
      );
    }
  }

  render() {
    console.log('NearbyUser.render(): PROPS: ' + JSON.stringify(this.props));
    const {
      fullName,
      photoURL,
      message,
      date,
      notificationID,
    } = this.props.nearbyUser.user;
    const {distance} = this.props.nearbyUser;

    return (
      <View
        style={{
          paddingTop: 9,
          paddingBottom: 9,
          paddingRight: 60,
          backgroundColor: !this.state.selected
            ? 'rgba(0,0,0,0)'
            : 'rgba(98, 207, 185, .5)',
        }}>
        <TouchableOpacity // 2 antes
          style={
            !this.state.isRead && this.props.notification
              ? {flexDirection: 'row', alignItems: 'center'}
              : {paddingLeft: 36, flexDirection: 'row', alignItems: 'center'}
          }
          onPress={this.onRowPress.bind(this)}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {this.unreadNotification(this.state.isRead)}
            {this.amazingCircle(this.props.nearbyUser)}
          </View>

          <View style={{paddingLeft: 10, justifyContent: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.name}>{fullName}</Text>
            </View>

            {this.props.nearby && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="map-marker" color="#b1b1b1" size={17} />
                <Text style={{color: '#b1b1b1', fontSize: 14, paddingLeft: 5}}>
                  {prettyDistance(distance)}
                </Text>
              </View>
            )}
            {this.props.notification && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#b1b1b1', fontSize: 14, paddingLeft: 0}}>
                  {message}
                </Text>
                <Text
                  style={{
                    color: '#b1b1b1',
                    fontSize: 10,
                    paddingLeft: 25,
                    justifyContent: 'flex-end',
                  }}>
                  {timeAgo.format(new Date(date))}
                </Text>
              </View>
            )}
            {this.props.friend && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="map-marker" color="#b1b1b1" size={17} />
                <Text style={{color: '#b1b1b1', fontSize: 14, paddingLeft: 5}}>
                  {prettyDistance(distance)}
                </Text>

                <Text
                  style={{
                    color: '#b1b1b1',
                    fontSize: 10,
                    paddingLeft: 25,
                    justifyContent: 'flex-end',
                  }}>
                  {timeAgo.format(
                    new Date(this.props.nearbyUser.user.lastMessageDate),
                  )}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    height: 180,
    width: 160,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 20,
    elevation: 1,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#f4f4f4',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
  },
  profilePicture: {
    height: 60,
    flex: 1,
    width: null,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: -0.4,
  },
};

const mapStateToProps = ({nearby, auth}) => {
  const {user} = auth;
  const {shaking} = nearby;
  return {user, shaking};
};

export default connect(
  mapStateToProps,
  {readNotification},
)(NearbyUser);
