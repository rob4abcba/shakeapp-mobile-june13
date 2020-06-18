import React, {Component} from 'react';
import {
  Animated,
  Geolocation,
  Alert,
  View,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import {AsyncStorage} from 'react-native';

import {Spinner, Card} from './common';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import MapView from 'react-native-maps';
import NearbyUser from './NearbyUser';
import {sendShake} from '../actions';
import {showLocation} from 'react-native-map-link';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
var globalStyles = require('../Styles');

const deviceWidth = Dimensions.get('window').width;
const FIXED_BAR_WIDTH = 100;
const BAR_SPACE = 2;

function prettyDistance(distance) {
  return distance > 1
    ? distance.toFixed(1) + 'km'
    : (distance * 1000).toFixed(0) + 'm';
}

// Onboarding content
let images = [
  'https://i.ibb.co/qkK8cxR/cook-and-barman-png.png',
  'https://image.ibb.co/nOp9N8/mood.png',
  // 'https://i.ibb.co/VwYPQNR/SHAKESHAKEPI-AS.jpg',
  'https://shakeapp-backend.s3.eu-central-1.amazonaws.com/assets/ManAndWomanTogether.png',
];

let titles = ['Welcome', 'Set your Mood', 'Share experiences'];

// let descriptions = [
//   'Discover new restaurants & friends\neveryday with Shake',
//   "Share with others your morning hair\nor today's smile",
//   'Great food & drinks are great on its own, but\nwith great company is even better.\nExperience\nthe world one plate/drink at a time.',
// ];

let descriptions = [
  'Set your preferences',
  "Share with others your morning hair\nor today's smile",
  'Make new friends, everywhere!',
];

class Onboarding extends Component {
  componentWillMount() {
    this.getData();
    StatusBar.setHidden(true);
  }

  state = {
    waiting: true,
    done: false,
  };

  onBackButtonPress() {
    Actions.pop();
  }

  numItems = images.length;
  itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  storeData = async () => {
    try {
      await AsyncStorage.setItem('@MySuperStore:onboarding', 'done');
    } catch (error) {
      // Error saving data
    }
  };
  async getData() {
    try {
      const value = await AsyncStorage.getItem('@MySuperStore:onboarding');
      if (value) {
        this.setState({done: true, waiting: false});
      } else {
        this.setState({done: false, waiting: false});
      }
    } catch (error) {
      console.log('Error retrieving data' + error);
      this.setState({done: false, waiting: false});
    }
  }

  skip() {
    this.storeData();
      request(PERMISSIONS.IOS.LOCATION_ALWAYS)
          .then((result) => {
              switch (result) {
                  case RESULTS.UNAVAILABLE:
                      Actions.login();
                      break;
                  case RESULTS.DENIED:
                      Actions.login();
                      break;
                  case RESULTS.GRANTED:
                      Actions.login();
                      break;
                  case RESULTS.BLOCKED:
                      Actions.login();
                      break;
              }
          })
          .catch((error) => {
              console.log(error)
              Actions.login();
          });
  }

  render() {
    if (this.state.done) {
      Actions.login();
    }

    if (this.state.waiting) {
      return <View style={{flex: 1, width: deviceWidth, paddingTop: 40}} />;
    }

    // Initialize arrays that will be rendered
    let imageArray = [];
    let barArray = [];
    let titleArray = [];
    let descriptionArray = [];

    // For every image link
    images.forEach((image, i) => {
      // Let's render an Image component // aqui
      const thisImage = (
        <View style={{flex: 1, width: deviceWidth, paddingTop: 40}}>
          <Image
            key={`image${i}`}
            source={{uri: image}}
            style={{height: 300, resizeMode: 'contain'}}
          />

          <Text
            key={`title${i}`}
            style={{
              textAlign: 'center',
              fontSize: 32,
              fontWeight: '700',
              paddingTop: 20,
            }}>
            {titles[i]}
          </Text>

          <Text
            key={`description${i}`}
            style={{
              textAlign: 'center',
              fontSize: 15,
              fontWeight: '600',
              paddingTop: 10,
            }}>
            {descriptions[i]}
          </Text>
        </View>
      );

      // And store it inside the array, to be rendered later
      imageArray.push(thisImage);

      // --> For every image, let's add a description
      const thisDescription = (
        <View style={{flex: 1, width: deviceWidth}}>
          <Text
            style={{textAlign: 'center', fontSize: 15, fontWeight: '600'}}
            key={`description${i}`}>
            {descriptions[i]}
          </Text>
        </View>
      );

      descriptionArray.push(thisDescription);
      // <-- For every image, let's add a description

      // --> Scroll bar
      const scrollBarVal = this.animVal.interpolate({
        inputRange: [deviceWidth * (i - 1), deviceWidth * (i + 1)],
        outputRange: [-this.itemWidth, this.itemWidth],
        extrapolate: 'clamp',
      });

      const thisBar = (
        <View
          key={`bar${i}`}
          style={[
            styles.track,
            {
              width: this.itemWidth,
              marginLeft: i === 0 ? 0 : BAR_SPACE,
            },
          ]}>
          <Animated.View
            style={[
              styles.bar,
              {
                width: this.itemWidth,
                transform: [{translateX: scrollBarVal}],
              },
            ]}
          />
        </View>
      );

      barArray.push(thisBar);
      // <-- Scroll bar
    });

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* --> Skip Button */}
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
              Shake
            </Text>
          </View>

          <View style={{paddingRight: 29, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={{justifyContent: 'space-between'}}
              onPress={() => this.skip()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                SKIP
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* <-- Skip Button */}

        <View style={styles.container} flex={1}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={10}
            pagingEnabled
            onScroll={Animated.event([
              {nativeEvent: {contentOffset: {x: this.animVal}}},
            ])}>
            {imageArray}
          </ScrollView>

          <View style={styles.barContainer}>{barArray}</View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barContainer: {
    position: 'absolute',
    zIndex: 2,
    bottom: 40,
    flexDirection: 'row',
  },
  track: {
    backgroundColor: '#d2f7ef',
    overflow: 'hidden',
    height: 4,
  },
  bar: {
    backgroundColor: '#62cfb9',
    height: 4,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  topBackButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 20,
    left: 13,
    width: 50,
    height: 50,
  },
});

const mapStateToProps = ({auth, nearby}) => {
  const {user} = auth;
  const {nearbyList} = nearby;
  return {user, nearbyList};
};

export default connect(
  mapStateToProps,
  {sendShake},
)(Onboarding);
