import React, {Component} from 'react';
import {
  Animated,
  Alert,
  View,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Text,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import LinearGradient from 'react-native-linear-gradient';

import {Spinner, Card} from './common';
import {Button} from 'react-native-elements';
import {Icon} from 'react-native-elements';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import MapView from 'react-native-maps';
import NearbyUser from './NearbyUser';
import {sendShake} from '../actions';
import {showLocation} from 'react-native-map-link';
var globalStyles = require('../Styles');
import Modal from 'react-native-modal';

const deviceWidth = Dimensions.get('window').width;
const FIXED_BAR_WIDTH = 100;
const BAR_SPACE = 2;

function prettyDistance(distance) {
  return distance > 1
    ? distance.toFixed(1) + 'km'
    : (distance * 1000).toFixed(0) + 'm';
}
let images = [
  'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg',
  'https://drop.ndtv.com/albums/COOKS/chicken-dinner/chickendinner_640x480.jpg',
  'https://travel.home.sndimg.com/content/dam/images/travel/fullset/2014/07/20/32/food-paradise-102-ss-001.rend.hgtvcom.966.544.suffix/1491584380240.jpeg',
];

class NearbyRestaurantDetail extends Component {
  state = {
    inviteShakers: false,
    shakerArray: [],
    isVisible: false,
    modalTitle: '',
    modalButton: '',
    modalDescription: '',
  };

  componentWillMount() {
    StatusBar.setHidden(true);
  }
  onBackButtonPress() {
    Actions.pop();
  }

  onShakerSelection(nearbyUser, selected) {
    if (selected) {
      this.state.shakerArray.push(nearbyUser.user._id);
    } else {
      this.state.shakerArray = this.state.shakerArray.filter(
        e => e !== nearbyUser.user._id,
      );
    }
  }

  tryAgain() {
    this.setState({isVisible: false});
    Actions.popTo('nearby');
  }

  onButtonPress() {
    const {user} = this.props;

    if (this.state.shakerArray.length == 0) {
      return;
    }

    this.props.sendShake(
      false,
      this.props.user,
      this.state.shakerArray,
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
      this.props.restaurant.id,
    );

    this.setState({inviteShakers: false});
    // Actions.popTo('nearby');
  }

  numItems = images.length;
  itemWidth = FIXED_BAR_WIDTH / this.numItems - (this.numItems - 1) * BAR_SPACE;
  animVal = new Animated.Value(0);

  render() {
    const {name, thumb} = this.props.restaurant;
    const {aggregate_rating, votes} = this.props.restaurant.user_rating;
    const {
      address,
      latitude,
      longitude,
      distance,
    } = this.props.restaurant.location;

    if (this.state.inviteShakers) {
      return (
        <View style={globalStyles.container}>
          <ScrollView
            style={[globalStyles.container, {backgroundColor: 'white'}]}>
            <View style={{height: '100%', paddingTop: 42}}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '700',
                  letterSpacing: 0.3,
                  paddingLeft: 36,
                }}>
                Select the shakers
              </Text>
              <FlatList
                data={this.props.nearbyList}
                keyExtractor={(x, i) => i.toString()}
                renderItem={({item}) => (
                  <NearbyUser
                    callbackShakers={this.onShakerSelection.bind(this)}
                    nearbyUser={item}
                    nearby={true}
                  />
                )}
              />
            </View>
          </ScrollView>

          <View
            style={{
              marginTop: 26,
              marginLeft: 36,
              marginRight: 36,
              flexDirection: 'column',
            }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                marginBottom: 36,
                marginTop: 42,
              }}>
              <TouchableOpacity
                onPress={this.onButtonPress.bind(this)}
                style={{
                  height: 50,
                  backgroundColor: '#62cfb9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                }}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Invite
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    images = [thumb];

    if (images[0] != '') {
    } else {
      // Imagem do zomato - não vem nenhuma thumb na API

      images = ['https://preview.ibb.co/ndBwUd/shake_empty.jpg'];
    }

    let imageArray = [];
    let barArray = [];
    images.forEach((image, i) => {
      console.log(image, i);
      const thisImage = (
        <Image
          key={`image${i}`}
          source={{uri: image}}
          style={{width: deviceWidth}}
        />
      );

      imageArray.push(thisImage);

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
    });

    return (
      <View style={{flex: 1}}>
        {/* Error modal */}
        <Modal
          backdropOpacity={0}
          style={{alignItems: 'center'}}
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({isVisible: false})}>
          <View
            style={{
              width: 300,
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

        <View
          style={styles.container}
          // flex={1}
        >
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

          {/* --> Back Button */}
          <View style={{left: 0, top: 0, position: 'absolute'}}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0.5)', 'transparent']}
              style={{height: 100, width: '100%'}}>
              <TouchableOpacity
                style={styles.topBackButton}
                onPress={this.onBackButtonPress.bind(this)}>
                <Icon
                  name="arrow-back"
                  type="ionicons"
                  color="white"
                  size={35}
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {/* <-- Back Button */}

          {/* <View
            style={styles.barContainer}
          >
            {barArray}
          </View> */}
        </View>

        {/* --> Restaurant Detail */}
        <View style={{flex: 2}}>
          <ScrollView style={{flex: 2, backgroundColor: 'white'}}>
            <View
              style={{
                marginTop: 26,
                marginLeft: 36,
                marginRight: 36,
                flexDirection: 'column',
              }}>
              <Text
                style={{fontSize: 32, fontWeight: '700', letterSpacing: -0.5}}>
                {name}
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <IconAwesome name="map-marker" color="#b1b1b1" size={17} />

                <Text style={{color: '#b1b1b1', fontSize: 14, paddingLeft: 5}}>
                  {prettyDistance(distance)}
                </Text>

                <StarRating
                  disabled={false}
                  maxStars={5}
                  rating={parseInt(aggregate_rating)}
                  starSize={15}
                  fullStarColor={'#ffcb44'}
                  emptyStarColor={'#ffcb44'}
                  disabled={true}
                  containerStyle={{
                    justifyContent: 'flex-start',
                    paddingTop: 2,
                    paddingLeft: 5,
                  }}
                  // selectedStar={(rating) => this.onStarRatingPress(rating)}
                />

                <Text
                  style={{
                    color: '#b1b1b1',
                    fontSize: 14,
                    paddingLeft: 5,
                    paddingTop: 2,
                  }}>
                  ({votes})
                </Text>
              </View>

              <Text style={{fontSize: 15, fontWeight: '500', color: '#b1b1b1'}}>
                {address}
              </Text>

              <TouchableOpacity
                style={{marginTop: 25, height: 143, width: '100%'}}
                onPress={() =>
                  showLocation({
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                    //sourceLatitude: -8.0870631,  // optional
                    //sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                    title: name, // optional
                    googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
                    //googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                    // app: 'uber'  // optionally specify specific app to use
                  })
                }>
                {
                  <MapView
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 8,
                      shadowOpacity: 0.1,
                      shadowColor: 'rgb(36, 100, 193)',
                      shadowOffset: {width: 4, height: 2},
                    }}
                    initialRegion={{
                      latitude: parseFloat(latitude),
                      longitude: parseFloat(longitude),
                      latitudeDelta: 0.0922,
                      longitudeDelta: 0.0421,
                    }}>
                    <MapView.Marker
                      coordinate={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                      }}
                    />
                  </MapView>
                }
              </TouchableOpacity>

              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  marginBottom: 36,
                  marginTop: 42,
                }}>
                <TouchableOpacity
                  onPress={() =>
                    this.props.callback
                      ? this.props.callback(this.props.restaurant.id)
                      : this.setState({inviteShakers: true})
                  }
                  style={{
                    height: 50,
                    backgroundColor: '#62cfb9',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 8,
                    shadowOpacity: 0.1,
                    shadowColor: 'rgb(36, 100, 193)',
                    shadowOffset: {width: 4, height: 2},
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      letterSpacing: -0.2,
                      fontSize: 18,
                      fontWeight: '600',
                    }}>
                    Invite
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
        {/* <-- Restaurant Detail */}
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
    bottom: 20,
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
)(NearbyRestaurantDetail);
