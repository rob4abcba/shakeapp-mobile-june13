import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StatusBar,
  View,
  Image,
  Animated,
  StyleSheet,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import {Spinner} from './common';
import NearbyUser from './NearbyUser';
import {notificationsFetch, friendsFetch, profileFetch} from '../actions';
import {onSendMessage, chatsFetch} from '../actions';
import SocketIOClient from 'socket.io-client';

var styles = require('../Styles');

const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

class MyActivity extends Component {
  constructor(props) {
    super(props);

    // CHAT
    // RL this.socket = SocketIOClient('https://www.shakeapp-backend.net');
    this.socket = SocketIOClient('http://localhost:8000');

    this.socket.emit('init', {
      token: this.props.user,
    });
    this.socket.on('message', message => {
      const newMessage = {
        date: message.date,
        message: message.message,
        isRead: message.isRead,
        senderID: message.senderID,
        restaurant: message.restaurant,
      };
      // // RL
      // const testMessage = {
      //   date: message.date,
      //   message: message.message,
      //   isRead: message.isRead,
      //   senderID: message.senderID,
      //   restaurant: message.restaurant,
      // };
      // // RL
      this.props.onSendMessage(message.senderID, newMessage); // The conversation ID is who we're speaking with
    });
  }

  state = {
    refreshing: false,
    index: 0,
    routes: [
      {key: 'first', title: 'Notifications'},
      // {key: 'second', title: 'Your shakers'},
    ],
  };

  componentWillMount() {
    StatusBar.setHidden(true);

    const {user} = this.props;
    this.props.notificationsFetch({user}, this, function(
      success,
      notificationsRef,
    ) {});
    this.props.friendsFetch({user}, this, function(success, friendsRef) {});
    this.props.chatsFetch({user});
    this.setState({index: this.props.route});
  }
  componentWillUnmount() {
    this.socket.emit('disconnect', {
      token: this.props.user,
    });
  }
  onConversationPress(friend) {
    Actions.chatConversation({
      friend: friend,
      socket: this.socket,
    });
  }
  // END CHAT

  handleRefreshNotifications = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        const {user} = this.props;
        this.props.notificationsFetch({user}, this, function(
          success,
          notificationsRef,
        ) {
          console.warn('HANDLE NOTIFICATION FETCH: ' + success);
          notificationsRef.setState({
            refreshing: false,
          });
        });
      },
    );
  };

  handleRefreshFriends = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => {
        const {user} = this.props;
        this.props.friendsFetch({user}, this, function(success, friendsRef) {
          friendsRef.setState({
            refreshing: false,
          });
        });
      },
    );
  };

  _handleIndexChange = index => this.setState({index});
  _renderHeader = props => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    return (
      <View style={styles.tabBar}>
        {/* <Text
          style={{
            alignContent: 'center',
            fontSize: 24,
            fontWeight: '700',
            letterSpacing: -0.4,
            color: 'red',
            paddingLeft: 3,
          }}>
          NOTIFICATIONS3
        </Text> */}

        {props.navigationState.routes.map((route, i) => {
          const color = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? '#62cfb9' : '#eee',
            ),
          });
          return (
            <AnimatedButton
              key={i}
              style={[styles.tabItem, {backgroundColor: color, opacity: 0.49}]}
              onPress={() => this.setState({index: i})}>
              <Text style={{color: 'red', fontWeight: '500', fontSize: 16}}>
                {route.title} Yo
              </Text>

              {/* <Text
                style={{
                  alignContent: 'center',
                  fontSize: 24,
                  fontWeight: '700',
                  letterSpacing: -0.4,
                  color: 'red',
                  paddingLeft: 3,
                }}>
                NOTIFICATIONS4
              </Text> */}
            </AnimatedButton>
          );
        })}
      </View>
    );
  };

  _renderScene = ({route}) => {
    return route.key == 'first' ? (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <FlatList
          data={this.props.notificationsList}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item}) => (
            <NearbyUser
              nearbyUser={item}
              notification={true}
              chatCallback={friend => {
                this.props.profileFetch(this.props.user);
                this.onConversationPress(friend);
              }}
            />
          )}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefreshNotifications}
        />
      </View>
    ) : (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <FlatList
          data={this.props.friendsList}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({item}) => (
            <NearbyUser
              nearbyUser={item}
              friend={true}
              chatCallback={friend => this.onConversationPress(friend)}
            />
          )}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefreshFriends}
        />
      </View>
    );
  };

  onBackButtonPress() {
    Actions.popTo('nearby');
  }

  render() {
    if (!this.props.data) {
      return <Spinner size="large" />;
    }

    const {fullName} = this.props.data;
    var photoURL = this.props.data.mood.photoURL;

    return (
      <View style={{flex: 1}}>
        <View
          style={{
            height: 92,
            alignItems: 'flex-start',
            backgroundColor: '#62cfb9',
          }}>
          <TouchableOpacity
            style={styles.topBackButton}
            onPress={this.onBackButtonPress.bind(this)}>
            <Icon name="arrow-back" type="ionicons" color="white" size={35} />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              marginLeft: 44,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
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
                    // backgroundColor: 'rgba(0,0,0,0)',
                    backgroundColor: 'red',
                  }}
                />
              ) : (
                <Image
                  source={require('../assets/avatar.jpg')}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
                    // backgroundColor: 'rgba(0,0,0,0)',
                    backgroundColor: 'red',
                  }}
                />
              )}
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                letterSpacing: -0.4,
                color: 'white',
                paddingLeft: 3,
              }}>
              {fullName}
            </Text>
          </View>
          {/* <Text
            style={{
              alignContent: 'center',
              fontSize: 24,
              fontWeight: '700',
              letterSpacing: -0.4,
              color: 'white',
              paddingLeft: 3,
            }}>
            NOTIFICATIONS1
          </Text> */}
        </View>



        <TabView
          navigationState={this.state}
          renderScene={this._renderScene}
          renderHeader={this._renderHeader}
          onIndexChange={this._handleIndexChange}
          style={{ backgroundColor: 'pink' }}
          // indicatorStyle={{color: 'red'}}
          // activeColor={{color: 'red'}}
          // inactiveColor={{color: 'red'}}
          renderTabBar={ (props) => (<TabBar {...props}
            indicatorStyle={{ backgroundColor: 'rgba(0,0,0,0)' }}
            style={{ backgroundColor: 'black' }}
          /> ) }
        />
        {/* <Text
          style={{
            alignContent: 'center',
            fontSize: 24,
            fontWeight: '700',
            letterSpacing: -0.4,
            color: 'red',
            paddingLeft: 3,
          }}>
          NOTIFICATIONS2
        </Text> */}
      </View>
    );
  }
}

const mapStateToProps = ({notification, auth, profile}) => {
  const {user} = auth;
  const {notificationsList, friendsList} = notification;
  const {data} = profile;
  return {user, notificationsList, friendsList, data};
};
export default connect(mapStateToProps, {
  friendsFetch,
  notificationsFetch,
  onSendMessage,
  chatsFetch,
  profileFetch,
})(MyActivity);
