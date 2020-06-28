import React from 'react';
import {
  Scene,
  Router,
  Actions,
  Drawer,
  Tabs,
  Stack,
  ActionConst,
} from 'react-native-router-flux';
import Welcome from './components/Welcome';
import LoginForm from './components/LoginForm';
import ForgotPassword from './components/ForgotPassword';
import ChangePassword from './components/ChangePassword';
import Nearby from './components/Nearby';
import NearbyUserDetail from './components/NearbyUserDetail2';
import NearbyRestaurantDetail from './components/NearbyRestaurantDetail';
import DrawerContent from './components/DrawerContent';
import Profile from './components/Profile';
import Shakers from './components/Shakers';
import Settings from './components/Settings';
import RecoverPassword from './components/RecoverPassword';
import RegistrationForm from './components/RegistrationForm';
import VerificationCode from './components/VerificationCode';
import Onboarding from './components/Onboarding';

import Preferences from './components/Preferences';
// import Mood from './components/Mood';
import Mood from './components/Mood2';
// import Mood from './components/Mood_RNCamera';


import MyActivity from './components/MyActivity';
import ChatConversation from './components/ChatConversation';


//NavBar
import Header from './components/common';
import Icon from 'react-native-vector-icons/FontAwesome';


import {Text, View, TouchableOpacity} from 'react-native';
import AuthScreen from './components/AuthScreen';
import SearchFilter from './components/SearchFilter';
var styles = require('./Styles');


const RouterComponent = () => {
  return (
    <Router panHandlers={null}>
      <Scene>
        <Scene key="auth" hideNavBar>
          <Stack
            key="start"
            inactiveBackgroundColor="#FFF"
            activeBackgroundColor="#DDD"
            hideNavBar>
            <Scene
              initial
              hideNavBar
              key="onboarding"
              component={Onboarding}
              statusBarStyle="dark-content"
            />
            {/* <Scene hideNavBar key="welcome" component={Welcome} statusBarStyle="dark-content" /> */}
            <Scene key="login" component={LoginForm} title="Login" />
            <Scene
              key="forgotPassword"
              component={ForgotPassword}
              title="Forgot Password"
            />
            <Scene
              key="recoverPassword"
              component={RecoverPassword}
              title="Recover Password"
            />
            <Scene
              key="registration"
              component={RegistrationForm}
              title="New account"
            />
            <Scene
              key="verificationCode"
              component={VerificationCode}
              title="Code"
            />
          </Stack>
        </Scene>

        <Drawer
          ref="navigation"
          hideNavBar // Uncomment to show bottom footer with profile icon bottom left and Shake icon bottom right which clicks to Notifications
          
          
          // drawerIcon={<Icon name="chevron-left" type="evilicon" color="#484848" size={15} />}
          drawerImage={require('./assets/Shake Logo - Apple/iPhone/shake-logo-iphone.png')}

          // drawerIcon={
          //   <View style={{flex: 0.1, backgroundColor: 'red'}}>
          // <TouchableOpacity
          //   style={styles.topRightButton}
          //   onPress={() => Actions.pop()}>
          //   <Icon name="chevron-left" type="evilicon" color="#484848" size={15} />
          // </TouchableOpacity>
          // </View>}
      

          // navBar={Header}
          key="main"
          contentComponent={DrawerContent}
          open={true}>
          <Stack
            key="start"
            inactiveBackgroundColor="#FFF"
            activeBackgroundColor="#DDD"
            // hideNavBar
            // navBar={Header}
            >
            <Scene 
            key="nearby" 
            type="replace" 
            component={Nearby} 
            hideNavBar 
            // navBar={Header}
            />

            <Scene
              key="nearbyUserDetail"
              component={NearbyUserDetail}
              title="nearbyUserDetailYo"
              hideNavBar
              // navBar={Header}
            />

            <Scene
              key="nearbyRestaurantDetail"
              component={NearbyRestaurantDetail}
              // hideNavBar
            />

            <Scene key="myActivity" component={MyActivity} hideNavBar />

            <Scene
              key="chatConversation"
              component={ChatConversation}
              // hideNavBar
            />

            <Scene
              key="chatAuth"
              component={AuthScreen}
              // hideNavBar
            />

            {/* <Scene key="settings" component={Settings} hideNavBar /> */}
            <Scene key="settings" component={Settings} navBar={Header} />

            <Scene key="profile" component={Profile} hideNavBar />
            <Scene key="searchFilter" component={SearchFilter} hideNavBar />

            <Scene key="changePassword" component={ChangePassword} hideNavBar />

            <Scene key="preferences" component={Preferences} hideNavBar />

            <Scene key="mood" component={Mood} hideNavBar />
          </Stack>
        </Drawer>
      </Scene>
    </Router>
  );
};

export default RouterComponent;
