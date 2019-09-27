import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {connect} from 'react-redux';
import {
  phoneChanged,
  passwordChanged,
  loginUser,
  setValidToken,
} from '../actions';
import {Actions} from 'react-native-router-flux';
import {Icon} from 'react-native-elements';
var styles = require('../Styles');

class Shakers extends Component {
  componentWillMount() {
    StatusBar.setHidden(false);
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <View style={{flex: 0.1, backgroundColor: '#fff'}}>
          <TouchableOpacity
            style={styles.topBackButton}
            onPress={() => Actions.pop()}>
            <Icon
              name="chevron-left"
              type="evilicon"
              color="#484848"
              size={35}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.topRightButton}
            onPress={Actions.addSocialAccounts}>
            <Text style={styles.topButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <Text style={{fontSize: 36, fontWeight: '700'}}>
          AUTHENTICATED! - SHAKERS SCREEN
        </Text>
      </View>
    );
  }
}

export default Shakers;
