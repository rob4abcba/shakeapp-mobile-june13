'use strict';
import {
  Platform,
  Dimensions,
  PixelRatio,
  StyleSheet,
  StatusBar,
} from 'react-native';

const {width, height} = Dimensions.get('window');
const realWidth = height > width ? width : height;
const screenScale = realWidth / 400.0;

module.exports = {
  normalize: function(size) {
    if (Platform.OS === 'ios') {
      return Math.round(PixelRatio.roundToNearestPixel(size)) * screenScale;
    } else {
      return Math.round(PixelRatio.roundToNearestPixel(size)) * screenScale;
    }
  },

  //	backendURL: "http://localhost:8000/node_app",	// Can't end with a '/'
  backendURL: 'https://www.shakeapp-backend.net/node_app', // Can't end with a '/'
  updateCheckFrequency: 10000,
  memoryCheckFrequency: 1000,

  lastUpdate: null,
  homeNeedsUpdate: false,
  analyticsNeedsUpdate: false,
};
