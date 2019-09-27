import React from 'react';
import {View} from 'react-native';

const cardStyles = {
  background: 'whitesmoke',
  borderRadius: 3,
  width: '250px',
  height: '250px',
  cursor: 'pointer',
  userSelect: 'none',
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  top: 0,
};

const Card = ({zIndex = 0, children}) => (
  <View>
    <div style={{...cardStyles, zIndex}}>{children}</div>
  </View>
);

export default Card;
