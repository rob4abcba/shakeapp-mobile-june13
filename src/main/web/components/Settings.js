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
  Picker,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {logoutUser, profileFetch, saveProfileChanges} from '../actions';
import {Spinner} from './common';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {Icon} from 'react-native-elements';
import Modal from 'react-native-modal';

import ActionSheet from 'react-native-actionsheet';
import {Switch} from 'react-native-switch';

import Button from 'react-native-button';

var styles = require('../Styles');

class Settings extends Component {
  constructor(props) {
    super(props);

    this.onNotificationsEnabledChange = this.onNotificationsEnabledChange.bind(
      this,
    );
  }
  state = {
    data: {
      fullName: '',
      email: '',
      gender: '',
      birthday: '',
      category: '', //passa p categories e recebe um array
      showAge: '',
      showPreferences: '',
      notificationsEnabled: '',
      preferences: {
        veggie: '',
        meat: '',
        seaFood: '',
        drinks: '',
      },
    },
    isDateTimePickerVisible: false,
    textInputValue: '',
    changesMade: false,
    // Modal Error
    isVisible: false,
    modalTitle: '',
    modalButton: '',
    modalDescription: '',
    modalSecondaryButton: '',
  };

  // Save profile information
  saveChanges() {
    if (this.state.changesMade) {
      this.props.saveProfileChanges(this.props.user, this.state.data, function(
        success,
      ) {
        if (!success) {
          Alert.alert(
            'Error',
            'Error saving settings changes',
            [
              {
                text: 'OK',
              },
            ],
            {cancelable: false},
          );
        } else {
          Actions.popTo('nearby');
        }
      });
    } else {
      Actions.popTo('nearby');
    }
  }

  componentWillMount() {
    StatusBar.setHidden(true);
    this.props.profileFetch(this.props.user);

    if (this.props.data) {
      this.setState({data: this.props.data});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null) {
      Actions.login();
    }

    if (nextProps.data) {
      this.setState({data: nextProps.data});
    }
  }

  onNameChange(text) {
    this.setState({
      data: {
        ...this.state.data,
        fullName: text,
      },
      changesMade: true,
    });
  }
  onEmailChange(text) {
    this.setState({
      data: {
        ...this.state.data,
        email: text,
      },
      changesMade: true,
    });
  }
  onGenderChange(i) {
    this.setState({
      data: {
        ...this.state.data,
        gender: i == 1 ? 'male' : 'female',
      },
      changesMade: true,
    });
  }

  onNotificationsEnabledChange(val) {
    this.setState({
      data: {
        ...this.state.data,
        notificationsEnabled: val,
      },
      changesMade: true,
    });
    //console.warn(val)
  }

  onCategoryChange(i) {
    if (i == 0) {
      return;
    }

    this.setState({
      data: {
        ...this.state.data,
        category: _.map(this.props.data.categoriesList, 'id')[i - 1],
      },
      changesMade: true,
    });
  }

  onBirthdayDateChange(text) {
    var newBirthday = new Date(text).toISOString();
    this.setState({
      data: {
        ...this.state.data,
        birthday: newBirthday,
      },
      changesMade: true,
    });

    this._hideDateTimePicker();
  }

  onLogoutButtonPress() {
    this.setState({
      modalTitle: 'Signing out',
      modalDescription: "Are you sure you're\nninja'ing out?",
      modalButton: 'Yes',
      modalSecondaryButton: 'No, keep me signed in.',
      isVisible: true,
    });
  }

  _showDateTimePicker = () => this.setState({isDateTimePickerVisible: true});

  _hideDateTimePicker = () => this.setState({isDateTimePickerVisible: false});

  _handleDatePicked = date => {
    console.log('A date has been picked: ', date);
    this._hideDateTimePicker();
  };

  renderNewDate() {
    if (this.state.data.birthday) {
      return (
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'gray',
              letterSpacing: 2.5,
            }}>
            {new Date(this.state.data.birthday).toLocaleDateString()}
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{justifyContent: 'center', flex: 1}}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '500',
              color: 'gray',
              letterSpacing: 2.5,
            }}>
            Set a date
          </Text>
        </View>
      );
    }
  }

  onChangePasswordButtonPress() {
    Actions.changePassword({type: 'push'});
  }

  onChangesMade() {
    this.state.changesMade = true;
  }

  onBackButtonPress() {
    if (this.state.changesMade) {
      this.setState({
        modalTitle: 'Changes not saved',
        modalDescription:
          'Save without leaving?\nAll your changes will be lost.',
        modalButton: 'Go back',
        modalSecondaryButton: "I'm good, discard the changes",
        isVisible: true,
      });
    } else {
      Actions.popTo('nearby');
    }
  }

  primaryButtonPress() {
    this.setState({isVisible: false});
    if (this.state.modalTitle == 'Signing out') {
      this.props.logoutUser(this.props.user);
      // Tried to fix issue of Signout not showing Signout
      // Actions.popTo('auth')
      // Actions.login();
    } else {
    }
  }

  secondaryButtonPress() {
    this.setState({isVisible: false});
    if (this.state.modalTitle == 'Signing out') {
      // Fica onde está
    } else {
      Actions.popTo('nearby');
    }
  }

  render() {
    if (this.props.isFetchingProfileData) {
      return <Spinner size="large" />;
    }

    const {fullName, shakes, birthday} = this.props.data;
    var photoURL = this.props.data.mood.photoURL;

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
                paddingBottom: 18,
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
                onPress={() => this.primaryButtonPress()}>
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

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 11,
                  flexDirection: 'row',
                }}
                onPress={() => this.secondaryButtonPress()}>
                <Text
                  style={{fontSize: 14, fontWeight: '500', color: '#62cfb9'}}>
                  {this.state.modalSecondaryButton}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Error modal */}

        <View
          style={{
            height: 113,
            justifyContent: 'center',
            backgroundColor: 'white',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(117, 136, 147, 0.6)',
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: 36,
            }}
            // onPress={() => Actions.drawerOpen()}
          >
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: 'white',
                borderWidth: 3,
                borderColor: '#b1b1b1',
              }}>
              {photoURL ? (
                <Image
                  source={{uri: photoURL}}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 22,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              ) : (
                <Image
                  source={require('../assets/avatar.jpg')}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 22,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              )}
            </View>

            <View style={{paddingLeft: 13}}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  letterSpacing: -0.4,
                  color: 'black',
                }}>
                {fullName}
              </Text>

              <View style={{flexDirection: 'row', paddingTop: 2}}>
                <Image
                  source={require('../assets/shakes.png')}
                  style={{
                    height: 18,
                    width: 18,
                    borderRadius: 9,
                    backgroundColor: 'white',
                  }}
                />

                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: '500',
                    letterSpacing: 0.2,
                    paddingLeft: 11,
                  }}>
                  {shakes} Shakes
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Second row - Header */}
        <View
          style={{
            height: 49,
            backgroundColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(117, 136, 147, 0.6)',
          }}>
          <TouchableOpacity
            style={{width: 50}}
            onPress={this.onBackButtonPress.bind(this)}>
            <Icon
              name="chevron-left"
              type="evilicon"
              color="#484848"
              size={35}
            />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 22,
              fontWeight: '500',
              letterSpacing: -0.4,
              color: 'black',
            }}>
            Edit Settings
          </Text>

          <TouchableOpacity
            style={{
              width: 50,
              height: 40,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
            onPress={() => this.saveChanges()}>
            <Text style={styles.topButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            paddingRight: 12,
            paddingLeft: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(117, 136, 147, 0.6)',
          }}>
          <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: 'gray',
                letterSpacing: 2.5,
              }}>
              Push notifications
            </Text>
          </View>
          <View style={{height: 50}}>
            <View
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}>
              <Switch
                value={this.state.data.notificationsEnabled}
                onValueChange={val => {
                  this.onNotificationsEnabledChange(val);
                }}
                disabled={false}
                activeText={'On'}
                inActiveText={'Off'}
                circleSize={19}
                barHeight={20}
                barWidth={46}
                circleBorderWidth={0}
                backgroundActive={'rgba(215, 215, 215, 0.36)'}
                backgroundInactive={'rgba(215, 215, 215, 0.36)'}
                circleActiveColor={'#62cfb9'}
                circleInActiveColor={'#d7d7d7'}
                // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                innerCircleStyle={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }} // style for inner animated circle for what you (may) be rendering inside the circle
                // outerCircleStyle={{}} // style for outer animated circle
                renderActiveText={false}
                renderInActiveText={false}
                switchLeftPx={2} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                switchRightPx={2} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                switchWidthMultiplier={2} // multipled by the `circleSize` prop to calculate total width of the Switch
              />
            </View>
          </View>
        </View>

        {/*CHANGE PASSWORD*/}
        <TouchableOpacity
          onPress={this.onChangePasswordButtonPress.bind(this)}
          style={{
            flexDirection: 'row',
            height: 50,
            alignItems: 'center',
            paddingRight: 12,
            paddingLeft: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(117, 136, 147, 0.6)',
          }}>
          <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: 'gray',
                letterSpacing: 2.5,
              }}>
              Change password
            </Text>
          </View>
          <View style={{height: 50}}>
            <View
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            />
          </View>
        </TouchableOpacity>

        {/*LOG OUT*/}
        <TouchableOpacity
          onPress={this.onLogoutButtonPress.bind(this)}
          style={{
            flexDirection: 'row',
            height: 50,
            paddingRight: 12,
            paddingLeft: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderColor: 'rgba(117, 136, 147, 0.6)',
          }}>
          <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: 'gray',
                letterSpacing: 2.5,
              }}>
              Log out
            </Text>
          </View>
          <View style={{height: 50}}>
            <View
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = ({auth, profile}) => {
  const {user} = auth;
  const {isFetchingProfileData, data} = profile;
  return {user, isFetchingProfileData, data};
};

export default connect(
  mapStateToProps,
  {
    profileFetch,
    logoutUser,
    saveProfileChanges,
  },
)(Settings);
