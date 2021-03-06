import React, {Component} from 'react';
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
  ImageBackground,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';
import NearbyRestaurant from './NearbyRestaurant';
import Video from 'react-native-video';
import ConnectyCube from 'react-native-connectycube';
import {Spinner, Card} from './common';
import {Button} from 'react-native-elements';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import {Icon} from 'react-native-elements';
import Modal from 'react-native-modal';

import {sendShake, reportAbuseOrContent} from '../actions';

import {ScaledSheet} from 'react-native-size-matters';

import TimeAgo from 'javascript-time-ago';
// Load locale-specific relative date/time formatting rules.
import en from 'javascript-time-ago/locale/en';
import {orange} from 'color-name';
// Add locale-specific relative date/time formatting rules.
TimeAgo.locale(en);
// Create relative date/time formatter.
const timeAgo = new TimeAgo('en-US');

function prettyDistance(distance) {
  return distance > 1
    ? distance.toFixed(1) + 'km'
    : (distance * 1000).toFixed(0) + 'm';
}
function _calculateAge(birthday) {
  // birthday is a date
  var ageDifMs = Date.now() - birthday.getTime();
  var ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

var styles = require('../Styles');
var photoURL = '';
var videoURL = '';

class NearbyUserDetail extends Component {
  state = {
    invite: false,
    // Modal Error
    isVisible: false,
    chatIsVisible: false,
    modalTitle: '',
    modalButton: '',
    modalDescription: '',
    msg: '', //MG: Set message initially to empty string

    //Report Abuse or feedback
    report: false,
    description: '',

    //MC: Model after "report"
    videoChatMessage: false,
    playProfileVideo: false,
    paused: true, // June5: Pause profile video until click PLAY button
    // paused: false, // June5: Pause profile video until click PLAY button
  };

  componentWillMount() {
    StatusBar.setHidden(true);
    this.props.conn.emit('init', {
      token: this.props.user,
    });
  }

  onBackButtonPress() {
    Actions.pop();
  }

  tryAgain() {
    this.setState({isVisible: false});
    Actions.popTo('nearby');
  }

  skipInvite() {
    this.setState({invite: false});
  }

  skipReport() {
    this.setState({report: false});
  }

  skipVideoChatMessage() {
    this.setState({videoChatMessage: false});
  }

  skipPlayProfileVideo() {
    // this.setState({playProfileVideo: false});
    this.setState({paused: false}); // June5: Pause profile video until click PLAY button
  }

  onChatSend() {
    this.props.conn.emit('message', {
      message: this.state.msg,
      token: this.props.user,
      receiverID: this.props.nearbyUser.user._id,
    });
    // const newMessage = {
    //     date: message[0].createdAt,
    //     message: message[0].text,
    //     isRead: false,
    //     senderID: this.props.user._id,
    // };
    this.setState({chatIsVisible: false});
    Actions.popTo('nearby'); //this.props.onSendMessage(this.props.friend._id, newMessage); // The conversation ID is who we're speaking with
  }

  onButtonPress(restaurantID) {
    const {user} = this.props;
    const {_id} = this.props.nearbyUser.user;

    if (
      this.props.notification &&
      this.props.nearbyUser.user.notificationType == 'shake'
    ) {
      this.props.sendShake(true, this.props.user, _id, this, function(
        success,
        thisRef,
      ) {
        if (!success) {
          thisRef.setState({
            modalTitle: 'Error',
            modalDescription: 'Network problem.',
            modalButton: 'Try again',
            isVisible: true,
          });
        } else {
          // thisRef.setState({
          //   modalTitle: "And we're Shaking!",
          //   modalDescription: "Invite accepted.",
          //   modalButton: "Great!",
          //   isVisible: true
          // });
          Actions.popTo('myActivity');
        }
      });
    } else {
      if (!this.state.invite) {
        this.setState({invite: true});
      } else {
        this.props.sendShake(
          false,
          this.props.user,
          _id,
          this,
          function(success, thisRef) {
            if (!success) {
              thisRef.setState({
                modalTitle: 'Error',
                modalDescription: 'Shake was not sent.',
                modalButton: 'Try again',
                isVisible: true,
              });
            } else {
              thisRef.setState({
                modalTitle: "And we're Shaking!",
                modalDescription: 'Your invites were\nsuccessfully sent.',
                modalButton: 'Great!',
                isVisible: true,
              });
            }
          },
          restaurantID,
        );

        this.setState({invite: false});
        // Actions.popTo('nearby'); tirar?
      }
    }
  }

  onChatButtonPress() {
    this.setState({chatIsVisible: true});
    this.setState({msg: ''});
  }

  onReportButtonPress(description) {
    const {user} = this.props;
    const {_id} = this.props.nearbyUser.user;
    if (!this.state.report) {
      this.setState({report: true});
    } else {
      this.props.reportAbuseOrContent(
        this.props.user,
        _id,
        this,
        function(success, thisRef) {
          if (!success) {
            thisRef.setState({
              modalTitle: 'Try again',
              modalDescription: 'Please try again after some time.',
              modalButton: 'Try again',
              isVisible: true,
            });
          } else {
            thisRef.setState({
              modalTitle: 'Feedback submitted!',
              modalDescription:
                'Thank you for submitting your feedback. We will try to resolve the issue as soon as possible.',
              modalButton: 'Go Back!',
              isVisible: true,
            });
          }
        },
        description,
      );
      this.setState({report: false});
    }
  }

  onVideoChatButtonPress(description) {
    const {user} = this.props;
    const {_id} = this.props.nearbyUser.user;
    if (!this.state.videoChatMessage) {
      this.setState({videoChatMessage: true});
    } else {
      // this.props.videoChatMessageAbuseOrContent(
      this.props.reportAbuseOrContent(
        this.props.user,
        _id,
        this,
        function(success, thisRef) {
          if (!success) {
            thisRef.setState({
              modalTitle: 'Try again',
              modalDescription: 'Please try again after some time.',
              modalButton: 'Try again',
              isVisible: true,
            });
          } else {
            thisRef.setState({
              modalTitle: 'Feedback submitted!',
              modalDescription:
                'Thank you for submitting your feedback. We plan to work on a video chat feature.',
              modalButton: 'Go Back!',
              isVisible: true,
            });
          }
        },
        description,
      );
      this.setState({videoChatMessage: false});
    }
  }

  onPlayProfileVideoButtonPress(description) {
    const {user} = this.props;
    const {_id} = this.props.nearbyUser.user;
    if (!this.state.playProfileVideo) {
      this.setState({playProfileVideo: true});
    } else {
      // this.props.playProfileVideoAbuseOrContent(
      this.props.reportAbuseOrContent(
        this.props.user,
        _id,
        this,
        function(success, thisRef) {
          if (!success) {
            thisRef.setState({
              modalTitle: 'Try again',
              modalDescription: 'Please try again after some time.',
              modalButton: 'Try again',
              isVisible: true,
            });
          } else {
            thisRef.setState({
              modalTitle: 'Feedback submitted!',
              modalDescription:
                'Thank you for submitting your feedback. The profile video will play.',
              modalButton: 'Go Back!',
              isVisible: true,
            });
          }
        },
        description,
      );
      this.setState({playProfileVideo: false});
    }
  }

  onDescriptionChange(description) {
    this.setState({description: description});
  }

  onMessageChange(message) {
    this.setState({msg: message});
  }

  getPhotoVideoURL(user) {
    // console.log('NearbyUserDetail2: JSON.stringify(user.videoURL) = ' + JSON.stringify(user));
    console.log(
      'NearbyUserDetail2: JSON.stringify(user.fullName) = ' +
        JSON.stringify(user.fullName),
    );
    // console.log('NearbyUserDetail2: JSON.stringify(this.props.nearbyUser.user) = ' + JSON.stringify(this.props.nearbyUser.user));
    console.log(
      'NearbyUserDetail2: JSON.stringify(this.props.nearbyUser.user.fullName) = ' +
        JSON.stringify(this.props.nearbyUser.user.fullName),
    );
    console.log(
      'NearbyUserDetail2: JSON.stringify(this.props.nearbyUser.user.videoURL) = ' +
        JSON.stringify(this.props.nearbyUser.user.videoURL),
    );
    console.log(
      'NearbyUserDetail2: JSON.stringify(this.props.nearbyUser.user.photoURL) = ' +
        JSON.stringify(this.props.nearbyUser.user.photoURL),
    );
    if (user.mood != undefined) {
      photoURL = user.mood.photoURL;
      videoURL = user.mood.videoURL;
    } else {
      photoURL = user.photoURL;
    }
  }

  render() {
    const {distance} = this.props.nearbyUser;
    const {
      fullName,
      gender,
      preferences,
      shakes,
      birthday,
      bio,
    } = this.props.nearbyUser.user;
    // const { photoURL, videoURL } = this.props.nearbyUser.user.mood;

    this.getPhotoVideoURL(this.props.nearbyUser.user);

    if (this.state.invite) {
      return this.nearByResturants();
    } else if (this.state.videoChatMessage) {
      return this.videoChatMessage();
    } else if (this.state.playProfileVideo) {
      return this.playProfileVideo();
    } else if (this.state.report) {
      return this.reportOptions();
    }

    return (
      <View style={{flexDirection: 'column-reverse', flex: 1, marginBottom: 0}}>
        {/* Error modal */}
        <Modal
          backdropOpacity={0}
          style={{alignItems: 'center'}}
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({isVisible: false})}>
          <View
            style={{
              width: 300,
              height: 200,
              alignItems: 'center',
              justifyContent: 'center',
              // color: 'orange',
              // backgroundColor: 'white',
              backgroundColor: 'rgba(0,0,0,0.3)', //partially transparent
              paddingTop: 40,
              // marginTop: 40,
              borderRadius: 8,
              shadowOpacity: 0.1,
              shadowColor: 'rgb(36, 100, 193)',
              shadowOffset: {width: 4, height: 2},
            }}>
            <Text style={{fontSize: 24, fontWeight: '800', color:'orange'}}>
              {this.state.modalTitle}
            </Text>

            <Text
              style={{
                selfAlign: 'center',
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                // color: '#484848',
                color: 'orange',
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
                onPress={() => this.tryAgain()}>
                <Text
                  style={{
                    color: 'white',
                    // color: 'orange',
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

        {/* chat modal */}

        <Modal
          backdropOpacity={0}
          style={{alignItems: 'center'}}
          isVisible={this.state.chatIsVisible}
          onBackdropPress={() => this.setState({chatIsVisible: false})}>
          <View
            style={{
              width: 300,
              height: 400, //MC: Height of modal
              alignItems: 'center',
              justifyContent: 'center',
              // backgroundColor: 'white',
              backgroundColor: 'rgba(0,0,0,0.3)', //partially transparent
              // backgroundColor: 'transparent', //fully transparent
              // backgroundColor: 'rgb(0, 255, 0, 1.0)',
              paddingTop: 40, //MC: Padding originally 40
              borderRadius: 8,
              shadowOpacity: 0.1,
              shadowColor: 'rgb(36, 100, 193)',
              shadowOffset: {width: 4, height: 2},
            }}>
            <Text style={{fontSize: 24, fontWeight: '800', color: 'orange'}}>Let's talk</Text>

            <Text
              style={{
                selfAlign: 'center',
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                // color: '#484848',
                color: 'orange',
              }}>
              Please write your message below.
            </Text>

            <View style={[style.textInputContainer]}>
              <TextInput
                // clearButtonMode="always"
                placeholder="Enter message (140 char max) "
                inputStyle={styles.inputStyle}
                multiline={false}
                maxLength={140}
                onChangeText={this.onMessageChange.bind(this)}
                value={this.state.msg}
              />
            </View>

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
                onPress={() => this.onChatSend()}>
                <Text
                  style={{
                    color: 'white',
                    // color: 'orange',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Send
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{flexDirection: 'column-reverse', flex: 1}}>
          <View
            style={{
              // flexDirection: 'column-reverse',
              flexDirection: 'row',
              flex: 350, //Controls height of transparent banner with info at bottom of user profiles
              // zIndex: 1,
              backgroundColor: 'rgba(255,255,255,.3)', // TODO
              // backgroundColor: 'rgba(255,0,111,.1)', // TODO
              paddingLeft: 5,
              paddingRight: 1,
              paddingBottom: 30, // Adjust
              // justifyContent: 'flex-end',
              justifyContent: 'space-between',
              marginBottom: 0,
            }}>
            <View
              style={{
                // flexDirection: 'column-reverse',
                flexDirection: 'column',
                flex: 50, //Controls height of transparent banner with info at bottom of user profiles
                zIndex: 1,
                // backgroundColor: 'rgba(255,0,255,.2)', // TODO
                paddingLeft: 1,
                paddingRight: 1,
                // justifyContent: 'flex-end',
                justifyContent: 'center',
                marginBottom: 0,
              }}>
              <View
                style={{
                  // paddingTop: 26,
                  paddingTop: 0,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  // flex: 1,
                  // flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    fontSize: 26,
                    fontWeight: '700',
                    letterSpacing: -0.5,
                  }}>
                  {fullName}
                </Text>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {/* <IconAwesome name="map-marker" color="#b1b1b1" size={17} /> */}
                <Text
                  style={{
                    // color: '#b1b1b1',
                    color: 'orange',
                    fontSize: 14,
                    paddingLeft: 0,
                    marginTop: 0,
                    marginLeft: 0,
                    marginBottom: 0,
                  }}>
                  {gender}
                </Text>
              </View>

              {birthday && (
                <Text style={{color: 'purple', fontSize: 14, marginTop: 5}}>
                  {_calculateAge(new Date(birthday)) + ' years old'}
                </Text>
              )}
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconAwesome name="map-marker" color="purple" size={17} />
                <Text
                  style={{
                    color: 'purple',
                    fontSize: 14,
                    paddingLeft: 5,
                    marginTop: 10,
                  }}>
                  {prettyDistance(distance)}
                </Text>
              </View>

              {preferences && (
                <View
                  style={{
                    marginTop: 2,
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {preferences.veggie && (
                    <Image
                      source={require('../assets/veggie.png')}
                      style={{
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        // backgroundColor: 'white',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  )}
                  {preferences.meat && (
                    <Image
                      source={require('../assets/meat.png')}
                      style={{
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        // backgroundColor: 'white',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  )}
                  {preferences.seaFood && (
                    <Image
                      source={require('../assets/seafood.png')}
                      style={{
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        // backgroundColor: 'white',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  )}
                  {preferences.drinks && (
                    <Image
                      source={require('../assets/drinks.png')}
                      style={{
                        height: 34,
                        width: 34,
                        borderRadius: 17,
                        // backgroundColor: 'white',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                      }}
                    />
                  )}
                </View>
              )}

              <Text style={{padding: 0}}>{bio}</Text>
            </View>

            <View
              style={{
                flexDirection: 'column',
                // flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: 'flex-end',
                justifyContent: 'center',
                padding: 0,
                marginTop: 0,
                marginBottom: 0,
                flex: 9,
              }}>
              <TouchableOpacity
                onPress={this.onChatButtonPress.bind(this)}
                activeOpacity={0.5} //MC: Opacity when clicked
                style={{
                  height: 50,
                  width: 50,
                  // backgroundColor: 'rgb(255, 255, 0, alpha)',
                  // backgroundColor: 'rgba(255, 255, 0, 0.9)',
                  // backgroundColor: 'rgba(0, 0, 255, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.0)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                }}>
                <Image
                  style={{width: 80}}
                  source={require('../assets/chat_shake.png')}
                  resizeMode="contain"
                />
                {/* // Video chat icon goes here.  Navigate to ConnectyCube auth.js onPress and pass in the ID of the friend as a prop.  */}
                {/* <Image style={{width:100 }} source={require('../assets/icons8-video-call-100.png')} resizeMode="contain"/> */}
              </TouchableOpacity>
              {/* <TouchableOpacity
                // onPress={this.onChatButtonPress.bind(this)}
                // onPress={() => Actions.chatAuth()}
                onPress={this.onVideoChatButtonPress.bind(this)}
                activeOpacity={0.5} //MC: Opacity when clicked
                style={{
                  height: 50,
                  width: 50,
                  // backgroundColor: 'rgb(255, 255, 0, alpha)',
                  // backgroundColor: 'rgba(255, 255, 0, 0.9)',
                  // backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.0)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                  marginBottom: 10,
                }}>
                <Image
                  style={{width: 50}}
                  source={require('../assets/icons8-video-call-100.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity> */}

              <TouchableOpacity
                onPress={this.onReportButtonPress.bind(this)}
                style={{
                  position: 'absolute',
                  bottom: 10, // 40 too high for iPhoneSE
                  right: 10,
                  flexDirection: 'row',
                  height: 25,
                  alignItems: 'flex-end',
                  paddingRight: 12,
                  paddingLeft: 1,
                  paddingTop: 5,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  // borderColor: 'rgba(255, 0, 0, 0.9)',
                  borderColor: 'rgba(0, 0, 0, 0)',
                  // backgroundColor: 'pink',
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                }}>
                <IconAwesome
                  name="flag"
                  size={18}
                  color="black"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={{flex: 999}}>   */}
          <View
            style={{
              // flexDirection: 'row-reverse',
              // flexDirection: 'row',
              flexDirection: 'column-reverse',
              // backgroundColor: 'rgba(0, 255, 0, 0.2)',
              // backgroundColor: 'rgba(0, 0, 0, 0.2)',
              backgroundColor: 'rgba(0, 0, 0, 0)',
              // flexDirection: 'column',
              flex: 999,
              marginBottom: 0,
              // paddingBottom: 0,
            }}>

             {/* Comment out red YouTube like PLAY button on ProfileVideos  */}
        {/*
            {videoURL && (
              <TouchableOpacity
                // onPress={this.onChatButtonPress.bind(this)}
                // onPress={this.onReportButtonPress.bind(this)}
                onPress={this.onPlayProfileVideoButtonPress.bind(this)}
                // onPress={() => this.skipPlayProfileVideo()} //June5: Worked once but not after that
                // onPress={() => Actions.chatAuth()}
                // flex={1} // flex
                activeOpacity={0.5} //MC: Opacity when clicked
                style={{
                  position: 'absolute',
                  bottom: 40,
                  right: 10,
                  zIndex: 1,

                  height: 50,
                  width: 50,
                  // backgroundColor: 'pink',
                  // backgroundColor: 'rgb(255, 255, 0, alpha)',
                  // backgroundColor: 'rgba(255, 255, 0, 0.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  // backgroundColor: 'rgba(0, 255, 0, 0.0)',
                  justifyContent: 'center',
                  // justifyContent: 'flex-end',
                  alignItems: 'center',
                  // alignItems: 'flex-end',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                  marginBottom: 0, //marginBottom cannot put play button on top of video. Just pushes video upward.
                }}>
                <Image
                  style={{width: 50}}
                  color={orange}
                  source={require('../assets/icons8-play-button-16-red.png')} //small red play button with transparent background
                  // source={require('../assets/icons8-play-button-50-red.png')}
                  // flex={10} // flex
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
        */}

            {videoURL && (
              <Video
                //source={{ uri: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4' }}
                source={{uri: videoURL}} // Can be a URL or a local file.
                controls={true}
                paused={this.state.paused} // June5: Pause profile video until click PLAY button
                // ignoreSilentSwitch={"ignore"} //McBk Headphone Vol 60% hear vid w/o mute SilentSwi
                // muted={false} //McBk Headphone Vol 60% hear vid w/o mute SilentSwi
                // repeat={false}
                // flex={10} // flex
                ref={ref => {
                  this.player = ref;
                }}
                resizeMode={'cover'}
                onError={err => {
                  console.warn(err);
                }}
                style={{
                  height: '100%',
                  width: '100%',
                  // backgroundColor: 'rgba(0,255,0,0.1)',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                }}
              />
            )}

            {!videoURL && photoURL && (
              <ImageBackground
                // source={{uri: !photoURL ?'https://www.kindpng.com/picc/m/136-1369892_avatar-people-person-business-user-man-character-avatar.png': photoURL}}
                source={{
                  uri: photoURL,
                }}
                resizeMode={'cover'}
                // resizeMode="contain" // If want entire photo shrunk to fit container in worse case axis
                style={{flex: 1, height: undefined, width: undefined}}>
                {/* style={{height: '100%', flex: 1}}> */}
                {/* style={{width: '100%', flex: 1}}> */}
                {/* style={{width: '100%', height: '100%', flex: 1}}> */}
              </ImageBackground>
            )}

            {!videoURL && !photoURL && (
              <ImageBackground
                // source={{uri: !photoURL ?'https://www.kindpng.com/picc/m/136-1369892_avatar-people-person-business-user-man-character-avatar.png': photoURL}}
                // resizeMode={'cover'}
                resizeMode="contain"
                //RL: Good syntax but missing other case and photo exists case
                source={
                  gender === 'male'
                    ? // ? require('../assets/shakeapp_man.png')
                      require('../assets/ManLargeMay18th.png')
                    : // ? require('../assets/ManTopHalfBkgndTransparentMay18th.png')
                    // ? require('../assets/man_top_half.png')
                    gender === 'female'
                    ? // ? require('../assets/shakeapp_woman.png')
                      require('../assets/WomanLargeNoShadesMay18th.png')
                    : // ? require('../assets/WomanTopHalfNoShadesMay18th.png')
                      // : require('../assets/ComboManWomanOther.png')
                      // : require('../assets/icons8-female-user-100.png')
                      require('../assets/WomanLargeWithShadesMay18th.png')
                  // : require('../assets/WomanTopHalfWithShadesMay18th.png')
                  // : require('../assets/halfman_halfwoman_top_half.png')
                }
                style={{
                  flex: 1,
                  height: undefined,
                  width: undefined,
                  justifyContent: 'center',
                }}
                // style={{width: '100%', height: '200%', flex: 1}}
              >
                {/* <LinearGradient
                  colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
                  style={{
                    height: 100,
                    width: '100%',
                    position: 'absolute',
                    top: 0,
                  }}
                /> */}
              </ImageBackground>
            )}
          </View>
        </View>
      </View>
    );
  }

  nearByResturants() {
    return (
      <ScrollView style={[styles.container, {backgroundColor: 'white'}]}>
        <View style={{height: '100%', paddingBottom: 61, paddingLeft: 24}}>
          <View
            style={{
              height: 61,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 29,
            }}>
            <TouchableOpacity
              style={{justifyContent: 'space-between'}}
              onPress={() => this.skipInvite()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                SKIP
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{fontSize: 18, fontWeight: '700', letterSpacing: 0.3}}>
            Choose the restaurant (NearbyUserDetail2.js)
          </Text>

          <FlatList
            data={this.props.nearbyRestaurantList}
            keyExtractor={(x, i) => i.toString()}
            renderItem={({item}) => (
              <NearbyRestaurant
                callback={this.onButtonPress.bind(this)}
                nearbyRestaurant={item}
              />
            )}
            horizontal={false}
          />
        </View>
      </ScrollView>
    );
  }

  reportOptions() {
    return (
      <ScrollView style={[styles.container, {backgroundColor: 'white'}]}>
        <View
          style={{
            height: '100%',
            paddingBottom: 61,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: 'orange',
          }}>
          <View
            style={{
              height: 61,
              flexDirection: 'row',
              marginTop: 90, //Move SKIP below Shake Notification at upper right
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 29,
              // backgroundColor: 'yellow',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'space-between'}}
              onPress={() => this.skipReport()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                SKIP FEEDBACK
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{letterSpacing: 0.3, color: 'black'}}>
            Your feedback helps us find any issues when something's not right.{' '}
          </Text>
          <View style={[style.textInputContainer]}>
            <TextInput
              placeholder="Enter Reason to report"
              inputStyle={styles.inputStyle}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
              onChangeText={this.onDescriptionChange.bind(this)}
              value={this.props.description}
            />
          </View>

          <View style={{height: 50}}>
            <TouchableOpacity
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'flex-end',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              onPress={this.onReportButtonPress.bind(
                this,
                this.state.description,
              )}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '900',
                  letterSpacing: 2.5,
                  // color: '#62cfb9',
                  color: 'black',
                }}>
                SUBMIT FEEDBACK
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={{letterSpacing: 0.3, color:'white'}}>
            Note: For any immediate danger or emergency situation, please call
            local emergency services.
          </Text> */}
        </View>
      </ScrollView>
    );
  }

  // Model videoChatMessage() after reportOptions()
  videoChatMessage() {
    return (
      <ScrollView style={[styles.container, {backgroundColor: 'white'}]}>
        <View
          style={{
            height: '100%',
            paddingBottom: 61,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: 'orange',
          }}>
          <View
            style={{
              height: 61,
              flexDirection: 'row',
              marginTop: 90, //Move SKIP below Shake Notification at upper right
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 29,
              // backgroundColor: 'yellow',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'space-between'}}
              onPress={() => this.skipVideoChatMessage()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                RETURN FROM VIDEO CHAT MESSAGE
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 20,
              // letterSpacing: 0.5
              letterSpacing: 0.3,
              // letterSpacing: 0.1
              // letterSpacing: 0.0
            }}>
            We are working on a Video Chat feature in our next release. What
            other features would you like to see? Your feedback helps us know
            what to work on next.{' '}
          </Text>
          <View style={[style.textInputContainer]}>
            <TextInput
              placeholder="Enter Feedback"
              inputStyle={styles.inputStyle}
              alignContent="center"
              textAlign="center"
              multiline={true}
              numberOfLines={4}
              // maxLength={200}
              maxLength={300}
              onChangeText={this.onDescriptionChange.bind(this)}
              value={this.props.description}
            />
          </View>

          <View style={{height: 50}}>
            <TouchableOpacity
              style={{
                height: 50,
                justifyContent: 'center',
                // justifyContent: 'space-between',
                alignItems: 'flex-end',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              onPress={this.onVideoChatButtonPress.bind(
                this,
                this.state.description,
              )}>
              <Text
                style={{
                  // fontSize: 14,
                  fontSize: 20,
                  fontWeight: '900',
                  // alignContent: 'center',
                  alignContent: 'flex-start',
                  // alignContent: 'stretch',
                  // textAlign: 'center',
                  textAlign: 'left',
                  // letterSpacing: 2.5,
                  letterSpacing: 2.0,
                  color: '#62cfb9',
                }}>
                Submit feedback
              </Text>
              {/* <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                SUBMIT FEEDBACK
              </Text> */}
            </TouchableOpacity>
          </View>
          {/* <Text style={{letterSpacing: 0.3}}>
            Note: For any immediate danger or emergency situation, please call
            local emergency services.
          </Text> */}
        </View>
      </ScrollView>
    );
  }

  // Model playProfileVideo() after reportOptions()
  playProfileVideo() {
    return (
      <ScrollView style={[styles.container, {backgroundColor: 'white'}]}>
        <View
          style={{
            height: '100%',
            paddingBottom: 61,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: 'orange',
          }}>
          <View
            style={{
              height: 61,
              flexDirection: 'row',
              marginTop: 90, //Move SKIP below Shake Notification at upper right
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 29,
              // backgroundColor: 'yellow',
            }}>
            <TouchableOpacity
              style={{justifyContent: 'space-between'}}
              onPress={() => this.skipPlayProfileVideo()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                PLAY PROFILE VIDEO NOW
              </Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              letterSpacing: 0.3,
              // fontSize:16,
              fontSize: 20,
            }}>
            While you are here, do you want to leave any feedback? Your feedback
            helps us know what to work on next.{' '}
          </Text>
          <View style={[style.textInputContainer]}>
            <TextInput
              placeholder="Enter Feedback"
              inputStyle={styles.inputStyle}
              multiline={true}
              numberOfLines={4}
              maxLength={200}
              onChangeText={this.onDescriptionChange.bind(this)}
              value={this.props.description}
            />
          </View>

          <View style={{height: 50}}>
            <TouchableOpacity
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'flex-end',
                borderBottomWidth: StyleSheet.hairlineWidth,
              }}
              onPress={this.onPlayProfileVideoButtonPress.bind(
                this,
                this.state.description,
              )}>
              <Text
                style={{
                  // fontSize: 14,
                  fontSize: 20,
                  fontWeight: '900',
                  letterSpacing: 2.5,
                  color: '#62cfb9',
                }}>
                Submit feedback before playing profile video
              </Text>
            </TouchableOpacity>
          </View>
          {/* <Text style={{letterSpacing: 0.3}}>
            Note: For any immediate danger or emergency situation, please call
            local emergency services.
          </Text> */}
        </View>
      </ScrollView>
    );
  }
}
const style = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '73@vs',
    justifyContent: 'center',
  },

  logoContainer: {
    paddingTop: '59@vs',
    paddingLeft: '28@vs',
    flexDirection: 'row',
    alignItems: 'center',
  },

  textInputContainer: {
    flex: 0.2,
    flexDirection: 'row',
    // justifyContent: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // alignItems: 'flex-start',
    backgroundColor: 'white',
    width: 250,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: 'blue',
    paddingLeft: 10,
    paddingRight: 10,
  },

  textInput: {
    flex: 1,
    fontSize: '16@ms',
    fontWeight: '500',
  },
});

const mapStateToProps = ({nearby, auth}) => {
  const {user} = auth;
  const {shaking, nearbyRestaurantList} = nearby;

  return {user, shaking, nearbyRestaurantList};
};

export default connect(mapStateToProps, {sendShake, reportAbuseOrContent})(
  NearbyUserDetail,
);
