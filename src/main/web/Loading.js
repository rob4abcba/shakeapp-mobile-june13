import React, {Component} from 'react';
import {
  ActivityIndicator,
  AppRegistry,
  StyleSheet,
  Text,
  View,
} from 'react-native';
// https://facebook.github.io/react-native/docs/activityindicator
export default class Loading extends Component {
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
