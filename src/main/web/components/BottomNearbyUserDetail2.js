<View
          style={{
            // flex: 1, //Controls height of transparent banner with info at bottom of user profiles
            flex: 0.6,
            backgroundColor: 'rgba(255,255,255,.2)',
            paddingLeft: 36,
            paddingRight: 36,
            justifyContent: 'flex-end',
            // alignItems: 'flex-end',
            marginBottom: 0,
          }}>
          <View
            style={{
              // paddingTop: 26,
              paddingTop: 0,
              justifyContent: 'space-between',
              flexDirection: 'row',
              // flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                fontSize: 26,
                fontWeight: '700',
                letterSpacing: -0.5,
              }}>
              {fullName}
            </Text>

            {/* <Text
              style={{
                flex: 1,
                fontSize: 26,
                fontWeight: '700',
                letterSpacing: -0.5,
              }}>
              {gender}
            </Text> */}

            <View
              style={{
                alignItems: 'flex-end',
                padding: 15,
                marginTop: 15,
                marginBottom: -80,
              }}>
              <TouchableOpacity
                onPress={this.onChatButtonPress.bind(this)}
                activeOpacity={0.5} //MC: Opacity when clicked
                style={{
                  height: 50,
                  width: 50,
                  // backgroundColor: 'pink',
                  // backgroundColor: 'rgb(255, 255, 0, alpha)',
                  // backgroundColor: 'rgba(255, 255, 0, 0.9)',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                }}>
                <Image
                  style={{width: 100}}
                  source={require('../assets/chat_shake.png')}
                  resizeMode="contain"
                />
                {/* // Video chat icon goes here.  Navigate to ConnectyCube auth.js onPress and pass in the ID of the friend as a prop.  */}
                {/* <Image style={{width:100 }} source={require('../assets/icons8-video-call-100.png')} resizeMode="contain"/> */}
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={this.onChatButtonPress.bind(this)}
                onPress={() => Actions.chatAuth()}
                activeOpacity={0.5} //MC: Opacity when clicked
                style={{
                  height: 50,
                  width: 50,
                  // backgroundColor: 'pink',
                  // backgroundColor: 'rgb(255, 255, 0, alpha)',
                  // backgroundColor: 'rgba(255, 255, 0, 0.9)',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                  shadowOpacity: 0.1,
                  shadowColor: 'rgb(36, 100, 193)',
                  shadowOffset: {width: 4, height: 2},
                }}>
                {/* // Video chat icon goes here.  Navigate to ConnectyCube auth.js onPress and pass in the ID of the friend as a prop.  */}
                <Image
                  style={{width: 100}}
                  source={require('../assets/icons8-video-call-100.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/*<View style={{flexDirection: 'row', paddingTop: 2}}>*/}
            {/*<Image*/}
            {/*source={require('../assets/shakes.png')}*/}
            {/*style={{*/}
            {/*height: 18,*/}
            {/*width: 18,*/}
            {/*borderRadius: 9,*/}
            {/*backgroundColor: 'white',*/}
            {/*}}*/}
            {/*/>*/}

            {/*<Text*/}
            {/*style={{*/}
            {/*fontSize: 15,*/}
            {/*fontWeight: '500',*/}
            {/*letterSpacing: 0.2,*/}
            {/*paddingLeft: 11,*/}
            {/*}}>*/}
            {/*{shakes} Shakes*/}
            {/*</Text>*/}
            {/*</View>*/}
          </View>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* <IconAwesome name="map-marker" color="#b1b1b1" size={17} /> */}
            <Text
              style={{
                color: '#b1b1b1',
                fontSize: 14,
                paddingLeft: 5,
                marginTop: 10,
              }}>
              {gender}
            </Text>
          </View>

          {birthday && (
            <Text style={{color: '#b1b1b1', fontSize: 14, marginTop: 5}}>
              {_calculateAge(new Date(birthday)) + ' years old'}
            </Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <IconAwesome name="map-marker" color="#b1b1b1" size={17} />
            <Text
              style={{
                color: '#b1b1b1',
                fontSize: 14,
                paddingLeft: 5,
                marginTop: 10,
              }}>
              {prettyDistance(distance)}
            </Text>
          </View>

          {preferences && (
            <View
              style={{
                marginTop: 12,
                justifyContent: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              {preferences.veggie && (
                <Image
                  source={require('../assets/veggie.png')}
                  style={{
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    // backgroundColor: 'white',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }}
                />
              )}
              {preferences.meat && (
                <Image
                  source={require('../assets/meat.png')}
                  style={{
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    // backgroundColor: 'white',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }}
                />
              )}
              {preferences.seaFood && (
                <Image
                  source={require('../assets/seafood.png')}
                  style={{
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    // backgroundColor: 'white',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }}
                />
              )}
              {preferences.drinks && (
                <Image
                  source={require('../assets/drinks.png')}
                  style={{
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    // backgroundColor: 'white',
                    backgroundColor: 'rgba(0,0,0,0.1)',
                  }}
                />
              )}
            </View>
          )}

          <Text style={{padding: 14}}>{bio}</Text>

          {/* <View style={{backgroundColor: 'rgba(0, 0, 0, 0.3)'}}> */}
          <View>
            <TouchableOpacity
              onPress={this.onReportButtonPress.bind(this)}
              style={{
                flexDirection: 'row',
                height: 25,
                alignItems: 'flex-end',
                paddingRight: 12,
                paddingLeft: 15,
                paddingTop: 5,
                borderTopWidth: StyleSheet.hairlineWidth,
                // borderColor: 'rgba(255, 0, 0, 0.9)',
                borderColor: 'rgba(0, 0, 0, 0)',
              }}>
              <View
                style={{
                  flex: 1,
                  height: 25,
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginBottom: 1,
                }}>
                {/* <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: 'red',
                    letterSpacing: 2.5,
                    
                  }}> */}
                <IconAwesome name="flag" size={18} color="black" />
                {/* </Text> */}
              </View>
            </TouchableOpacity>
          </View>
        </View>