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
  Image,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import styles from './swipe/styles/index.style';
import {scrollInterpolator, animatedStyle} from './swipe/utils/animations';
import NearbyUserDetail from './NearbyUserDetail';
import NearbyRestaurant from './NearbyRestaurant';
import NearbyUserDetail2 from './NearbyUserDetail2';
import SocketIOClient from 'socket.io-client';
import {Actions} from 'react-native-router-flux';
import {Badge} from 'react-native-elements';
import RNShake from 'react-native-shake';

// Need profileFetch from DrawerContent.js amazingCircle?
import {socialAccountsFetch, profileFetch} from '../actions';
import DrawerContent from './DrawerContent';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');

export default class UserSwiper extends Component {
  constructor(props) {
    super(props);
    // this.socket = SocketIOClient('http://localhost:8001');
    // this.socket = SocketIOClient('http://50.18.1.14:8001/node_app'); //MC: Do NOT add node_app
    // this.socket = SocketIOClient('http://18.144.176.174:8001'); //MC: NonElastic WORKS!!
    this.socket = SocketIOClient('http://54.176.181.106:8001'); //MC: Elastic IP works also!!

    console.log('UserSwiper.js> constructor(props)');
    // console.log("UserSwiper.js> constructor(props):  PROPS PROPS BABY.  VANILLA PROPS PROPS BABY", props);

    // this.state = {
    //   nearbyUsers: props.nearbyUsers, // Should NOT set state to props
    // };

  }

  state = {
    invite: false,
    //Report Abuse or feedback
    report: false,
    nearbyRestaurantList: {},
  };

  componentWillMount() {
    RNShake.addEventListener('ShakeEvent', () => {
      this._carousel.snapToNext();
    });
  }

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
        <Text style={{textAlign: 'center'}}>No Data Found</Text>
      </View>
    );
  };

  // componentWillMount() {
  //   // fetch data do profile
  //   this.props.profileFetch(this.props.user);
  // }

  // amazingCircle(user) {
  //   var colors = [];
  //   var preferences = user.preferences;
  //   if (preferences) {
  //     if (preferences.meat) {
  //       colors.push('#d94f4f');
  //     }
  //     if (preferences.veggie) {
  //       colors.push('#62c769');
  //     }
  //     if (preferences.drinks) {
  //       colors.push('#f7cc02');
  //     }
  //     if (preferences.seaFood) {
  //       colors.push('#6ec7ec');
  //     }
  //   }

  //   if (colors.length == 3) {
  //     return (
  //       <View
  //         style={{
  //           height: 108,
  //           width: 108,
  //           borderRadius: 54,
  //           backgroundColor: 'white',
  //           borderWidth: 4,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderColor: '#b1b1b1',
  //         }}>
  //         <Image
  //           style={{
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[0],
  //           }}
  //           source={require('../assets/circle_3.png')}
  //         />
  //         <Image
  //           style={{
  //             transform: [{rotate: '120deg'}],
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[1],
  //             opacity: 1,
  //           }}
  //           source={require('../assets/circle_3.png')}
  //         />
  //         <Image
  //           style={{
  //             transform: [{rotate: '240deg'}],
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[2],
  //             opacity: 1,
  //           }}
  //           source={require('../assets/circle_3.png')}
  //         />

  //         <Image
  //           style={{
  //             position: 'absolute',
  //             height: 100,
  //             width: 100,
  //             borderRadius: 50,
  //             backgroundColor: 'white',
  //           }}
  //         />

  //         {user.photoURL ? (
  //           <Image
  //             source={{uri: user.photoURL}}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         ) : (
  //           <Image
  //             source={require('../assets/avatar.jpg')}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         )}

  //       </View>
  //     );
  //   } else if (colors.length == 4) {
  //     return (
  //       <View
  //         style={{
  //           height: 108,
  //           width: 108,
  //           borderRadius: 54,
  //           backgroundColor: 'white',
  //           borderWidth: 4,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderColor: '#b1b1b1',
  //         }}>
  //         <Image
  //           style={{
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[0],
  //           }}
  //           source={require('../assets/circle_4.png')}
  //         />
  //         <Image
  //           style={{
  //             transform: [{rotate: '90deg'}],
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[1],
  //             opacity: 1,
  //           }}
  //           source={require('../assets/circle_4.png')}
  //         />
  //         <Image
  //           style={{
  //             transform: [{rotate: '180deg'}],
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[2],
  //             opacity: 1,
  //           }}
  //           source={require('../assets/circle_4.png')}
  //         />
  //         <Image
  //           style={{
  //             transform: [{rotate: '270deg'}],
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[3],
  //             opacity: 1,
  //           }}
  //           source={require('../assets/circle_4.png')}
  //         />

  //         <Image
  //           style={{
  //             position: 'absolute',
  //             height: 100,
  //             width: 100,
  //             borderRadius: 50,
  //             backgroundColor: 'white',
  //           }}
  //         />

  //         {user.photoURL ? (
  //           <Image
  //             source={{uri: user.photoURL}}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         ) : (
  //           <Image
  //             source={require('../assets/avatar.jpg')}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         )}
  //       </View>
  //     );
  //   } else if (colors.length == 2) {
  //     return (
  //       <View
  //         style={{
  //           height: 108,
  //           width: 108,
  //           borderRadius: 54,
  //           backgroundColor: 'white',
  //           borderWidth: 4,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderColor: '#b1b1b1',
  //         }}>
  //         <Image
  //           style={{
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[0],
  //           }}
  //           source={require('../assets/circle_2.png')}
  //         />
  //         <Image
  //           style={{
  //             transform: [{rotate: '180deg'}],
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[1],
  //             opacity: 1,
  //           }}
  //           source={require('../assets/circle_2.png')}
  //         />

  //         <Image
  //           style={{
  //             position: 'absolute',
  //             height: 100,
  //             width: 100,
  //             borderRadius: 50,
  //             backgroundColor: 'white',
  //           }}
  //         />

  //         {user.photoURL ? (
  //           <Image
  //             source={{uri: user.photoURL}}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         ) : (
  //           <Image
  //             source={require('../assets/avatar.jpg')}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         )}
  //       </View>
  //     );
  //   } else {
  //     return (
  //       <View
  //         style={{
  //           height: 108,
  //           width: 108,
  //           borderRadius: 54,
  //           backgroundColor: 'white',
  //           borderWidth: 4,
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           borderColor: '#b1b1b1',
  //         }}>
  //         <Image
  //           style={{
  //             flex: 1,
  //             height: 108,
  //             width: 108,
  //             position: 'absolute',
  //             tintColor: colors[0],
  //           }}
  //           source={require('../assets/circle_1.png')}
  //         />

  //         <Image
  //           style={{
  //             position: 'absolute',
  //             height: 100,
  //             width: 100,
  //             borderRadius: 50,
  //             backgroundColor: 'white',
  //           }}
  //         />

  //         {user.photoURL ? (
  //           <Image
  //             source={{uri: user.photoURL}}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         ) : (
  //           <Image
  //             source={require('../assets/avatar.jpg')}
  //             style={{
  //               height: 100,
  //               width: 100,
  //               borderRadius: 50,
  //               backgroundColor: 'rgba(0,0,0,0)',
  //             }}
  //           />
  //         )}
  //       </View>
  //     );
  //   }
  // }

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
          // data={this.state.nearbyUsers}
          data={this.props.nearbyUsers}
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
          removeClippedSubviews={true}
          ref={c => {
            this._carousel = c;
          }}
        />
      </View>
    );
  }

  componentWillUnmount() {
    RNShake.removeEventListener('ShakeEvent');
  }

  render() {
    console.log('Inside render of UserSwiper.js');
    if (this.state.invite) {
      return this.nearByResturants();
    } else if (this.state.report) {
      return this.reportOptions();
    }

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>{this.renderCarousel()}</View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            right: 10,
            marginRight: 20,
            height: 45,
            width: 47,
          }}
          onPress={() => Actions.myActivity({route: 0})}>
          <Image
            // source={require('../assets/shake-logo-transparent.png')}
            source={require('../assets/shake-logo.png')} //black
            // source={require('../assets/symbol_shake_color.png')}
            style={{height: 44, width: 35}}
            resizeMode={'contain'}
            // borderColor={'white'}
            // borderColor={'rgba(255,255,255,0.1)'} //white partially transparent
            // backgroundColor={'white'}
            // backgroundColor= {'rgba(0,0,0,0.7)'} //black partially transparent
            // backgroundColor= {'rgba(255,255,255,0.2)'} //white partially transparent

            // borderWidth={1}
          />

          {this.props.notificationCount > 0 ? (
            <View style={{position: 'absolute', overflow: 'visible'}}>
              <Badge
                value={this.props.notificationCount}
                textStyle={{color: 'white', fontSize: 14}}
                status="error"
                containerStyle={{backgroundColor: 'rgba(0,0,0,0.0)'}}
              />
            </View>
          ) : (
            false
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 60,
            left: 10,
            marginLeft: 20,
            height: 45,
            width: 47,
          }}
          onPress={() => Actions.mood()}>
          <View
            style={{
              height: 45,
              width: 45,
              borderRadius: 22,
              backgroundColor: 'white',
              borderWidth: 2,
              // borderColor: '#b1b1b1',
              borderColor: 'black',
            }}>
            {this.props.photoURL ? (
              <Image
                source={{uri: this.props.photoURL}}
                style={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 20,
                  // backgroundColor: 'rgba(0,0,0,0)',
                  backgroundColor: 'pink',
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

          {/* // {this.amazingCircle(this.props.data)} */}
        </TouchableOpacity>
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
            Choose the restaurant (UserSwiper.js > nearByResturants() >
            ScrollView)
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

// From DrawerContent.js to implement amazingCircle?
// const mapStateToProps = ({auth, profile}) => {
//   const {user} = auth;
//   const {isFetchingProfileData, data} = profile;
//   return {user, isFetchingProfileData, data};
// };

// // export default DrawerContent;
// export default connect(
//   mapStateToProps,
//   {profileFetch},
// )(DrawerContent);
