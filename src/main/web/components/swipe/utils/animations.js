import {getInputRangeFromIndexes} from 'react-native-snap-carousel';

// https://codeburst.io/horizontal-scroll-animations-in-react-native-18dac6e9c720
function scrollInterpolatorFunc(index, carouselProps) {
  const range = [1, 0, -1];
  const inputRange = getInputRangeFromIndexes(range, index, carouselProps);
  const outputRange = range;

  return {inputRange, outputRange};
}
function animatedStyleFunc(index, animatedValue, carouselProps) {
  return {
    zIndex: carouselProps.data.length - index,
    opacity: animatedValue.interpolate({
      inputRange: [-1, 0, 1],
      outputRange: [0.75, 1, 0.75],
      extrapolate: 'clamp',
    }),
    transform: [
      {
        perspective: 1000,
      },
      {
        scale: animatedValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [0.65, 1, 0.65],
          extrapolate: 'clamp',
        }),
      },
      {
        rotateX: animatedValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['30deg', '0deg', '30deg'],
          extrapolate: 'clamp',
        }),
      },
      {
        rotateY: animatedValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: ['-30deg', '0deg', '30deg'],
          extrapolate: 'clamp',
        }),
      },
    ],
  };
}

// Exports
export const scrollInterpolator = scrollInterpolatorFunc;
export const animatedStyle = animatedStyleFunc;
