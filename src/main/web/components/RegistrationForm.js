import _ from 'lodash';
import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StatusBar,
  TouchableHighlight,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Linking,
} from 'react-native';
import {connect} from 'react-redux';
import {
  nameChanged,
  phoneChanged,
  passwordChanged,
  registerUser,
} from '../actions';
import {Spinner} from './common';
import * as RNLocalize from 'react-native-localize';
import {Actions} from 'react-native-router-flux';
var validator = require('validator');
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Platform} from 'react-native';
var styles = require('../Styles');
import DeviceInfo from 'react-native-device-info';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import Modal from 'react-native-modal';
import {ScaledSheet} from 'react-native-size-matters';

class RegistrationForm extends Component {
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
      checked: false,
      data: {
        category: '',
      },
      isVisible: false,
      modalTitle: '',
      modalButton: '',
      modalDescription: '',
    };

    this.setState({
      callingCode: callingCode,
      cca2: cca2,
    });
  }

  componentWillMount() {
    StatusBar.setHidden(false);
  }

  onNameChange(text) {
    this.props.nameChanged(text);
  }

  onPhoneChange(text, countryCode) {
    this.props.phoneChanged(text, countryCode);
  }

  onPasswordChange(text) {
    this.props.passwordChanged(text);
  }

  onSignUpButtonPress() {
    const {name, phone, password, accountVerified} = this.props;

    if (!validator.isLength(password, {min: 5})) {
      this.setState({
        modalTitle: 'Invalid password',
        modalDescription: 'Your password length must\nbe at least 5 characters',
        modalButton: 'Ok',
        isVisible: true,
      });

      return;
    }

    if (!name) {
      this.setState({
        modalTitle: 'Name missing',
        modalDescription: 'Please fill in the name field',
        modalButton: 'Ok',
        isVisible: true,
      });

      return;
    }

    var phoneFixed = '+' + this.state.callingCode + phone;
    this.props.registerUser(
      name,
      phoneFixed,
      '+' + this.state.callingCode,
      password,
      this,
      function(success, thisRef) {
        if (success) {
          Actions.verificationCode({type: 'push'});
        } else if (!success) {
          thisRef.setState({
            modalTitle: 'Registration failed',
            modalDescription: 'Account already registered.',
            modalButton: 'Ok',
            isVisible: true,
          });
        }
      },
    );
  }

  renderSignUpButton() {
    if (this.props.loading) {
      return <Spinner size="large" />;
    }

    return (
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: '#62cfb9',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 8,
          shadowOpacity: 0.1,
          shadowColor: 'rgb(36, 100, 193)',
          shadowOffset: {width: 4, height: 2},
        }}
        onPress={this.onSignUpButtonPress.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Sign Up
        </Text>
      </TouchableOpacity>
    );
  }

  privacyPolicyClick = () => {
    Linking.canOpenURL('http://www.shakeapp.today/privacy').then(supported => {
      if (supported) {
        Linking.openURL('http://www.shakeapp.today/privacy');
      } else {
        console.log("Don't know how to open URI");
      }
    });
  };

  renderPrivacyPolicyLink() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}
        onPress={this.privacyPolicyClick}>
        <Text
          style={{flex: 1, flexWrap: 'wrap', fontSize: 14, fontWeight: '500'}}>
          Before signing up please read the
          <Text style={{color: '#62cfb9'}}> Privacy Policy</Text> carefully.
        </Text>
      </TouchableOpacity>
    );
  }

  renderSignInLink() {
    return (
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 11,
          flexDirection: 'row',
        }}
        onPress={() => Actions.login()}>
        <Text style={{fontSize: 14, fontWeight: '500'}}>
          Already have an account?{' '}
        </Text>
        <Text style={{fontSize: 14, fontWeight: '500', color: '#62cfb9'}}>
          Sign in.
        </Text>
      </TouchableOpacity>
    );
  }

  _onCheck() {
    this.setState({
      checked: !this.state.checked,
    });
  }

  tryAgain() {
    this.setState({isVisible: false});
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* Error modal */}
        <Modal
          backdropOpacity={0}
          style={{alignItems: 'center'}}
          isVisible={this.state.isVisible}
          onBackdropPress={() => this.setState({isVisible: false})}>
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
              shadowOffset: {width: 4, height: 2},
            }}>
            <Text style={{fontSize: 24, fontWeight: '800'}}>
              {this.state.modalTitle}
            </Text>

            <Text
              style={{
                selfAlign: 'center',
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
              }}>
              {this.state.modalDescription}
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
                  shadowOffset: {width: 4, height: 2},
                }}
                onPress={() => this.tryAgain()}>
                <Text
                  style={{
                    color: 'white',
                    letterSpacing: -0.2,
                    fontSize: 18,
                    fontWeight: '600',
                  }}>
                  {this.state.modalButton}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Error modal */}

        <View
          style={styles.container}
          contentContainerStyle={{justifyContent: 'space-between'}}>
          <View style={style.logoContainer}>
            <Image
              source={require('../assets/shake-logo.png')}
              style={{height: 30, width: 23, backgroundColor: 'white'}}
              resizeMode={'contain'}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                letterSpacing: 0.5,
                paddingLeft: 6,
              }}>
              Shake.
            </Text>
          </View>

          <KeyboardAwareScrollView
            style={[styles.container, {paddingLeft: 36, paddingRight: 36}]}
            resetScrollToCoords={{x: 0, y: 0}}>
            <View style={style.headerContainer}>
              <Text style={style.titleText}>New User</Text>

              <Text style={style.subtitleText}>
                Create account to continue to{'\n'}Shake.
              </Text>
            </View>

            <View style={[style.textInputContainer, {marginTop: 15}]}>
              <TextInput
                style={{flex: 1, fontSize: 16, fontWeight: '500'}}
                placeholder="John Doe"
                returnKeyType={'next'}
                onChangeText={this.onNameChange.bind(this)}
                value={this.props.name}
                onSubmitEditing={event => {
                  this.refs.phoneInput.focus();
                }}
              />

              <Icon name="user" color="#62cfb9" size={30} />
            </View>

            <View style={[style.textInputContainer, {marginTop: 15}]}>
              <View style={{padding: 10}}>
                <CountryPicker
                  onChange={value => {
                    console.warn(value.callingCode);
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
                ref="phoneInput"
                style={{flex: 1, fontSize: 16, fontWeight: '500'}}
                placeholder="Phone Number"
                onChangeText={text =>
                  this.onPhoneChange(text, '+' + this.state.callingCode)
                }
                keyboardType={'number-pad'}
                value={this.props.phone}
                returnKeyType={'next'}
                onSubmitEditing={event => {
                  this.refs.passwordInput.focus();
                }}
              />

              <Icon name="mobile" color="#62cfb9" size={30} />
            </View>

            <View style={[style.textInputContainer, {marginTop: 15}]}>
              <TextInput
                ref="passwordInput"
                style={{flex: 1, fontSize: 16, fontWeight: '500'}}
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

            {Platform.OS === 'android' && (
              <View
                style={{
                  width: '100%',
                  paddingLeft: 36,
                  paddingTop: 40,
                  paddingRight: 36,
                }}>
                {this.renderPrivacyPolicyLink()}
                {this.renderSignUpButton()}
                {this.renderSignInLink()}
              </View>
            )}
          </KeyboardAwareScrollView>
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
            {this.renderPrivacyPolicyLink()}
            {this.renderSignUpButton()}
            {this.renderSignInLink()}
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
    shadowOffset: {width: 4, height: 2},
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
});

const mapStateToProps = ({auth, config}) => {
  const {name, phone, password, error, loading} = auth;
  return {name, phone, password, error, loading};
};

export default connect(
  mapStateToProps,
  {
    nameChanged,
    phoneChanged,
    passwordChanged,
    registerUser,
  },
)(RegistrationForm);
