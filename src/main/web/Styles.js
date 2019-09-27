'use strict';

import {StyleSheet} from 'react-native';

var styles = StyleSheet.create({
  // Font
  H1: {
    // fontFamily: 'CircularStd-Medium',
    fontSize: 35,
    color: '#484848',
  },

  H2: {
    color: '#484848',
    fontSize: 25,
    // fontFamily: 'CircularStd-Medium'
  },

  H3: {
    color: '#484848',
    fontSize: 23,
    // fontFamily: 'HelveticaNeue-Light'
  },

  regular: {
    color: '#484848',
    fontSize: 20,
    // fontFamily: 'HelveticaNeue-Light'
  },

  smallThin: {
    color: '#484848',
    fontSize: 14,
  },

  small: {
    color: '#484848',
    fontSize: 12,
    // fontFamily: 'CircularStd-Medium'
  },

  subtitle: {
    // fontFamily: 'CircularStd-Medium',
    fontSize: 18,
    color: '#484848',
  },

  buttonText: {
    // fontFamily: 'CircularStd-Medium',
    fontSize: 18,
    color: '#484848',
  },

  // Containers
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  contentContainer: {
    margin: 20,
    backgroundColor: 'white',
  },

  intputContainer: {
    height: 50,
    borderBottomColor: '#c4c4c4',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  separatorContainer: {
    marginTop: 21,
    marginBottom: 21,
    borderBottomColor: '#97979710', // #rrggbbaa
    borderBottomWidth: 1,
  },

  // Buttons + Text
  topRightButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    top: 20,
    right: 20,
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
  },

  topBackButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 20,
    left: 13,
    width: 50,
    height: 50,
  },

  topMenuButton: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    top: 20,
    left: 20,
    width: 50,
    height: 50,
  },

  topButtonText: {
    //mudar
    // fontFamily: 'CircularStd-Medium',
    color: '#484848',
    fontSize: 16,
  },

  buttonWithBorder: {
    marginTop: 20,
    borderColor: '#484848',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 25,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // List Item
  listItemContainer: {
    flex: 1,
    justifyContent: 'center',
    height: 50,
  },

  tabBar: {
    flexDirection: 'row',
    // paddingTop: 60,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
});

module.exports = styles;
