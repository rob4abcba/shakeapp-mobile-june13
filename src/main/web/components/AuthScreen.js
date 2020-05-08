// Came from AuthScreen/index.js of ConnectyCube RNVideoChat
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {AuthService} from '../services/auth-service';
// import {users} from '../config';
import { ConnectyCube } from 'react-native-connectycube';

const users = [
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

export default class AuthScreen extends PureComponent {
  state = {isLogging: false};

  setIsLogging = isLogging => this.setState({isLogging});

  login = currentUser => {
    const _onSuccessLogin = () => {
      const {navigation} = this.props;
      const opponentsIds = users  // one user will come from NearbyUserDetail2.js
        .filter(opponent => opponent.id !== currentUser.id)
        .map(opponent => opponent.id);

      navigation.push('VideoScreen', {opponentsIds});
    };

    const _onFailLogin = (error = {}) => {
      alert(`Error.\n\n${JSON.stringify(error)}`);
    };

    this.setIsLogging(true);

    AuthService.login(currentUser)
      .then(_onSuccessLogin)
      .catch(_onFailLogin)
      .then(() => this.setIsLogging(false));
  };

  render() {
    const {isLogging} = this.state;
    const logoSrc = require('../assets/seafood.png');

    return (
      <View style={[styles.container, styles.f1]}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <SafeAreaView style={[styles.centeredChildren, styles.f1]}>
          <Image resizeMode="contain" source={logoSrc} style={styles.logoImg} />
          <View
            style={[
              styles.f1,
              styles.centeredChildren,
              {flexDirection: 'row'},
            ]}>
            <Text>{isLogging ? 'Connecting... ' : 'Video Chat'}</Text>
            {isLogging && <ActivityIndicator size="small" color="#1198d4" />}
          </View>
        </SafeAreaView>
        <SafeAreaView style={[styles.authBtns, styles.f1]}>
          {users.map(user => (
            <TouchableOpacity key={user.id} onPress={() => this.login(user)}>
              <View
                style={[styles.authBtn(user.color), styles.centeredChildren]}>
                <Text style={styles.authBtnText}>
                  {`Log in as ${user.name}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  centeredChildren: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
  },
  logoImg: {
    width: '90%',
    height: '80%',
  },
  authBtns: {
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  authBtn: backgroundColor => ({
    backgroundColor,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    marginVertical: 5,
  }),
  authBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
});
