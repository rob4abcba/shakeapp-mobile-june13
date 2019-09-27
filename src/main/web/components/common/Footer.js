// Import libraries for making a component
import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {Icon, Badge} from 'react-native-elements';

const Footer = ({photoURL, notificationCount}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 45,
        backgroundColor: '#62cfb9',
      }}>
      <TouchableOpacity
        style={{marginLeft: 20, height: 45, width: 47}}
        onPress={() => Actions.mood()}>
        <View
          style={{
            height: 45,
            width: 45,
            borderRadius: 22,
            backgroundColor: 'white',
            borderWidth: 2,
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
              source={require('../../assets/avatar.jpg')}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0)',
              }}
            />
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={{marginRight: 20, height: 45, width: 47}}
        onPress={() => Actions.myActivity({route: 0})}>
        <Image
          source={require('../../assets/shake-logo-transparent.png')}
          style={{height: 44, width: 35}}
          resizeMode={'contain'}
        />

        {notificationCount > 0 ? (
          <View style={{position: 'absolute', overflow: 'visible'}}>
            <Badge
              value={notificationCount}
              textStyle={{color: 'white'}}
              containerStyle={{backgroundColor: '#000'}}
            />
          </View>
        ) : (
          false
        )}
      </TouchableOpacity>
    </View>
  );
};

export {Footer};
