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
      msg:'', //MG: Set message initially to empty string

    //Report Abuse or feedback
    report: false,
    description: '',
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
        Actions.popTo('nearby');        //this.props.onSendMessage(this.props.friend._id, newMessage); // The conversation ID is who we're speaking with
    };

  onButtonPress(restaurantID) {
    const {user} = this.props;
    const {_id} = this.props.nearbyUser.user;

      if (
          this.props.notification &&
          this.props.nearbyUser.user.notificationType == 'shake'
      ) {
          this.props.sendShake(true, this.props.user, _id, this, function (
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
                  function (success, thisRef) {
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

    onDescriptionChange(description) {
        this.setState({description: description});
    }


    onMessageChange(message) {
    this.setState({msg: message});
  }

  getPhotoVideoURL(user) {
    console.log('ESTOU AQUI CRL: ' + JSON.stringify(user));
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
      preferences,
      shakes,
      birthday,
      bio,
    } = this.props.nearbyUser.user;
    // const { photoURL, videoURL } = this.props.nearbyUser.user.mood;

    this.getPhotoVideoURL(this.props.nearbyUser.user);

    if (this.state.invite) {
      return this.nearByResturants();
    } else if (this.state.report) {
      return this.reportOptions();
    }

    return (
        <View style={{flex: 1, marginBottom: 20}}
      >
        {/* Error modal */}
        <Modal
          backdropOpacity={0}
          style={{alignItems: 'center'}}
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({isVisible: false})}>
          <View
            style={{
              width: 300,
                height: 500,
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
                      onPress={() => this.tryAgain()}>
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
                        backgroundColor: 'pink',
                        paddingTop: 40, //MC: Padding originally 40
                        borderRadius: 8,
                        shadowOpacity: 0.1,
                        shadowColor: 'rgb(36, 100, 193)',
                        shadowOffset: {width: 4, height: 2},
                    }}>
                    <Text style={{fontSize: 24, fontWeight: '800'}}>Let's talk</Text>

                    <Text
                        style={{
                            selfAlign: 'center',
                            fontSize: 15,
                            paddingTop: 16,
                            fontWeight: '500',
                            color: '#484848',
                        }}>Please write your message below.</Text>

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
                                    letterSpacing: -0.2,
                                    fontSize: 18,
                                    fontWeight: '600',
                                }}>Send</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        <View style={{flex: 1}}>
          <ImageBackground
            source={{uri: !photoURL ?'https://www.kindpng.com/picc/m/136-1369892_avatar-people-person-business-user-man-character-avatar.png':photoURL}}
            style={{width: '100%', height: '200%', flex: 1}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
              style={{height: 100, width: '100%', position: 'absolute', top: 0}}
            />

              <View style={{flex: 1}}>
              {!!videoURL && (
                <Video
                  //source={{ uri: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4' }}
                  source={{uri: videoURL}} // Can be a URL or a local file.
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
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              )}
            </View>

            {/* <TouchableOpacity
              style={styles.topBackButton}
              onPress={this.onBackButtonPress.bind(this)}>
              <Icon name="arrow-back" type="ionicons" color="white" size={35} />
            </TouchableOpacity> */}
          </ImageBackground>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,.2)',
            paddingLeft: 36,
            paddingRight: 36,
          }}>
          <View
            style={{
              paddingTop: 26,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 26, fontWeight: '700', letterSpacing: -0.5}}>
              {fullName}
            </Text>

              {/*<View style={{flexDirection: 'row', paddingTop: 2}}>*/}
              {/*<Image*/}
              {/*source={require('../assets/shakes.png')}*/}
              {/*style={{*/}
              {/*height: 18,*/}
              {/*width: 18,*/}
              {/*borderRadius: 9,*/}
              {/*backgroundColor: 'white',*/}
              {/*}}*/}
              {/*/>*/}

              {/*<Text*/}
              {/*style={{*/}
              {/*fontSize: 15,*/}
              {/*fontWeight: '500',*/}
              {/*letterSpacing: 0.2,*/}
              {/*paddingLeft: 11,*/}
              {/*}}>*/}
              {/*{shakes} Shakes*/}
              {/*</Text>*/}
              {/*</View>*/}
          </View>

          {birthday && (
            <Text style={{color: '#b1b1b1', fontSize: 14, marginTop: 5}}>
              {_calculateAge(new Date(birthday)) + ' years old'}
            </Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconAwesome name="map-marker" color="#b1b1b1" size={17} />
            <Text
              style={{
                color: '#b1b1b1',
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
                marginTop: 12,
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
                    backgroundColor: 'white',
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
                    backgroundColor: 'white',
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
                    backgroundColor: 'white',
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
                    backgroundColor: 'white',
                  }}
                />
              )}
            </View>
          )}

          <Text style={{padding: 14}}>{bio}</Text>

            <View style={{flex: 1, justifyContent: 'flex-end', padding: 16, marginBottom: 60}}>
            <TouchableOpacity
              onPress={this.onChatButtonPress.bind(this)}
              style={{
                height: 50,
                backgroundColor: 'yellow',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 8,
                shadowOpacity: 0.1,
                shadowColor: 'rgb(36, 100, 193)',
                shadowOffset: {width: 4, height: 2},
              }}>
              {this.props.notification &&
              this.props.nearbyUser.user.notificationType == 'shake' ? (
                <Text
                  style={{
                    color: 'black',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Chat
                </Text>
              ) : (
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  <IconAwesome name="comment" size={48} color="green"/>
                </Text>
              )}
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              onPress={this.onReportButtonPress.bind(this)}
              style={{
                flexDirection: 'row',
                height: 25,
                alignItems: 'flex-end',
                paddingRight: 12,
                paddingLeft: 15,
                paddingTop: 20,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: 'rgba(117, 136, 147, 0.6)',
              }}>
                <View style={{flex: 1, height: 25, justifyContent: 'center', marginBottom: 50}}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: 'gray',
                    letterSpacing: 2.5,
                  }}>
                    <IconAwesome name="flag" size={24} color="red"/>
                </Text>
              </View>
            </TouchableOpacity>
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
          }}>
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
              onPress={() => this.skipReport()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                SKIP
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={{letterSpacing: 0.3}}>
            Your feedback helps us to find any issues when something's not
            right.{' '}
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
                  color: '#62cfb9',
                }}>
                Submit feedback
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={{letterSpacing: 0.3}}>
            Note: For any immediate danger or emergency situation, please call
            local emergency services.
          </Text>
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
      width:250,
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

export default connect(
  mapStateToProps,
  {sendShake, reportAbuseOrContent},
)(NearbyUserDetail);
