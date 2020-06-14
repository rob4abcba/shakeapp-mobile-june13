import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import {RNCamera} from 'react-native-camera';
import {connect} from 'react-redux';
import {RNS3} from 'react-native-aws3';

import {logoutUser, profileFetch, saveMoodChanges} from '../actions';

// RL Add
import { Actions } from 'react-native-router-flux';

const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const landmarkSize = 2;

class Mood extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    autoFocusPoint: {
      normalized: {x: 0.5, y: 0.5}, // normalized values required for
      // autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
    depth: 0,
    type: 'front',
    whiteBalance: 'auto',
    ratio: '16:9',
    recordOptions: {
      mute: false,
      maxDuration: 15,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    isRecording: false,
    canDetectFaces: false,
    canDetectText: false,
    canDetectBarcode: false,
    faces: [],
    textBlocks: [],
    barcodes: [],
    timer: 16,
    photoURL: undefined,
    hasPhoto: false,

    // Begin photo/video
    // --> select photos
    avatarSource: null,
    videoSource: null,

    renderVideo: false,
    uploadingVideo: false,
  };

  toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back',
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on',
    });
  }

  touchToFocus(event) {
    const {pageX, pageY} = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs
    // for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }

    this.setState({
      autoFocusPoint: {
        normalized: {x, y},
        drawRectPosition: {x: pageX, y: pageY},
      },
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function() {
    alert('enter')
    if (this.camera) {
      const photo = await this.camera.takePictureAsync();
      this.setState({hasPhoto: true, photoURL: photo.uri});
    }
  };

  takeVideo = async function() {
    if (this.camera) {
      try {
        this.interval = setInterval(
          () => this.setState(prevState => ({timer: prevState.timer - 1})),
          1000,
        );
        const promise = this.camera.recordAsync(this.state.recordOptions);

        if (promise) {
          this.setState({isRecording: true});
          const video = await promise;
          if (this.state.timer === 1) {
            clearInterval(this.interval);
          }
          this.setState({
            isRecording: false,
            hasVideo: true,
            hasPhoto: false,
            photoURL: video.uri,
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  toggle = value => () =>
    this.setState(prevState => ({[value]: !prevState[value]}));

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={
          'We need your permission to use your camera phone'
        }>
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              flex: 1,
              height: 56,
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            {!this.state.hasPhoto ? (
              this.renderPhotoVideoOption()
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
                    justifyContent: 'center',
                  }}>
                  {this.state.uploadingVideo ? 'Please wait...' : "I'm set"}
                </Text>
              </TouchableOpacity>
            )}
            {!this.state.uploadingVideo && this.state.hasPhoto && (
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
                onPress={() =>
                  this.setState({hasPhoto: false, renderVideo: false})
                }>
                <Text style={{fontSize: 14, fontWeight: '500', color: 'white'}}>
                  I need another take
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </RNCamera>
    );
  }

  renderPhotoVideoOption() {
    return (
      <View
        style={{
          flex: 0.1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          style={[{
            flex: 0.8, 
            alignSelf: 'flex-end'
          }]}
          onPress={()=>{  
            this.takePicture.bind(this)
          }}
          onLongPress={
            this.state.isRecording ? () => {} : this.takeVideo.bind(this)
          }>
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
            {this.state.isRecording ? (
              <Text> {this.state.timer} </Text>
            ) : (
              <Text> Tap/Hold </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }

  //Save profile information
  saveChanges() {
    if (this.state.uploadinggg) {
      return;
    }
    console.log("Mood.js: this.state = ", this.state);

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
    console.log("Mood.js: file = ", file);
    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        console.warn(JSON.stringify(response, null, 3));
        Alert.alert('Failed to upload', '', [{text: 'OK'}], {
          cancelable: false,
        });
      } else {
        this.setState({renderVideo: false});
        console.log("console.log", JSON.stringify(response, null, 3));
        console.warn("console.warn", JSON.stringify(response, null, 3));
        this.props.saveMoodChanges(
          this.props.user,
          response.body.postResponse.location,
          this.props.profileFetch,
          function(success, user, profileFetch, ref) {
            if (success) {
              if (file.type == 'video/mp4') {
                console.log("Mood.js: after video/mp4");
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 8,
    borderColor: 'white',
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  flipText: {
    color: 'white',
    fontSize: 15,
  },
  zoomText: {
    position: 'absolute',
    bottom: 70,
    zIndex: 2,
    left: 2,
  },
  picButton: {
    backgroundColor: 'darkseagreen',
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  text: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#F00',
    justifyContent: 'center',
  },
  textBlock: {
    color: '#F00',
    position: 'absolute',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});

const mapStateToProps = ({auth, profile}) => {
  const {user} = auth;
  const {isFetchingProfileData, data} = profile;
  return {user, isFetchingProfileData, data};
};

export default connect(
  mapStateToProps,
  {profileFetch, logoutUser, saveMoodChanges},
)(Mood);
