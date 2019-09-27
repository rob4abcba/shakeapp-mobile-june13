import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Slider,
} from 'react-native';
// eslint-disable-next-line import/no-unresolved
import {RNCamera} from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';

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

export default class Mood4 extends React.Component {
  state = {
    flash: 'off',
    zoom: 0,
    autoFocus: 'on',
    depth: 0,
    type: 'back',
    whiteBalance: 'auto',
    ratio: '16:9',
    recordOptions: {
      mute: false,
      maxDuration: 15,
      quality: RNCamera.Constants.VideoQuality['288p'],
    },
    isRecording: false,
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
    if (this.camera) {
      const promise = await this.camera.takePictureAsync();
      const data = await promise;
      this.handlePicture(data);
      console.warn('takePicture ', data);
    }
  };
  handlePicture(photo) {
    let source = {uri: photo.uri};
    ImageResizer.createResizedImage(photo.uri, 512, 512, 'JPEG', 75)
      .then(photo => {
        // response.uri is the URI of the new image that can now be
        // displayed, uploaded...
        // response.path is the path of the new image
        // response.name is the name of the new image with the extension
        // response.size is the size of the new image

        this.state.thumbnail = photo.uri; // thumbnail path
        this.state.thumbnailName = 'thumbnail.jpg';
        this.state.media = photo.uri;
        this.state.mediaName = 'file.' + photo.uri.split('.').pop();

        this.setState({
          avatarSource: source,
          renderVideo: false,
        });

        this.setState({hasPhoto: true, photoURL: photo.uri});
      });
      .catch(err => {
        console.error(err);
      });
  }

  handleVideo(video) {
    this.state.thumbnail = video.uri; // thumbnail path
    this.state.thumbnailName = 'thumbnail.jpg';
    this.state.media = response.uri;
    this.state.mediaName = 'file.' + video.uri.split('.').pop();

    this.setState({
      avatarSource: source,
      renderVideo: true,
    });

    this.setState({hasPhoto: true, photoURL: video.uri});
  }

  takeVideo = async function() {
    if (this.camera) {
      try {
        const promise = this.camera.recordAsync(this.state.recordOptions);
        this.interval = setInterval(
          () => this.setState(prevState => ({timer: prevState.timer - 1})),
          1000,
        );
        if (promise) {
          this.setState({isRecording: true});
          const data = await promise;
          if (this.state.timer === 1){
            clearInterval(this.interval);
          }
          this.setState({isRecording: false});
          console.warn('takeVideo', data);
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
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        focusDepth={this.state.depth}
        trackingEnabled
        permissionDialogTitle={'Permission to use camera'}
        permissionDialogMessage={
          'We need your permission to use your camera phone'
        }>
        <View
          style={{
            flex: 0.5,
          }}>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={this.toggleFacing.bind(this)}>
              <Text style={styles.flipText}> Front/Rear </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={this.toggleFlash.bind(this)}>
              <Text style={styles.flipText}> Flash: {this.state.flash} </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={this.toggleWB.bind(this)}>
              <Text style={styles.flipText}>
                {' '}
                White: {this.state.whiteBalance}{' '}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
          />
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            alignSelf: 'flex-end',
          }}>
          <Slider
            style={{width: 150, marginTop: 15, alignSelf: 'flex-end'}}
            onValueChange={this.setFocusDepth.bind(this)}
            step={0.1}
            disabled={this.state.autoFocus === 'on'}
          />
        </View>

        {this.state.zoom !== 0 && (
          <Text style={[styles.flipText, styles.zoomText]}>
            Zoom: {this.state.zoom}
          </Text>
        )}

        {this.renderPhotoVideoOption()}

      </RNCamera>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
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
                        // source={{uri:
                        // 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4'}}
                        source={{uri: this.state.photoURL}} // Can be a URL
                        // or a local
                        // file.
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

        </View>

        <View style={styles.container}>{this.renderCamera()}</View>

            </View>);


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
          style={[styles.flipButton, {flex: 0.25, alignSelf: 'flex-end'}]}
          onPress={this.toggleFocus.bind(this)}>
          <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[{flex: 0.3, alignSelf: 'flex-end'}]}
          onPress={this.takePicture.bind(this)}
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

  renderVideoOption() {
    return (
      <View
        style={{
          flex: 0.1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          style={[
            styles.flipButton,
            {
              flex: 0.3,
              alignSelf: 'flex-end',
              backgroundColor: this.state.isRecording ? 'white' : 'darkred',
            },
          ]}
          onPress={
            this.state.isRecording ? () => {} : this.takeVideo.bind(this)
          }>
          {this.state.isRecording ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <Text> {this.state.timer} </Text>
            </View>
          ) : (
            <Text style={styles.flipText}> Video </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
  renderPhotoOption2() {
    return (
      <View
        style={{
          flex: 0.1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
          alignSelf: 'flex-end',
        }}>
        <TouchableOpacity
          style={[styles.flipButton, {flex: 0.25, alignSelf: 'flex-end'}]}
          onPress={this.toggleFocus.bind(this)}>
          <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.flipButton,
            styles.picButton,
            {flex: 0.3, alignSelf: 'flex-end'},
          ]}
          onPress={this.takePicture.bind(this)}>
          <Text style={styles.flipText}> Photo </Text>
        </TouchableOpacity>
      </View>
    );
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
