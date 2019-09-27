import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import NearbyUserDetail from './NearbyUserDetail';

import CardStack, {Card} from 'react-native-card-stack-swiper';

export default class UserSwiper2 extends Component<{}> {
  render() {
    return (
      <View style={{flex: 1}}>
        <CardStack
          style={styles.content}
          renderNoMoreCards={() => (
            <Text style={{fontWeight: '700', fontSize: 18, color: 'gray'}}>
              No more cards :(
            </Text>
          )}
          ref={swiper => {
            this.swiper = swiper;
          }}
          onSwiped={() => console.log('onSwiped')}
          onSwipedLeft={() => console.log('onSwipedLeft')}>
          {this.addCard()}
        </CardStack>

        <View style={styles.footer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.red]}
              onPress={() => {
                this.swiper.swipeBottom();
              }}>
              <Image
                source={require('../assets/red.png')}
                resizeMode={'contain'}
                style={{height: 62, width: 62}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.orange]}
              onPress={() => {
                this.swiper.goBackFromBottom();
              }}>
              <Image
                source={require('../assets/back.png')}
                resizeMode={'contain'}
                style={{height: 32, width: 32, borderRadius: 5}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.green]}
              onPress={() => {
                this.swiper.swipeTop();
              }}>
              <Image
                source={require('../assets/green.png')}
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
            <Card style={[styles.card, styles.card1]}>
              <NearbyUserDetail nearbyUser={user} nearby={true} />
            </Card>
          ))}
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
