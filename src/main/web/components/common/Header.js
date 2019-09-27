// Import libraries for making a component
import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';

var styles = require('../../Styles');

// Make a component
const Header = props => {
  return (
    <View style={{flex: 0.1, backgroundColor: 'red'}}>
      <TouchableOpacity
        style={styles.topBackButton}
        onPress={() => Actions.pop()}>
        <Icon name="chevron-left" type="evilicon" color="#484848" size={15} />
      </TouchableOpacity>
    </View>
  );
};

// Make the component available to other parts of the app
export {Header};
