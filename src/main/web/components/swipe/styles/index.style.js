import {StyleSheet} from 'react-native';

export const colors = {
  black: '#1a1917',
  gray: '#888888',
  background1: '#B721FF',
  background2: '#21D4FD',
};

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollview: {
    flex: 1,
  },
  container: {
    paddingVertical: 0,
  },
  containerLight: {
    backgroundColor: 'white',
  },
  slider: {
    marginTop: 0,
    overflow: 'visible', // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 0, // for custom animation
  },
});
