import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import {Spinner} from './common';

import {connect} from 'react-redux';
// var validator = require('validator');
import {recoverPassword} from '../actions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';

class RecoverPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      verificationCode: '',
      // Modal Error
      isVisible: false,
    };
  }

  componentWillMount() {
    StatusBar.setHidden(false);
  }

  onCodeChange(text) {
    this.state.verificationCode = text;
    this.forceUpdate();
  }

  renderButton() {
    if (this.props.recoveringPassword) {
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
        onPress={this.onRecoverPasswordPress.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Verify
        </Text>
      </TouchableOpacity>
    );
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.recoverSuccess == true) {
    //   Actions.profile();
    // }
  }

  onRecoverPasswordPress() {
    const {phone, countryCode} = this.props;
    const SMSCode = this.state.verificationCode;

    // console.log('RecoverPassword.js > onRecoverPasswordPress: Token: ' + this.props.user + ' Valid Token: ' + this.props.validToken);
    // if (!this.props.user && !this.props.validToken) {

    // console.log('RecoverPassword.js > onRecoverPasswordPress: ValidToken: ' + this.props.validToken);
    // var phoneFixed = countryCode + phone;
    this.props.recoverPassword(this.props.phoneFixed, SMSCode, this, function(
      success,
      token,
      thisRef,
    ) {
      console.log(
        'RecoverPassword.js > onRecoverPasswordPress TOKEN: ' +
          success +
          ' ' +
          token,
      );

      if (!success) {
        thisRef.setState({isVisible: true});
      }
    });
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {/* Error Modal */}
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
            <Text style={{fontSize: 24, fontWeight: '800'}}>Invalid Code</Text>

            <Text
              style={{
                selfAlign: 'center',
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
              }}>
              That was not the code{'\n'}we sent you!
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
                onPress={() => this.setState({isVisible: false})}>
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

        <View
          style={{
            paddingTop: 59,
            paddingLeft: 28,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
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
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingTop: 73,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 32, fontWeight: '700'}}>Verification</Text>

            <Text
              style={{
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
                textAlign: 'center',
              }}>
              You will receive a message with the code{'\n'} to verify your
              phone number.
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
            <TextInput
              style={{flex: 1, fontSize: 16, fontWeight: '500'}}
              placeholder="12345"
              keyboardType="numeric"
              onChangeText={this.onCodeChange.bind(this)}
              value={this.props.verificationCode}
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

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
};

const mapStateToProps = ({auth}) => {
  const {
    user,
    phone,
    countryCode,
    recoveringPassword,
    validToken,
    recoverSuccess,
  } = auth;
  return {
    user,
    phone,
    countryCode,
    recoveringPassword,
    validToken,
    recoverSuccess,
  };
};

export default connect(
  mapStateToProps,
  {recoverPassword},
)(RecoverPassword);
