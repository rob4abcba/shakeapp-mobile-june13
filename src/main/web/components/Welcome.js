import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {
  setValidToken,
  checkValidToken,
  configFetch,
  updateNotificationId,
} from '../actions';
import {Spinner} from './common';
import {PermissionsAndroid} from 'react-native';
async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Shake Location Permission',
        message: 'Shake needs location access.',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('You have location permsiision');
    } else {
      console.warn('Location permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

class Welcome extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    StatusBar.setHidden(false);

    requestLocationPermission();
    this.props.configFetch();
    this.props.checkValidToken(this.props.user);

    if (this.props.user) {
      if (this.props.validToken) {
        Actions.reset('main');
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(
      'Welcome.js - componentWillReceiveProps: ' +
        nextProps.user +
        ' ' +
        nextProps.validToken,
    );
    console.log(
      'Welcome.js - componentWillReceiveProps: ' + nextProps.validToken,
    );

    // Quando faz forgot password tem de ir para o profile
    // Criação de um reducer fica a true quando se faz Forgot Password
    // E fica a false quando se troca a password ou se faz log out
    if (nextProps.user) {
      if (nextProps.validToken) {
        Actions.reset('main');
      }
    }
  }

  onLoginButtonPress() {
    Actions.login();
  }

  onSignUpButtonPress() {
    Actions.registration();
  }

  render() {
    console.log(
      'validatingToken: ' +
        this.props.validatingToken +
        ' validToken: ' +
        this.props.validToken +
        ' USER: ' +
        this.props.user,
    );
    if (this.props.validatingToken) {
      return (
        <View style={styles.container}>
          <Spinner size="large" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/shakeapp-logo.png')}
            style={{width: 150, height: 250}}
          />
        </View>

        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>
            Discover new restaurants & friends
          </Text>
          <Text style={styles.welcomeText}>everyday with Shake.</Text>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            underlayColor={'rgba(10, 135, 238, 0.2)'}
            onPress={this.onSignUpButtonPress.bind(this)}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, {marginTop: 20}]}
            underlayColor={'rgba(10, 135, 238, 0.2)'}
            onPress={this.onLoginButtonPress.bind(this)}>
            <Text style={styles.loginText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  logoContainer: {
    flex: 2,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeContainer: {
    alignItems: 'center',
  },

  buttonsContainer: {
    flex: 1,
    margin: 20,
    justifyContent: 'flex-end',
  },

  welcomeText: {
    color: '#484848',
    fontSize: 20,
    textAlign: 'center',
    // fontFamily: 'SanFranciscoDisplay-Regular'
  },

  loginButton: {
    height: 50,
    backgroundColor: 'transparent',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#484848',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signUpButton: {
    height: 50,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#484848',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loginText: {
    color: '#484848',
    // fontFamily: 'SanFranciscoDisplay-Medium'
  },

  signUpText: {
    color: '#484848',
    // fontFamily: 'SanFranciscoDisplay-Medium'
  },
});

const mapStateToProps = ({auth, token}) => {
  const {user, validToken, validatingToken} = auth;
  return {user, validToken, validatingToken};
};

export default connect(
  mapStateToProps,
  {checkValidToken, configFetch, updateNotificationId, setValidToken},
)(Welcome);
