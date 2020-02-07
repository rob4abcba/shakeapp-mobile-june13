import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import NearbyUserDetail from './NearbyUserDetail';

import CardStack, {Card} from 'react-native-card-stack-swiper';

// RL type argument {} can only be used in a .ts file
// export default class UserSwiper2 extends Component<{}> {
export default class UserSwiper2 extends Component {  
  render() {
    return (
      <View style={{flex: 1}}>
        <CardStack
          // RL styles.content does not seem to exist
          // style={styles.content}
          style={styles.container}
          renderNoMoreCards={() => (
            <Text style={{fontWeight: '700', fontSize: 18, color: 'gray'}}>
              No more cards :(
            </Text>
          )}
          ref={swiper => {
            this.swiper = swiper;
          }}
          // RL Temporarily replace our code with example react-native-card-stack-swiper code
          // onSwiped={() => console.log('onSwiped')}
          // onSwipedLeft={() => console.log('onSwipedLeft')}
          >
          {/* {this.addCard2()} */}
          <Card style={[styles.card, styles.card1]}><Text style={styles.label}>A</Text></Card>
    <Card style={[styles.card, styles.card2]}><Text style={styles.label}>B</Text></Card>
    <Card style={[styles.card, styles.card1]}><Text style={styles.label}>C</Text></Card>
        </CardStack>

        {/* <CardStack ref={swiper => { this.swiper = swiper }}>
    <Card style={[styles.card, styles.card1]}><Text style={styles.label}>A</Text></Card>
    <Card style={[styles.card, styles.card2]}><Text style={styles.label}>B</Text></Card>
    <Card style={[styles.card, styles.card1]}><Text style={styles.label}>C</Text></Card>
  </CardStack> */}

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.red]}
              onPress={() => {
                this.swiper.swipeLeft();
              }}>
                <Text>swipeLeft</Text>
              <Image
                source={require('../assets/red.png')}
                // source={require('../assets/cook.png')}
                resizeMode={'contain'}
                style={{height: 62, width: 62}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.orange]}
              onPress={() => {
                this.swiper.goBackFromTop();
              }}>
                <Text>goBackFromTop</Text>
              <Image
                source={require('../assets/back.png')}
                // source={require('../assets/drinks.png')}
                resizeMode={'contain'}
                style={{height: 32, width: 32, borderRadius: 5}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.green]}
              onPress={() => {
                this.swiper.swipeRight();
              }}>
                <Text>swipeRight</Text>
              <Image
                source={require('../assets/green.png')}
                // source={require('../assets/seafood.png')}
                resizeMode={'contain'}
                style={{height: 62, width: 62}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  addCard = () => {
    return (
      <View>
        {this.props.nearbyUsers &&
          this.props.nearbyUsers.map((user, index) => (
            // RL Cannot have exactly one card or you will get TypeError null is
            // RL How add console.log inside JSX?
            <Card style={[styles.card, styles.card1]}>
              <NearbyUserDetail nearbyUser={user} nearby={true} />
            </Card>
          ))}
      </View>
    );
  };
  // RL Added addCard2 as a test.  Try addCard2 vs. addCard.
  addCard2 = () => {
    return (
      <View>
            <Card style={styles.card}>
              <View><Text>Dummy Text</Text></View> 
            </Card>

      </View>
    );
  };




}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f2f2f2',
  },
  card: {
    flex: 1,
    position: 'absolute',
    width: 320,
    height: 270,
    backgroundColor: '#FE474C',
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.5)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
  },
  card1: {
    backgroundColor: '#FE474C',
  },
  card2: {
    backgroundColor: '#FEB12C',
  },
  label: {
    lineHeight: 400,
    textAlign: 'center',
    fontSize: 55,
    fontFamily: 'System',
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
  footer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: 220,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  orange: {
    width: 55,
    height: 55,
    borderWidth: 6,
    borderColor: 'rgb(246,190,66)',
    borderWidth: 4,
    borderRadius: 55,
    marginTop: -15,
  },
  green: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 75,
    borderWidth: 6,
    borderColor: '#01df8a',
  },
  red: {
    width: 75,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 75,
    borderWidth: 6,
    borderColor: '#fd267d',
  },
});
