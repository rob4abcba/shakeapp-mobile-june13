import React from 'react';
import {View} from 'react-native';

const Card = props => {
  return <View style={styles.containerStyle}>{props.children}</View>;
};

const styles = {
  containerStyle: {
    // borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 2,
    marginRight: 2,
    marginTop: 5,
    marginBottom: 5,
  },
};

export {Card};
