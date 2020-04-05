import React, {Component} from 'react';
import {
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput,
  Text,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styles from './swipe/styles/index.style';
import {scrollInterpolator, animatedStyle} from './swipe/utils/animations';
import NearbyUserDetail from './NearbyUserDetail';
import NearbyRestaurant from './NearbyRestaurant';
import NearbyUserDetail2 from "./NearbyUserDetail2";
import SocketIOClient from "socket.io-client";

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class UserSwiper extends Component {
  constructor(props) {
    super(props);
      this.socket = SocketIOClient('http://localhost:8000');
      console.log("yesssssss");
    this.state = {
      nearbyUsers: props.nearbyUsers,
    };
  }

  state = {
    invite: false,
    //Report Abuse or feedback
    report: false,
    nearbyRestaurantList: {},
  };

  onInvite = list => {
    this.setState({invite: true});
    this.setState({nearbyRestaurantList: list});
  };
  skipInvite() {
    this.setState({invite: false});
  }
  ListEmpty = () => {
    return (
      //View to show when list is empty
      <View>
        <Text style={{ textAlign: 'center' }}>No Data Found</Text>
      </View>
    );
  };
  
  renderNearbyUserDetail = ({item, index}) => {
    return (
        <View style={{flex: 1}}>
        <NearbyUserDetail2
            conn={this.socket}
          nearbyUser={item}
          nearby={true}
          onInvite={this.onInvite.bind(this)}
          skipInvite={this.skipInvite.bind(this)}
        />
      </View>
    );
  };

  renderCarousel() {
    return (
      <View style={[styles.container, styles.containerLight]}>
        <Carousel
          data={this.state.nearbyUsers}
          renderItem={this.renderNearbyUserDetail.bind(this)}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth}
          sliderHeight={viewportHeight - 45}
          itemHeight={viewportHeight - 45}
          slideStyle={{width: viewportWidth, height: viewportHeight - 45}}
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          scrollInterpolator={scrollInterpolator}
          slideInterpolatedStyle={animatedStyle}
          vertical={false}
        />
      </View>
    );
  }

  render() {
    console.log("Inside render of UserSwiper.js")
    if (this.state.invite) {
      return this.nearByResturants();
    } else if (this.state.report) {
      return this.reportOptions();
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>{this.renderCarousel()}</View>
      </SafeAreaView>
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
            Choose the restaurant (UserSwiper.js > nearByResturants() > ScrollView)
          </Text>

          <FlatList
            data={this.state.nearbyRestaurantList}
            ListEmptyComponent={this.ListEmpty}
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
        this.props.onInvite(this.props.nearbyRestaurantList);
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
