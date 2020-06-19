import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Image,
  PermissionsAndroid,
} from 'react-native';

import { Card } from './common/Card';
import { connect } from 'react-redux';
import {
  phoneChanged,
  passwordChanged,
  loginUser,
  setValidToken,
  checkValidToken,
  configFetch,
  updateNotificationId,
} from '../actions';
import { Actions } from 'react-native-router-flux';
import { Header, Spinner } from './common';
import Icon from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';

import { ScaledSheet } from 'react-native-size-matters';

import Modal from 'react-native-modal';
import * as RNLocalize from 'react-native-localize';

var styles = require('../Styles');

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

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.onPhoneChange = this.onPhoneChange.bind(this);

    let userLocaleCountryCode = RNLocalize.getCountry();
    console.warn(userLocaleCountryCode);
    const userCountryData = getAllCountries()
      .filter(country => country.cca2 === userLocaleCountryCode)
      .pop();
    let callingCode = null;
    let cca2 = userLocaleCountryCode;
    if (!cca2 || !userCountryData) {
      cca2 = 'US';
      callingCode = '1';
    } else {
      callingCode = userCountryData.callingCode;
    }
    this.state = {
      cca2,
      callingCode,

      // Modal Error
      isVisible: false,
    };

    this.setState({
      callingCode: callingCode,
      cca2: cca2,
    });
  }

  componentWillMount() {
    StatusBar.setHidden(false);

    if (Platform.OS === 'android') {
      requestLocationPermission();
    }
    // else
    // navigator.geolocation.requestAuthorization();

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

  onPhoneChange(text, callingCode) {
    this.props.phoneChanged(text, callingCode);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onButtonPress() {
    const { phone, password } = this.props;

    var phoneFixed = '+' + this.state.callingCode + phone;

    this.props.loginUser(phoneFixed, password, this, function (
      success,
      token,
      thisRef,
    ) {
      if (!success) {
        thisRef.setState({ isVisible: true });
      } else {
      }
    });
  }

  onForgotPasswordPress() {
    Actions.forgotPassword({ type: 'push' });
  }

  renderButton() {
    if (this.props.loading) {
      return (
        <View style={{ marginTop: 30 }}>
          <Spinner size="large" />
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={style.loginButton}
        onPress={this.onButtonPress.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Log in
        </Text>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {/* Error modal */}
        <Modal
          backdropOpacity={0}
          style={{ alignItems: 'center' }}
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({ isVisible: false })}>
          <View
            style={{
              width: 300,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              paddingTop: 40,
              borderRadius: 8,
              shadowOpacity: 0.1,
              shadowColor: 'rgb(36, 100, 193)',
              shadowOffset: { width: 4, height: 2 },
            }}>
            <Text style={{ fontSize: 24, fontWeight: '800' }}>
              Couldn't sign in
            </Text>

            <Text
              style={{
                selfAlign: 'center',
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
              }}>
              Your number or password{'\n'}are incorrect.
            </Text>

            <View
              style={{
                width: '100%',
                paddingLeft: 36,
                paddingTop: 40,
                paddingRight: 36,
                paddingBottom: 36,
              }}>
              <TouchableOpacity
                style={{
                  height: 50,
                  backgroundColor: '#62cfb9',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: { width: 4, height: 2 },
                }}
                onPress={() => this.setState({ isVisible: false })}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  Try again
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Error modal */}

        <View
          style={styles.container}
          contentContainerStyle={{ justifyContent: 'space-between' }}>
          <View style={style.logoContainer}>
            <Image
              source={require('../assets/shake-logo.png')}
              style={{ height: 30, width: 23, backgroundColor: 'white' }}
              resizeMode={'contain'}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 0.5,
                paddingLeft: 6,
              }}>
              Shake
            </Text>
          </View>

          <KeyboardAwareScrollView
            style={styles.container}
            resetScrollToCoords={{ x: 0, y: 0 }}>
            <View style={style.headerContainer}>
              <Text style={style.titleText}>Welcome</Text>

              <Text style={style.subtitleText}>
                Sign in to continue to Shake App
              </Text>
            </View>

            <View style={{ flex: 1, paddingLeft: 36, paddingRight: 36 }}>
              <View style={[style.textInputContainer]}>
                <View style={{ padding: 10 }}>
                  <CountryPicker
                    onChange={value => {
                      this.setState({
                        cca2: value.cca2,
                        callingCode: value.callingCode,
                      });
                      this.onPhoneChange(
                        this.props.phone,
                        '+' + value.callingCode,
                      );
                    }}
                    cca2={this.state.cca2}
                    translation="eng"
                  />
                </View>

                <TextInput
                  style={style.textInput}
                  placeholder="Phone Number"
                  onChangeText={text =>
                    this.onPhoneChange(text, '+' + this.state.callingCode)
                  }
                  keyboardType={'phone-pad'}
                  value={this.props.phone}
                  returnKeyType={'next'}
                  onSubmitEditing={event => {
                    this.refs.passwordInput.focus();
                  }}
                />

                <Icon name="mobile" color="#62cfb9" size={30} />
              </View>

              <View style={[style.textInputContainer, { marginTop: 20 }]}>
                <TextInput
                  ref="passwordInput"
                  style={style.textInput}
                  returnKeyType={'done'}
                  placeholder="Password"
                  inputStyle={styles.inputStyle}
                  onChangeText={this.onPasswordChange.bind(this)}
                  autoCorrect={false}
                  secureTextEntry={true}
                  value={this.props.password}
                />

                <Icon name="lock" color="#62cfb9" size={24} />
              </View>

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  marginTop: 11,
                  flexDirection: 'row',
                }}
                onPress={() => Actions.forgotPassword()}>
                <Text
                  style={{ fontSize: 14, fontWeight: '500', color: '#62cfb9' }}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>

              {Platform.OS === 'android' && (
                <View
                  style={{
                    width: '100%',
                    paddingLeft: 36,
                    paddingTop: 75,
                    paddingRight: 36,
                  }}>
                  {this.renderButton()}

                  <TouchableOpacity
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 11,
                      flexDirection: 'row',
                    }}
                    onPress={() => Actions.registration()}>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}>
                      Don’t have an account?{' '}
                    </Text>
                    <Text
                      style={[style.secondaryButtonText, { color: '#62cfb9' }]}>
                      Sign up.
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </KeyboardAwareScrollView>
          {/* </View> */}
        </View>

        {Platform.OS === 'ios' && (
          <View
            style={{
              position: 'absolute',
              width: '100%',
              bottom: 36,
              paddingLeft: 36,
              paddingRight: 36,
            }}>
            {this.renderButton()}

            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 11,
                flexDirection: 'row',
              }}
              onPress={() => Actions.registration()}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                Don’t have an account?{' '}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#62cfb9' }}>
                Sign up.
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}

const style = ScaledSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  headerContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '73@vs',
    justifyContent: 'center',
  },

  logoContainer: {
    paddingTop: '59@vs',
    paddingLeft: '28@vs',
    flexDirection: 'row',
    alignItems: 'center',
  },

  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '59@vs',
    width: '100%',
    borderRadius: 9,
    shadowOpacity: 0.1,
    shadowColor: 'rgb(36, 100, 193)',
    shadowOffset: { width: 4, height: 2 },
    paddingLeft: 24,
    paddingRight: 24,
    marginTop: '50@vs',
  },

  textInput: {
    flex: 1,
    fontSize: '16@ms',
    fontWeight: '500',
  },

  titleText: {
    fontSize: '32@ms',
    fontWeight: '700',
  },

  subtitleText: {
    fontSize: '15@ms',
    paddingTop: '16@vs',
    fontWeight: '500',
    color: '#484848',
  },

  loginButton: {
    height: '50@vs',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#62cfb9',
    borderRadius: 8,
    shadowOpacity: 0.1,
    shadowColor: 'rgb(36, 100, 193)',
    shadowOffset: { width: 4, height: 2 },
  },

  secondaryButtonText: {
    fontSize: '14@ms',
    fontWeight: '500',
  },
});

const mapStateToProps = ({ auth }) => {
  const {
    user,
    phone,
    password,
    error,
    loading,
    validToken,
    validatingToken,
  } = auth;

  return { user, phone, password, error, loading, validToken, validatingToken };
};

export default connect(
  mapStateToProps,
  {
    phoneChanged,
    passwordChanged,
    loginUser,
    setValidToken,
    checkValidToken,
    configFetch,
    updateNotificationId,
  },
)(LoginForm);

// export default LoginForm;
