import _ from 'lodash';
import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StatusBar,
  TouchableHighlight,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  Picker,
} from 'react-native';
import {connect} from 'react-redux';
import {Actions} from 'react-native-router-flux';
import {logoutUser, searchFilterFetch, saveSearchFilterChanges} from '../actions';
import {Spinner} from './common';
import DateTimePicker from 'react-native-modal-datetime-picker';
// import Icon from 'react-native-vector-icons/FontAwesome';
import {Icon} from 'react-native-elements';

import ActionSheet from 'react-native-actionsheet';
import {Switch} from 'react-native-switch';
import Modal from 'react-native-modal';

// import CustomMultiPicker from "react-native-multiple-select-list";

import Button from 'react-native-button';

import {SegmentedControls} from 'react-native-radio-buttons';


var styles = require('../Styles');

class SearchFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // gender: 'male',
      // gender: 'female', // Set initial gender filter
      gender: '', // Set initial gender filter
      // gender: null, // Set initial gender filter
    };
    // this.onGenderChange.bind(this);
    this.onGenderChange = this.onGenderChange.bind(this);
  }

  onGenderChange(i) {
    this.setState({gender: i});
  }


//   state = {
//     data: {
//       fullName: '',
//       bio: '',
//       email: '',
//       gender: '',
//       birthday: '',
//       category: '', //passa p categories e recebe um array
//       showAge: '',
//       showPreferences: '',
//       notificationsEnabled: '',
//       preferences: {
//         veggie: '',
//         meat: '',
//         seaFood: '',
//         drinks: '',
//       },
//     },
//     isDateTimePickerVisible: false,
//     textInputValue: '',
//     changesMade: false,
//   };



  // Save searchFilter information


  componentWillMount() {
    StatusBar.setHidden(true);
    // this.props.searchFilterFetch(this.props.user);
    console.log('SearchFilter.js: componentWillMount');
    // console.log("SearchFilter.js: this.props.user = ", this.props.user);

    if (this.props.data) {
      this.setState({data: this.props.data});
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user === null) {
      Actions.welcome();
    }

    if (nextProps.data) {
      this.setState({data: nextProps.data});
    }
  }




 







  onBackButtonPress() {
    if (this.state.changesMade) {
      this.setState({
        modalTitle: 'Changes not saved',
        modalDescription:
          'Save without leaving?\nAll your changes will be lost.',
        modalButton: 'Go back',
        isVisible: true,
      });
    } else {
      Actions.popTo('nearby');
    }
  }

  tryAgain() {
    this.setState({isVisible: false});
  }

  discardChanges() {
    this.setState({isVisible: false});
    Actions.popTo('nearby');
  }

  render() {
    // if (this.props.isFetchingSearchFilterData) {
    //   return <Spinner size="large" />;
    // }
    console.log('SearchFilter.js: render()');
    // console.log("SearchFilter.js: this.props.data = ", this.props.data)
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

              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 11,
                  flexDirection: 'row',
                }}
                onPress={() => this.discardChanges()}>
                <Text
                  style={{fontSize: 14, fontWeight: '500', color: '#62cfb9'}}>
                  I'm good, discard the changes.
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
                marginRight: 20,
                marginLeft: 20,
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
                    borderRadius: 20,
                    backgroundColor: 'rgba(0,0,0,0)',
                  }}
                />
              ) : (
                <Image
                  source={require('../assets/avatar.jpg')}
                  style={{
                    height: '100%',
                    width: '100%',
                    borderRadius: 20,
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
            //   fontSize: 21,
              fontWeight: '500',
              letterSpacing: -0.4,
            //   letterSpacing: -0.3,
              color: 'black',
            }}>
            Search by Gender
                      </Text>

          <TouchableOpacity
            style={{
            //   width: 50,
              width: 60,
              height: 40,
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}
            // onPress={() => this.saveChanges()}>
            // onPress={() => Actions.nearby({params: {gender:'male'}})}>
            // onPress={() => Actions.nearby({params: {gender: 'female'}})}>
            // onPress={() => Actions.nearby({params: {gender: 'other'}})}>
            onPress={() => Actions.nearby({params: {gender:this.state.gender}})}>
            <Text style={styles.topButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>











        <View
          style={{
            flexDirection: 'row',
            // flexDirection: 'column',
            height: 150,
            paddingRight: 12,
            paddingLeft: 15,
            borderBottomWidth: StyleSheet.hairlineWidth,
            alignItems: 'center',
            borderColor: 'rgba(117, 136, 147, 0.6)',
          }}>
          {/* <View style={{flex: 1, height: 50, justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '500',
                color: 'gray',
                letterSpacing: 2.5,
              }}>
              Show preferences
            </Text>
          </View> */}

          {/* <View style={{height: 150}}>
            <View
              style={{
                height: 150,
                justifyContent: 'center',
                alignItems: 'flex-start',
              }}> */}

<View style={[styles1.textInputContainer, {marginTop: 15}]}>
<SegmentedControls
                options={['MALE', 'FEMALE', 'OTHER']}
                onSelection={gender =>
                  this.onGenderChange(gender.toLowerCase())
                }
                selectedOption={this.state.gender.toUpperCase()}
                optionContainerStyle={{flex: 1, borderWidth: 0}}
                tint={'#62cfb9'}
                selectedTint={'white'}
                backTint={'rgba(0,0,0,0.03)'}
                containerStyle={{flex: 1, borderWidth: 0}}
              />
              </View>



            </View>

{/* Hide this extra switch for now.  Maybe later we add a switch to change and/or show gender */}
            {/* <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        // thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
        thumbColor={true ? "#f5dd4b" : "#f4f3f4"}
        ios_backgroundColor="#3e3e3e"
        // onValueChange={toggleSwitch}
        onValueChange={()=>{}}
        // value={isEnabled}
        value={true}
      /> */}


      </View>
    );
  }
}


const styles1 = StyleSheet.create({
    textInputContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        // height: '59@vs',
        height: 59,
        width: '100%',
        borderRadius: 9,
        shadowOpacity: 0.1,
        shadowColor: 'rgb(36, 100, 193)',
        shadowOffset: {width: 4, height: 2},
        paddingLeft: 24,
        paddingRight: 24,
        // marginTop: '50@vs',
        marginTop: 50,
      },
  });


// const mapStateToProps = ({auth, searchFilter}) => {
const mapStateToProps = ({auth, profile}) => {
  const {user} = auth;
//   const {isFetchingSearchFilterData, data} = searchFilter; //TODO : Fix this error. isFetchingSearchFilterData=undefined :-(
  const {isFetchingProfileData, data} = profile; //TODO : Fix this error. isFetchingSearchFilterData=undefined :-(
//   return {user, isFetchingSearchFilterData, data};
  return {user, isFetchingProfileData, data};
};

export default connect(
  mapStateToProps,
  {
    // searchFilterFetch,
    logoutUser,
    // saveSearchFilterChanges,
  },
)(SearchFilter);
