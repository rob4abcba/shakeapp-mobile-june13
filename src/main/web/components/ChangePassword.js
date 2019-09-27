import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
  TextInput,
} from 'react-native';
import {Spinner} from './common';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
var validator = require('validator');
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {changePassword} from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modal';

var styles = require('../Styles');

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirmPassword: '',
      loading: false,
      // Modal Error
      isVisible: false,
      modalTitle: '',
      modalButton: '',
      modalDescription: '',
    };
  }

  componentWillMount() {
    StatusBar.setHidden(false);
  }

  onPasswordChange(text) {
    this.setState({password: text});
  }

  onPasswordConfirmationChange(text) {
    this.setState({confirmPassword: text});
  }

  onNewPasswordSubmission() {
    if (this.state.password != this.state.confirmPassword) {
      this.setState({
        modalTitle: "Passwords don't match",
        modalDescription: 'Make sure you typed\nboth passwords correctly',
        modalButton: 'Try again',
        isVisible: true,
      });
      return;
    }

    this.setState({loading: true});

    this.props.changePassword(
      this.props.user,
      this.state.password,
      this.state.confirmPassword,
      this,
      function(success, thisRef) {
        if (!success) {
          thisRef.setState({
            modalTitle: 'Error',
            modalDescription: 'Something went wrong.',
            modalButton: 'Try again',
            isVisible: true,
          });
        } else {
          thisRef.setState({
            modalTitle: 'New password',
            modalDescription: 'Password was changed\nsuccessfully',
            modalButton: 'Great!',
            isVisible: true,
          });
          // Actions.pop();
        }
      },
    );

    this.setState({loading: false});

    // Actions.pop();
  }

  tryAgain() {
    this.setState({isVisible: false});
    Actions.pop();
  }

  skip() {
    Actions.pop();
  }

  renderButton() {
    if (this.state.loading) {
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
        onPress={this.onNewPasswordSubmission.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          Confirm
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
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
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

          <View style={{paddingRight: 28}}>
            <TouchableOpacity
              style={{justifyContent: 'space-between'}}
              onPress={() => this.skip()}>
              <Text
                style={{fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5}}>
                SKIP
              </Text>
            </TouchableOpacity>
          </View>
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
              Change Password
            </Text>

            <Text
              style={{
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
                textAlign: 'center',
              }}>
              You have requested to create a new{'\n'}password for your profile.
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              marginTop: 20,
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
              ref="passwordInput"
              style={{flex: 1, fontSize: 16, fontWeight: '500'}}
              returnKeyType={'done'}
              placeholder="New Password"
              inputStyle={styles.inputStyle}
              onChangeText={this.onPasswordChange.bind(this)}
              autoCorrect={false}
              secureTextEntry={true}
              value={this.state.password}
            />

            <Icon name="lock" color="#62cfb9" size={24} />
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'white',
              marginTop: 20,
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
              ref="passwordInput"
              style={{flex: 1, fontSize: 16, fontWeight: '500'}}
              returnKeyType={'done'}
              placeholder="Confirm Password"
              inputStyle={styles.inputStyle}
              onChangeText={this.onPasswordConfirmationChange.bind(this)}
              autoCorrect={false}
              secureTextEntry={true}
              value={this.state.confirmPassword}
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
  const {user} = auth;
  return {user};
};

export default connect(
  mapStateToProps,
  {changePassword},
)(ChangePassword);
