import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
  Platform
} from 'react-native';
import Video from 'react-native-video';
import { Spinner } from './common';
import { RNS3 } from 'react-native-aws3';
import * as Progress from 'react-native-progress';

import { connect } from 'react-redux';
var validator = require('validator');
import {
  logoutUser,
  profileFetch,
  saveMoodChanges
} from '../actions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { verifyPhoneNumber, setValidToken } from '../actions';
import { Actions } from 'react-native-router-flux';
//var ImagePicker = require('react-native-image-picker');
import ImageResizer from 'react-native-image-resizer';
import ImagePicker from 'react-native-image-crop-picker';
import Camera from 'react-native-camera';
const { CaptureMode, CaptureTarget } = Camera.constants;
const { video: captureModeVideo, still: captureModePhoto } = CaptureMode;

var styles = require('../Styles');
//https://stackoverflow.com/questions/48637585/how-to-capture-videos-with-react-native-camera-module
class Mood extends Component {
  constructor(props) {
    console.log('enter this mood rn camera');
    super(props);
    this.state = {
            captureMode: captureModePhoto,
            isRecording: false
        };

        this.onCapture = this.onCapture.bind(this);
        this.onSwitchCaptureMode = this.onSwitchCaptureMode.bind(this);
        
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
    this.pickSingleWithCamera();
  }
  pickSingleWithCamera() {
      ImagePicker.openCamera({

          mediaType: "video",
        }).then(image => {
          console.log(image);
        });
    }
  state = {
    photoURL: undefined,
    hasPhoto: false,
    bio: undefined,

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
  }

  componentWillMount() {
    StatusBar.setHidden(true);

    if (this.props.data){
      this.setState({ photoURL: this.props.data.mood.photoURL })
      this.setState({ bio: this.props.data.bio })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null)
      Actions.login();

    if (nextProps.data)
      this.setState({ photoURL: nextProps.data.mood.photoURL })
  }

  // Save profile information
  saveChanges() {
    if (this.state.uploadinggg)
      return;

    this.setState({ uploadinggg: true });

    ////////////// UPLOAD TO S3
    const file = {
      uri: this.state.photoURL,
      name: this.props.data._id + "_" + Date.now() + (this.state.renderVideo ? ".mp4" : ".png"),
      type: this.state.renderVideo ? "video/mp4" : "image/png"
    }
    const options = {
      keyPrefix: "mood_uploads/",
      bucket: "shakeapp-backend",
      region: "eu-central-1",
      accessKey: "AKIAIIPQAXBQFWM2BPYA",
      secretKey: "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",
      successActionStatus: 201
    }
    RNS3.put(file, options).then(response => {
      if (response.status !== 201) {
        console.warn(JSON.stringify(response, null, 3));
        Alert.alert(
          'Failed to upload',
          '',
          [
            { text: 'OK' },
          ],
          { cancelable: false }
        )
      }
      else {
        this.setState({ renderVideo: false });
        console.warn(JSON.stringify(response, null, 3));
        this.props.saveMoodChanges(this.props.user, response.body.postResponse.location, this.props.profileFetch, function (success, user, profileFetch, ref) {
          if (success) {
            if (file.type == "video/mp4") {
              ref.setState({ uploadingVideo: true });
              setTimeout(() => {
                ref.setState({ uploadingVideo: false, uploadinggg: false })
                profileFetch(user);
                if (ref.props && ref.props.onDone)
                  ref.props.onDone();
                Actions.popTo('nearby')
              }, 10000)
            }
            else {
              profileFetch(user);
              ref.setState({ uploadinggg: false });
              if (ref.props && ref.props.onDone)
                ref.props.onDone();
              Actions.popTo('nearby')
            }
          }
          else {
            ref.setState({ uploadinggg: false });
            Alert.alert(
              'Something went wrong',
              '',
              [
                { text: 'OK' },
              ],
              { cancelable: false }
            )
          }
        }, this);
      }
    });
  }



  ////////////////////////// PHOTO/VIDEO
  // --> select photos
  selectPhotoTapped(video) {
	  console.log("isVideo="+video);
    const options = {
      quality: 1.0,
      maxWidth: 1024,
      maxHeight: 1024,
      mediaType: 'mixed',  // 'photo', 'video', or 'mixed' on iOS, 'photo' or 'video' on Android
      storageOptions: {
        skipBackup: true
      },
      videoQuality: 'medium',
      durationLimit: 15,
      allowsEditing: true
    };
    console.log("here2");
    this.setState({
      renderVideo: false
    });
    console.log("here3");
//    ImagePicker.launchCamera(options, (response) => {
//    	console.log('hererrr');
//      console.log('Response = ', response);
//
//      if (response.didCancel) {
//        console.log('User cancelled photo picker');
//      }else if (response.error) {
//        console.log('ImagePicker Error: ', response.error);
//      }else if (response.customButton) {
//        console.log('User tapped custom button: ', response.customButton);
//      }else {
//    	  console.log("else...");
//        console.log("response:"+JSON.stringify(response));
//        this.state.mediaPicked = true;
//        let source = { uri: response.uri };
//
//        if (!video) {
//          ImageResizer.createResizedImage(response.uri, 512, 512, "JPEG", 75).then((response) => {
//            // response.uri is the URI of the new image that can now be displayed, uploaded...
//            // response.path is the path of the new image
//            // response.name is the name of the new image with the extension
//            // response.size is the size of the new image
//
//            this.state.thumbnail = response.uri; // thumbnail path
//            this.state.thumbnailName = 'thumbnail.jpg';
//            this.state.media = response.uri;
//            this.state.mediaName = 'file.' + response.uri.split('.').pop();
//
//            this.setState({
//              avatarSource: source,
//              renderVideo: false
//            });
//
//            this.setState({ hasPhoto: true, photoURL: response.uri })
//          }).catch((err) => {
//            console.error(err)
//          });
//        }
//        else {
//          this.state.thumbnail = response.uri; // thumbnail path
//          this.state.thumbnailName = 'thumbnail.jpg';
//          this.state.media = response.uri;
//          this.state.mediaName = 'file.' + response.uri.split('.').pop();
//
//          this.setState({
//            avatarSource: source,
//            renderVideo: video
//          });
//
//          this.setState({ hasPhoto: true, photoURL: response.uri })
//        }
//      }
//    })
    console.log("here4");
  }
  // <-- select photos
  //////////////////////////


  skip() {
    if (this.props.initialScreen == 'profile') {
      Actions.pop();
    } else {
      if (this.props.onDone)
        this.props.onDone();
      Actions.popTo('nearby');
    }
  }

  renderButton() {
    return (
      !this.state.hasPhoto ?
        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
          <TouchableOpacity
            style={{
              height: 50, backgroundColor: '#62cfb9', justifyContent: 'center',
              alignItems: 'center', borderRadius: 8, width: 150, marginRight: 10,
              shadowOpacity: 0.1, shadowColor: 'rgb(36, 100, 193)', shadowOffset: { width: 4, height: 2 }
            }}
            onPress={() => this.selectPhotoTapped(false)}
          >
            <Text style={{ color: 'white', letterSpacing: -0.2, fontSize: 18, fontWeight: '600' }}>
              Take photo
        </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: 50, backgroundColor: '#62cfb9', justifyContent: 'center',
              alignItems: 'center', borderRadius: 8, width: 150, marginLeft: 10,
              shadowOpacity: 0.1, shadowColor: 'rgb(36, 100, 193)', shadowOffset: { width: 4, height: 2 }
            }}
            onPress={() => this.selectPhotoTapped(true)}
          >
            <Text style={{ color: 'white', letterSpacing: -0.2, fontSize: 18, fontWeight: '600' }}>
              Take video
        </Text>
          </TouchableOpacity>
        </View>
        :
        <TouchableOpacity
          style={{
            height: 50, backgroundColor: '#62cfb9', justifyContent: 'center',
            alignItems: 'center', borderRadius: 8, opacity: this.state.uploadingVideo ? 0 : 1,
            shadowOpacity: 0.1, shadowColor: 'rgb(36, 100, 193)', shadowOffset: { width: 4, height: 2 }
          }}
          onPress={this.saveChanges.bind(this)}
        >
          <Text style={{ color: 'white', letterSpacing: -0.2, fontSize: 18, fontWeight: '600' }}>
            {this.state.uploadingVideo ? "Please wait..." : "I'm set"}
          </Text>
        </TouchableOpacity>
    );
  }
  onCapture() {
      const { captureMode, isRecording } = this.state;

      if (isRecording) {
          this._camera.stopCapture();
          this.setState({ isRecording: false });
          return;
      }

      if (captureMode === captureModeVideo) {
          this.setState({ isRecording: true });
      }

      this._camera.capture({ mode: captureMode })
          .then((result) => console.log(result))
          .catch((error) => console.log(error));
  }

  onSwitchCaptureMode() {
      if (this.state.captureMode === captureModeVideo) {
          this.setState({ captureMode: captureModePhoto });
      } else {
          this.setState({ captureMode: captureModeVideo });
      }
  }

  render() {
      const { captureMode } = this.state;

      return (
          <Camera
              ref={(ref) => this._camera = ref}
              style={{ flex: 1 }}
              captureMode={captureMode}
              captureTarget={CaptureTarget.disk}
          >
              <TouchableOpacity onPress={this.onCapture}>
              <Text style={{ color: 'white', letterSpacing: -0.2, fontSize: 18, fontWeight: '600' }}>
              Photo
              </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onSwitchCaptureMode}>
              <Text style={{ color: 'white', letterSpacing: -0.2, fontSize: 18, fontWeight: '600' }}>
              Video
              </Text>
              </TouchableOpacity>
          </Camera>
      );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  oval: {
    width: 120,
    height: 120,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#ffffff',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval2: {
    width: 110,
    height: 110,
    backgroundColor: '#d94f4f',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  image:
  {
    height: 70,
    width: 70,
  },
}


const mapStateToProps = ({ auth, profile }) => {
  const { user } = auth;
  const { isFetchingProfileData, data } = profile;
  return { user, isFetchingProfileData, data };
};

export default connect(mapStateToProps, {
  profileFetch,
  logoutUser,
  saveMoodChanges
})(Mood);
