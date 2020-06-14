import React, {Component} from 'react';
import {Text, TouchableOpacity, View, Image} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Card, CardSection} from './common';
import Icon from 'react-native-vector-icons/FontAwesome';
import StarRating from 'react-native-star-rating';

function prettyDistance(distance) {
  return distance > 1
    ? distance.toFixed(1) + 'km'
    : (distance * 1000).toFixed(0) + 'm';
}

class NearbyRestaurant extends Component {
  onRowPress() {
    Actions.nearbyRestaurantDetail({
      callback: this.props.callback1,
      restaurant: this.props.nearbyRestaurant.restaurant,
    });
  }

  getRestaurantImage(thumb) {
    if (thumb) {
      return (
        <Image
          source={{uri: thumb}}
          style={{
            height: 64,
            width: 64,
            borderRadius: 8,
            backgroundColor: 'white',
          }}
        />
      );
    } else {
      return (
        <Image
          source={require('../assets/shake-empty.jpg')}
          style={{
            height: 64,
            width: 64,
            borderRadius: 8,
            backgroundColor: 'white',
          }}
        />
      );
    }
  }

  render() {
    const {name, thumb} = this.props.nearbyRestaurant.restaurant;
    const {
      aggregate_rating,
      votes,
    } = this.props.nearbyRestaurant.restaurant.user_rating;
    const {distance} = this.props.nearbyRestaurant.restaurant.location;

    return (
      <View style={{marginTop: 18, paddingRight: 60}}>
        <TouchableOpacity
          style={[{flexDirection: 'row', alignItems: 'center'}]}
          onPress={this.onRowPress.bind(this)}>
          <View style={{}}>{this.getRestaurantImage(thumb)}</View>

          <View style={{paddingLeft: 10, justifyContent: 'center'}}>
            <Text
              style={{fontSize: 16, fontWeight: '500', letterSpacing: -0.4}}>
              {name}
            </Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon name="map-marker" color="#b1b1b1" size={17} />
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
                containerStyle={{paddingLeft: 10.5}}
                // selectedStar={(rating) => this.onStarRatingPress(rating)}
              />

              <Text style={{color: '#b1b1b1', fontSize: 14, paddingLeft: 5}}>
                ({votes})
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = {
  container: {
    height: 180,
    width: 160,
    backgroundColor: 'white',
    borderRadius: 8,
    marginRight: 20,
    elevation: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#f4f4f4',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
  },
  profilePicture: {
    height: 60,
    flex: 1,
    width: null,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
  },
  name: {
    fontSize: 23,
  },
};

export default NearbyRestaurant;
