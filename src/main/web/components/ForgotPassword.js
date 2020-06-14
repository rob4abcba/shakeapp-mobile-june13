import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  TextInput,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import Modal from 'react-native-modal';

import {Header, Spinner} from './common';
import {phoneChanged, forgotPassword} from '../actions';

import {Icon} from 'react-native-elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import DeviceInfo from 'react-native-device-info';
import CountryPicker, {
  getAllCountries,
} from 'react-native-country-picker-modal';
import * as RNLocalize from 'react-native-localize';

var styles = require('../Styles');

class ForgotPassword extends Component {
  constructor(props) {
    super(props);

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
  }

  componentWillMount() {
    StatusBar.setHidden(false);
  }

  onPhoneChange(text) {
    this.props.phoneChanged(text);
  }

  onGetCodePress() {
    const {phone} = this.props;

    var phoneFixed = '+' + this.state.callingCode + phone;

    // ver se é recover ou forgot password
    this.props.forgotPassword(phoneFixed, this, function(success, thisRef) {
      if (!success) {
        thisRef.setState({
          modalTitle: 'Invalid number',
          modalDescription: 'Your phone number is not registered',
          modalButton: 'Try again',
          isVisible: true,
        });
      } else if (success) {
        Actions.recoverPassword({phoneFixed: phoneFixed});
      }
    });
  }

  tryAgain() {
    this.setState({isVisible: false});
  }

  skip() {
    Actions.pop();
  }

  renderButton() {
    if (this.props.phoneVerificationCodeSending) {
      return (
        <View style={{backgroundColor: 'white', marginTop: 30}}>
          <Spinner size="large" />
        </View>
      );
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
        onPress={this.onGetCodePress.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Send code
        </Text>
      </TouchableOpacity>
    );
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
          style={{
            paddingTop: 59,
            paddingLeft: 28,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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

          <TouchableOpacity
            style={{justifyContent: 'space-between', paddingRight: 28}}
            onPress={() => this.skip()}>
            <Text
              style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
              SKIP
            </Text>
          </TouchableOpacity>
        </View>

        <KeyboardAwareScrollView
          style={[styles.container, {paddingLeft: 36, paddingRight: 36}]}
          resetScrollToCoords={{x: 0, y: 0}}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingTop: 73,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 32, fontWeight: '700'}}>
              Forgot Password
            </Text>

            <Text
              style={{
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
                textAlign: 'center',
              }}>
              Verify phone number to{'\n'}retrieve your account.
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              marginTop: 50,
              height: 59,
              width: '100%',
              borderRadius: 9,
              shadowOpacity: 0.1,
              shadowColor: 'rgb(36, 100, 193)',
              shadowOffset: {width: 4, height: 2},
              paddingLeft: 24,
              paddingRight: 24,
            }}>
            <View style={{padding: 10}}>
              <CountryPicker
                onChange={value => {
                  this.setState({
                    cca2: value.cca2,
                    callingCode: value.callingCode,
                  });
                }}
                cca2={this.state.cca2}
                translation="eng"
              />
            </View>

            <TextInput
              style={{flex: 1, fontSize: 16, fontWeight: '500'}}
              placeholder="Phone Number"
              keyboardType="numeric"
              onChangeText={this.onPhoneChange.bind(this)}
              value={this.props.phone}
            />
          </View>

          {Platform.OS === 'android' && (
            <View
              style={{
                width: '100%',
                paddingLeft: 36,
                paddingTop: 40,
                paddingRight: 36,
              }}>
              {this.renderButton()}
            </View>
          )}
        </KeyboardAwareScrollView>

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
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = ({auth}) => {
  const {phone, phoneVerificationCodeSending} = auth;
  return {phone, phoneVerificationCodeSending};
};

export default connect(
  mapStateToProps,
  {phoneChanged, forgotPassword},
)(ForgotPassword);
