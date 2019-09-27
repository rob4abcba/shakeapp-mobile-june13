import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import {TabViewAnimated, SceneMap} from 'react-native-tab-view';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';
import MapView from 'react-native-maps';
import {showLocation} from 'react-native-map-link';
import {onSendMessage, onBlockShake} from '../actions';
import {GiftedChat, Bubble, Time} from 'react-native-gifted-chat';

var stylesGlobal = require('../Styles');
const deviceWidth = Dimensions.get('window').width;

class ChatConversation extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    ourID: null,
  };

  getMappedMessages = () => {
    var array = [];
    if (
      this.props.conversations[this.props.friend._id] &&
      this.props.conversations[this.props.friend._id].length > 0
    ) {
      Object.keys(this.props.conversations[this.props.friend._id]).forEach(
        function(key, index) {
          var element = this.props.conversations[this.props.friend._id][key];

          var photo = require('../assets/avatar.jpg');

          var name = this.props.friend.fullName;
          if (element.senderID != this.props.friend._id) {
            if (this.props.data.mood.photoURL) {
              photo = this.props.data.mood.photoURL;
            }
            name = 'You';
            this.state.ourID = element.senderID;
          } else {
            if (this.props.friend.photoURL) {
              photo = this.props.friend.photoURL;
            }
          }

          array.push({
            _id: element.date,
            text: element.message,
            createdAt: element.date,
            user: {
              _id: element.senderID,
              name: name,
              avatar: photo,
            },
            restaurant: element.restaurant,
          });
        },
        this,
      );
    }
    return array.reverse();
  };
  _onSend = message => {
    const {user, onSendMessage} = this.props;
    this.props.socket.emit('message', {
      message: message[0].text,
      token: this.props.user,
      receiverID: this.props.friend._id,
    });
    const newMessage = {
      date: message[0].createdAt,
      message: message[0].text,
      isRead: false,
      senderID: this.props.data._id,
    };
    this.props.onSendMessage(this.props.friend._id, newMessage); // The conversation ID is who we're speaking with
  };

  componentWillMount() {}

  getRestaurantImage(thumb) {
    if (thumb) {
      return (
        <Image
          source={{uri: thumb}}
          style={{
            width: '100%',
            height: 120,
            marginBottom: 10,
            backgroundColor: 'white',
          }}
        />
      );
    } else {
      return (
        <Image
          source={require('../assets/shake-empty.jpg')}
          style={{
            width: '100%',
            height: 120,
            marginBottom: 10,
            backgroundColor: 'white',
          }}
        />
      );
    }
  }

  renderRestaurantBubble(props) {
    console.log('SOURCE.URI: ' + props.currentMessage.restaurant.thumb);
    return (
      /*  <View>
                 {props.currentMessage.user.name == "You" ?
                     <Text>{"You invited " + this.props.friend.fullName + " to " + props.currentMessage.restaurant.name}</Text>
                     :
                     <Text>{props.currentMessage.user.name + " invited you to " + props.currentMessage.restaurant.name}</Text>
                 }
                 <Text>{props.currentMessage.restaurant.name}</Text>
                 <Text>{props.currentMessage.restaurant.location.address}</Text>
                 <Image style={{ width: 150, height: 150 }} source={{ uri: props.currentMessage.restaurant.thumb }}></Image>
             </View> */

      <View
        style={{
          width: deviceWidth - deviceWidth / 5, // to be changed?
          marginTop: 10,
          marginLeft: 0,
          marginRight: 0,
          flexDirection: 'column',
        }}>
        {props.currentMessage.user.name == 'You' ? (
          <Text
            style={{
              color: '#b1b1b1',
              alignSelf: 'flex-end',
              paddingRight: 15,
              paddingBottom: 15,
            }}>
            {'You invited ' +
              this.props.friend.fullName +
              ' to ' +
              props.currentMessage.restaurant.name}
          </Text>
        ) : (
          <Text
            style={{
              color: '#b1b1b1',
              alignSelf: 'flex-end',
              paddingRight: 15,
              paddingBottom: 15,
            }}>
            {props.currentMessage.user.name +
              ' invited you to ' +
              props.currentMessage.restaurant.name}
            :
          </Text>
        )}

        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 8,
            shadowOpacity: 0.2,
            shadowColor: 'rgb(36, 100, 193)',
            shadowOffset: {width: 0, height: 2},
            elevation: 1,
          }}>
          <View
            style={{
              overflow: 'hidden', // with this prop, only 2 corners get rounded because they are impacted by the view style
              borderRadius: 8,
            }}>
            {/* <Image
                      style={{ width: "100%", height: 120, marginBottom: 10 }}
                      source={{ uri: props.currentMessage.restaurant.thumb }}>
                    </Image> */}

            {this.getRestaurantImage(props.currentMessage.restaurant.thumb)}

            <Text
              style={{
                fontSize: 20,
                fontWeight: '700',
                marginLeft: 15,
                letterSpacing: -0.5,
              }}>
              {props.currentMessage.restaurant.name}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: 10,
              }}>
              <StarRating
                disabled={false}
                maxStars={5}
                rating={parseInt(
                  props.currentMessage.restaurant.user_rating.aggregate_rating,
                )}
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
                ({props.currentMessage.restaurant.user_rating.votes})
              </Text>
            </View>

            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: '#b1b1b1',
                marginLeft: 15,
              }}>
              {props.currentMessage.restaurant.location.address}
            </Text>

            <TouchableOpacity
              style={{marginTop: 15, height: 143, width: '100%'}}
              onPress={() =>
                showLocation({
                  latitude: props.currentMessage.restaurant.location.latitude,
                  longitude: props.currentMessage.restaurant.location.longitude,
                  //sourceLatitude: -8.0870631,  // optional
                  //sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                  title: props.currentMessage.restaurant.name, // optional
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
                    // shadowOpacity: 0.1, shadowColor: 'rgb(36, 100, 193)', shadowOffset: { width: 4, height: 2 }
                  }}
                  initialRegion={{
                    latitude: parseFloat(
                      props.currentMessage.restaurant.location.latitude,
                    ),
                    longitude: parseFloat(
                      props.currentMessage.restaurant.location.longitude,
                    ),
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}>
                  <MapView.Marker
                    coordinate={{
                      latitude: parseFloat(
                        props.currentMessage.restaurant.location.latitude,
                      ),
                      longitude: parseFloat(
                        props.currentMessage.restaurant.location.longitude,
                      ),
                    }}
                  />
                </MapView>
              }
            </TouchableOpacity>
          </View>
        </View>

        <View style={{marginBottom: 10}} />
      </View>
    );
  }

  onBackButtonPress() {
    Actions.popTo('myActivity');
  }

  onBlockButtonPress() {
    const {user} = this.props;

    //TODO: block
    this.props.friend.blocked = true;
    this.props.onBlockShake(
      this.props.user,
      this.props.data.phone,
      this.props.friend.userID,
      this,
      function(success, thisRef) {
        if (!success) {
          thisRef.setState({
            modalTitle: 'Error',
            modalDescription: 'Not able to complete request.',
            modalButton: 'Try again',
            isVisible: true,
          });
        } else {
          thisRef.setState({
            modalTitle: 'Request completed!',
            modalDescription: 'Your request were\nsuccessfully sent.',
            modalButton: 'Go Back',
            isVisible: true,
          });
        }
      },
    );

    //goto previoud page
    Actions.myActivity({route: 1});
  }
  render() {
    var photoURL = this.props.friend.photoURL;

    return (
      <View style={{flex: 1, backgroundColor: '#FDFDFE'}}>
        <View
          style={{
            height: 92,
            alignItems: 'flex-start',
            backgroundColor: '#62cfb9',
          }}>
          <TouchableOpacity
            style={stylesGlobal.topBackButton}
            onPress={this.onBackButtonPress.bind(this)}>
            <Icon name="arrow-back" type="ionicons" color="white" size={35} />
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              marginLeft: 74,
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
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              ) : (
                <Image
                  source={require('../assets/avatar.jpg')}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              )}
            </View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                letterSpacing: 0.4,
                color: 'white',
                paddingLeft: 13,
              }}>
              {this.props.friend.fullName}
            </Text>

            <TouchableOpacity onPress={this.onBlockButtonPress.bind(this)}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '300',
                  letterSpacing: 0.4,
                  color: 'white',
                  paddingLeft: 50,
                }}>
                Block
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <GiftedChat
          messages={this.getMappedMessages()}
          onSend={this._onSend}
          user={{_id: this.state.ourID}}
          showUserAvatar={true}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  left: {
                    color: 'black',
                  },
                  right: {
                    color: 'black',
                  },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: 'white',
                  },
                  right: {
                    backgroundColor: 'white',
                  },
                }}
              />
            );
          }}
          renderCustomView={props => {
            return props.currentMessage.restaurant ? (
              this.renderRestaurantBubble(props)
            ) : (
              <View />
            );
          }}
          renderTime={props => {
            return (
              <Time
                {...props}
                textStyle={{
                  color: 'red',
                }}
              />
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});

const mapStateToProps = ({nearby, auth, profile}) => {
  const {user} = auth;
  const {shaking} = nearby;
  const {data} = profile;
  const {conversations} = auth;

  return {user, shaking, conversations, data};
};
export default connect(
  mapStateToProps,
  {onSendMessage, onBlockShake},
)(ChatConversation);
