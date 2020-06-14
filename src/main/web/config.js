'use strict';
import {
  Platform,
  Dimensions,
  PixelRatio,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { ConnectyCube } from 'react-native-connectycube';

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

  // backendURL: "http://ec2-3-82-144-226.compute-1.amazonaws.com:8000/node_app",	// Can't end with a '/'
  // backendURL: "http://localhost:8000/node_app",	// Can't end with a '/'
  // OLD backendURL: "http://ec2-54-93-93-212.eu-central-1.compute.amazonaws.com:8000/node_app",	// Can't end with a '/'
  // backendURL: 'https://www.shakeapp-backend.net/node_app', // Can't end with a '/'
  // backendURL: 'http://50.18.1.14:8000/node_app', // OLD Elastic IP
  backendURL: 'http://54.176.181.106:8000/node_app',


  updateCheckFrequency: 10000,
  memoryCheckFrequency: 1000,

  lastUpdate: null,
  homeNeedsUpdate: false,
  analyticsNeedsUpdate: false,
};





// From ConnectyCube
export default [
  {
    appId: 2429,
    authKey: "UMKeOS3aUGBNgcF",
    authSecret: "Spg7Kd2ZQMmUCQE"
  },
  {
    debug: {mode: 1},
  },
];

export const users = [
  {
    id: 72780,
    name: 'Alice',
    login: 'videouser1',
    password: 'videouser1',
    color: '#34ad86',
  },
  {
    id: 72781,
    name: 'Bob',
    login: 'videouser2',
    password: 'videouser2',
    color: '#077988',
  },
  {
    id: 590565,
    name: 'Ciri',
    login: 'videouser3',
    password: 'videouser3',
    color: '#13aaae',
  },
  {
    id: 590583,
    name: 'Dexter',
    login: 'videouser4',
    password: 'videouser4',
    color: '#056a96',
  },
];

