import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Platform,
} from 'react-native';
import Video from 'react-native-video';
import {Spinner} from './common';
import {RNS3} from 'react-native-aws3';
import * as Progress from 'react-native-progress';

import {connect} from 'react-redux';
var validator = require('validator');
import {logoutUser, profileFetch, saveMoodChanges} from '../actions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {verifyPhoneNumber, setValidToken} from '../actions';
import {Actions} from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
// var ImagePicker = require('react-native-image-picker');?
import ImageResizer from 'react-native-image-resizer';

var styles = require('../Styles');

class Mood2 extends Component {
  constructor(props) {
    super(props);

    this.selectPhotoTapped = this.selectPhotoTapped.bind(this); //MC: constructor is good place to bind methods / event handlers
  }

  state = {
    photoURL: undefined,
    hasPhoto: false,

    // Begin photo/video
    // --> select photos
    avatarSource: null,
    videoSource: null,

    renderVideo: false,
    uploadingVideo: false,

    // height of the image we want to upload
    height: null,

    mediaPicked: false,
    // <-- select photos

    // --> new proposal
    media: null,
    mediaName: null,

    thumbnail: null,
    thumbnailName: null,
    // End photo/video
  };

  componentWillMount() {
    StatusBar.setHidden(true);

    if (this.props.data) {
      this.setState({photoURL: this.props.data.mood.photoURL});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null) {
      Actions.login();
    }

    if (nextProps.data) {
      this.setState({photoURL: nextProps.data.mood.photoURL});
    }
  }

  // Save profile information
  saveChanges() {
    if (this.state.uploadinggg) {
      return;
    }

    this.setState({uploadinggg: true});

    ////////////// UPLOAD TO S3
    const file = {
      uri: this.state.photoURL,
      name:
        this.props.data._id +
        '_' +
        Date.now() +
        (this.state.renderVideo ? '.mp4' : '.png'),
      type: this.state.renderVideo ? 'video/mp4' : 'image/png',
    };
    const options = {
      keyPrefix: 'mood_uploads/',
      bucket: 'shakeapp-backend',
      region: 'eu-central-1',
      accessKey: 'AKIAIIPQAXBQFWM2BPYA',
      secretKey: '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',
      successActionStatus: 201,
    };
    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        console.warn(JSON.stringify(response, null, 3));
        Alert.alert('Failed to upload', '', [{text: 'OK'}], {
          cancelable: false,
        });
      } else {
        this.setState({renderVideo: false});
        console.warn(JSON.stringify(response, null, 3));
        this.props.saveMoodChanges(
          this.props.user,
          response.body.postResponse.location,
          this.props.profileFetch,
          function(success, user, profileFetch, ref) {
            if (success) {
              if (file.type == 'video/mp4') {
                ref.setState({uploadingVideo: true});
                setTimeout(() => {
                  ref.setState({uploadingVideo: false, uploadinggg: false});
                  profileFetch(user);
                  if (ref.props && ref.props.onDone) {
                    ref.props.onDone();
                  }
                  Actions.popTo('nearby');
                }, 10000);
              } else {
                profileFetch(user);
                ref.setState({uploadinggg: false});
                if (ref.props && ref.props.onDone) {
                  ref.props.onDone();
                }
                Actions.popTo('nearby');
              }
            } else {
              ref.setState({uploadinggg: false});
              Alert.alert('Something went wrong', '', [{text: 'OK'}], {
                cancelable: false,
              });
            }
          },
          this,
        );
      }
    });
  }

  ////////////////////////// PHOTO/VIDEO
  // --> select photos
  selectPhotoTapped(video) {
    console.log('isVideo=' + video);
    const options = {
      quality: 1.0,
      maxWidth: 1024,
      maxHeight: 1024,
      mediaType: video ? 'video' : 'photo', // 'photo', 'video', or 'mixed' on iOS, 'photo' or 'video' on Android
      storageOptions: {
        skipBackup: true,
      },
      videoQuality: 'medium',
      durationLimit: 15,
      allowsEditing: true,
    };
    console.log('here2');
    this.setState({
      renderVideo: false,
    });
    console.log('here3');
    ImagePicker.showImagePicker(options, response => {
      console.log('hererrr');
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log('else...');
        console.log('response:' + JSON.stringify(response));
        this.state.mediaPicked = true;
        let source = {uri: response.uri};

        if (!video) {
          ImageResizer.createResizedImage(response.uri, 512, 512, 'JPEG', 75)
            .then(response => {
              // response.uri is the URI of the new image that can now be displayed, uploaded...
              // response.path is the path of the new image
              // response.name is the name of the new image with the extension
              // response.size is the size of the new image

              this.state.thumbnail = response.uri; // thumbnail path
              this.state.thumbnailName = 'thumbnail.jpg';
              this.state.media = response.uri;
              this.state.mediaName = 'file.' + response.uri.split('.').pop();

              this.setState({
                avatarSource: source,
                renderVideo: false,
              });

              this.setState({hasPhoto: true, photoURL: response.uri});
            })
            .catch(err => {
              console.error(err);
            });
        } else {
          this.state.thumbnail = response.uri; // thumbnail path
          this.state.thumbnailName = 'thumbnail.jpg';
          this.state.media = response.uri;
          this.state.mediaName = 'file.' + response.uri.split('.').pop();

          this.setState({
            avatarSource: source,
            renderVideo: video,
          });

          this.setState({hasPhoto: true, photoURL: response.uri});
        }
      }
    });
    console.log('here4');
  }
  // <-- select photos
  //////////////////////////

  skip() {
    if (this.props.initialScreen == 'profile') {
      Actions.pop();
    } else {
      if (this.props.onDone) {
        this.props.onDone();
      }
      Actions.popTo('nearby');
    }
  }

  renderButton() {
    return !this.state.hasPhoto ? (
      <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: '#62cfb9',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            width: 150,
            marginRight: 10,
            shadowOpacity: 0.1,
            shadowColor: 'rgb(36, 100, 193)',
            shadowOffset: {width: 4, height: 2},
          }}
          onPress={() => this.selectPhotoTapped(false)}>
          {/* <Text
            style={{
              color: 'white',
              letterSpacing: -0.2,
              fontSize: 18,
              fontWeight: '600',
            }}>
            Take photo
          </Text> */}
          <Image style={{width:100 }} source={require('../assets/camera-black.png')} resizeMode="contain"/>

        </TouchableOpacity>
        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: '#62cfb9',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 8,
            width: 150,
            marginLeft: 10,
            shadowOpacity: 0.1,
            shadowColor: 'rgb(36, 100, 193)',
            shadowOffset: {width: 4, height: 2},
          }}
          onPress={() => this.selectPhotoTapped(true)}>
          {/* <Text
            style={{
              color: 'white',
              letterSpacing: -0.2,
              fontSize: 18,
              fontWeight: '600',
            }}>
            Take video
          </Text> */}
          <Image style={{width:100 }} source={require('../assets/icons8-video-call-100.png')} resizeMode="contain"/>

        </TouchableOpacity>
      </View>
    ) : (
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: '#62cfb9',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          opacity: this.state.uploadingVideo ? 0 : 1,
          shadowOpacity: 0.1,
          shadowColor: 'rgb(36, 100, 193)',
          shadowOffset: {width: 4, height: 2},
        }}
        onPress={this.saveChanges.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          {this.state.uploadingVideo ? 'Please wait...' : "I'm set"}
        </Text>
      </TouchableOpacity>
    );
  }
  render() {
    if (this.props.isFetchingProfileData) {
      return <Spinner size="large" />;
    }

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            paddingTop: 59,
            paddingLeft: 28,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
            <Image
              source={require('../assets/shake-logo.png')}
              style={{height: 30, width: 23, backgroundColor: 'white'}}
              resizeMode={'contain'}
            />

            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 0.5,
                paddingLeft: 6,
              }}>
              Shake.
            </Text>
          </View>

          <View style={{paddingRight: 28, justifyContent: 'flex-end'}}>
            {!this.state.uploadingVideo && (
              <TouchableOpacity
                style={{justifyContent: 'space-between'}}
                onPress={() => this.skip()}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    letterSpacing: 0.5,
                  }}>
                  SKIP
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={[styles.container, {paddingLeft: 36, paddingRight: 36}]}>
          {!this.state.hasPhoto ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 15,
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 32, fontWeight: '700'}}>Mood</Text>

              <Text
                style={{
                  fontSize: 15,
                  paddingTop: 16,
                  fontWeight: '500',
                  color: '#484848',
                  textAlign: 'center',
                }}>
                Share with other Shakers your morning hair,{'\n'}the new shirt
                you put on, or today’s smile.
              </Text>

              <Image
                source={require('../assets/mood.png')}
                style={{marginTop: 20, marginBottom: 80, height: '60%'}}
                resizeMode={'contain'}
              />
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                paddingTop: 15,
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 32, fontWeight: '700'}}>Mood</Text>

              <Text
                style={{
                  fontSize: 15,
                  paddingTop: 16,
                  fontWeight: '500',
                  color: '#484848',
                  textAlign: 'center',
                }}>
                Looking good heh? :)
              </Text>

              <View
                style={{
                  height: 250,
                  width: 250,
                  margin: 60,
                  marginBottom: 120,
                  borderRadius: 125,
                  backgroundColor: 'white',
                  overflow: 'hidden',
                  justifyContent: 'center',
                  borderWidth: 6,
                  borderColor: '#b1b1b1',
                }}>
                {this.state.photoURL &&
                  this.state.renderVideo &&
                  !this.state.uploadingVideo && (
                    <View style={{display: 'flex'}}>
                      <Video
                        //source={{uri: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'}}
                        source={{uri: this.state.photoURL}} // Can be a URL or a local file.
                        ref={ref => {
                          this.player = ref;
                        }}
                        repeat
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
                    </View>
                  )}

                {this.state.uploadingVideo && (
                  <View
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Progress.CircleSnail
                      thickness={10}
                      size={250}
                      color={['#d94f4f', '#62c769', '#6ec7ec', '#f7cc02']}
                    />
                  </View>
                )}

                {!this.state.uploadingVideo &&
                  this.state.photoURL &&
                  !this.state.renderVideo && (
                    <View style={{display: 'flex'}}>
                      <Image
                        source={{uri: this.state.photoURL}}
                        style={{
                          height: '100%',
                          width: '100%',
                          borderRadius: 119,
                          backgroundColor: 'rgba(0,0,0,0)',
                        }}
                      />
                    </View>
                  )}
              </View>
            </View>
          )}
        </View>

        <View
          style={{
            position: 'absolute',
            width: '100%',
            bottom: 36,
            paddingLeft: 36,
            paddingRight: 36,
          }}>
          {this.renderButton()}

          {!this.state.uploadingVideo && this.state.hasPhoto && (
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 11,
                flexDirection: 'row',
              }}
              onPress={() =>
                this.setState({hasPhoto: false, renderVideo: false})
              }>
              <Text style={{fontSize: 14, fontWeight: '500', color: '#62cfb9'}}>
                I need another take
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const mapStateToProps = ({auth, profile}) => {
  const {user} = auth;
  const {isFetchingProfileData, data} = profile;
  return {user, isFetchingProfileData, data};
};

export default connect(
  mapStateToProps,
  {
    profileFetch,
    logoutUser,
    saveMoodChanges,
  },
)(Mood2);
