import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import {Spinner} from './common';

import {connect} from 'react-redux';
var validator = require('validator');
import {logoutUser, profileFetch, saveProfileChanges} from '../actions';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {verifyPhoneNumber, setValidToken} from '../actions';
import {Actions} from 'react-native-router-flux';

var styles = require('../Styles');

class Preferences extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
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
  };

  componentWillMount() {
    StatusBar.setHidden(true);
    console.warn('PROFILE FETCH PREFERENCES');
    this.props.profileFetch(this.props.user);

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

  // Save profile information
  saveChanges() {
    this.props.saveProfileChanges(
      this.props.user,
      this.state.data,
      function(success, ref) {
        if (ref && ref.props && ref.props.onDone) {
          ref.props.onDone();
        }
        Actions.popTo('nearby');
      },
      this,
    );
  }

  onChange(veggie, meat, seaFood, drinks) {
    this.setState({
      data: {
        ...this.state.data,
        preferences: {
          veggie: veggie
            ? !this.state.data.preferences.veggie
            : this.state.data.preferences.veggie,
          meat: meat
            ? !this.state.data.preferences.meat
            : this.state.data.preferences.meat,
          drinks: drinks
            ? !this.state.data.preferences.drinks
            : this.state.data.preferences.drinks,
          seaFood: seaFood
            ? !this.state.data.preferences.seaFood
            : this.state.data.preferences.seaFood,
        },
      },
    });
  }

  renderCircle(enabled, name, color, image) {
    return enabled ? (
      <View style={[styles2.oval2, {backgroundColor: color}]}>
        <Image style={[styles2.image, {tintColor: 'white'}]} source={image} />
        <Text style={{color: 'white'}}>{name}</Text>
      </View>
    ) : (
      <View style={[styles2.oval2, {backgroundColor: 'white'}]}>
        <Image style={styles2.image} source={image} />
        <Text style={{color: 'grey'}}>{name}</Text>
      </View>
    );
  }
  renderButton() {
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
        onPress={this.saveChanges.bind(this)}>
        <Text
          style={{
            color: 'white',
            letterSpacing: -0.2,
            fontSize: 18,
            fontWeight: '600',
          }}>
          I'm set
        </Text>
      </TouchableOpacity>
    );
  }

  skip() {
    //Actions.pop();
    this.saveChanges();
  }

  render() {
    if (this.props.isFetchingProfileData) {
      return <Spinner size="large" />;
    }

    const {veggie, meat, drinks, seaFood} = this.state.data.preferences;

    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
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

        <View style={{}}>
          <View
            style={{
              alignItems: 'center',
              marginTop: 60,
              justifyContent: 'center',
            }}>
            <Text style={{fontSize: 32, fontWeight: '700'}}>Preferences</Text>

            <Text
              style={{
                fontSize: 15,
                paddingTop: 16,
                fontWeight: '500',
                color: '#484848',
                textAlign: 'center',
              }}>
              What kind of foodie are you?{'\n'}Remember you can always update
              your{'\n'}preferences later on.
            </Text>
          </View>

          <View
            style={[
              styles2.grid,
              {
                marginBottom: 125,
                marginTop: 20,
                flexDirection: 'row',
                width: 400,
              },
            ]}>
            <TouchableOpacity
              onPress={() => this.onChange(1, null, null, null)}
              style={[styles2.oval, {marginTop: 25}]}>
              {this.renderCircle(
                veggie,
                'Herbivores',
                '#62c769',
                require('../assets/veggie.png'),
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onChange(null, 1, null, null)}
              style={[styles2.oval, {marginBottom: 10}]}>
              {this.renderCircle(
                meat,
                'Carnivores',
                '#d94f4f',
                require('../assets/meat.png'),
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onChange(null, null, null, 1)}
              style={[styles2.oval, {marginTop: 25}]}>
              {this.renderCircle(
                drinks,
                "Thirsty'ores",
                '#f7cc02',
                require('../assets/drinks.png'),
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onChange(null, null, 1, null)}
              style={[styles2.oval, {marginBottom: 10}]}>
              {this.renderCircle(
                seaFood,
                "Swimmi'ores",
                '#6ec7ec',
                require('../assets/seafood.png'),
              )}
            </TouchableOpacity>
          </View>
        </View>

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
      </View>
    );
  }
}

const styles2 = {
  oval: {
    width: 120,
    height: 120,
    // marginLeft: 20,
    marginRight: 20,
    backgroundColor: '#ffffff',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oval2: {
    width: 110,
    height: 110,
    backgroundColor: '#d94f4f',
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  image: {
    height: 70,
    width: 70,
  },
};

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
)(Preferences);
