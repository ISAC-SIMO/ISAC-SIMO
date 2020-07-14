import * as React from 'react';
import i18n from 'i18n-js';
import {Button, Text, TextInput, View, StyleSheet,Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import SplashScreen from './src/screens/Splash/Splash';
import AuthContext from './src/AuthContext';
import LocalizationContext from './src/LocalizationContext';
//const AuthContext = React.createContext();
import HomeScreen from './src/screens/Home/HomeScreen';
import RegisterScreen from './src/screens/Login/RegisterPaper';
import LoginScreen from './src/screens/Login/LoginPaper';
import DashboardScreen from './src/screens/Login/DashboardPaper';
import ForgotPasswordScreen from './src/screens/Login/ForgotPaper';
import HomePaperScreen from './src/screens/Login/HomePaper';
import FormMain from './src/screens/Login/FormMain';
import FormList from './src/screens/Login/FormList';
import FormTab from './src/screens/Login/FormTab';
import LoadingScreen from './src/screens/Login/Loading';

import Icons from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  TouchableRipple,
  Switch,
} from 'react-native-paper';

/***
 *
 * LOCALDB
 *
 */
import Realm from 'realm';
import moment from 'moment-timezone';
/*FormList = {
  name: 'FormList',
  primaryKey: 'formId',
  properties: {
    key: {type: 'int', default: 0},
    formId: 'int',
    formName: 'string',
    formAlias: 'string',
    formUrl: 'string',
    formData: 'string',
    created_on: {type: 'date', default: moment().format()},
  },
};
SavedFrm = {
  name: 'SavedFrm',
  properties: {
    formData: 'string',
  },
};
SavedFrmList = {
  name: 'SavedFrmList',
  properties: {
    key: {type: 'int', default: 0},
    formId: 'int',
    formUrl: 'string',
    formAlias: 'string',
    creationDate: {type: 'string', default: Date.now().toString()},
    formData: {type: 'SavedFrm'},
  },
};
global.realm_config = {
  schema: [FormList, SavedFrm, SavedFrmList],
  schemaVersion: 5,
};
global.realm = new Realm(global.realm_config);
global.data = 'ppp';
console.log('REALM PATH', global.realm.defaultPath);
console.log('create db:', global.realm);
*/

const en = {
  foo: 'Foo',
  bar: 'Bar {{someValue}}',
};

const fr = {
  foo: 'Fou',
  bar: 'Bár {{someValue}}',
};

i18n.fallbacks = false;
i18n.translations = {fr, en};
//export const LocalizationContext = React.createContext();
const Drawer = createDrawerNavigator();

const MyTheme = {
  dark: false,
  colors: {
    primary: 'rgb(255, 45, 85)',
    background: 'rgb(242, 242, 242)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(199, 199, 204)',
  },
};
const logout = async (props) => {
/**2 */
 /* try {
    userToken = await AsyncStorage.getItem('token');
    props.navigation.navigate('AuthStack');
  } catch (e) {
    // Restoring token failed
  }*/
 
};

const CustomDrawerContent = async props => {
 //const username= await AsyncStorage.getItem('userFullname');


  //function CustomDrawerContent(props) {
  //await getKeysData(['key1', 'key2', 'key3']);
  //.then((response)=>{ console.log(response)});
  //const { t, locale, setLocale } = React.useContext(LocalizationContext);
  //const userId
  /*try {
    const value = await AsyncStorage.getItem('userFullname')
    if(value !== null) {
      const userFullname=userFullname;
    }
  } catch(e) {
    // error reading value
  }*/

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.drawerContent}>
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: 'https://placeimg.com/100/100/animals',
            }}
            size={50}
          />
          <Button
            mode="contained"
            style={{marginLeft: 18, marginRight: 18, marginTop: 18}}
            // onPress={() => props.navigation.navigate('AuthStack')}
            onPress={() => logout(props)}
            title="logout"></Button>
          <Title style={styles.title}>dddd</Title>
          <Caption style={styles.caption}>@sakararyal</Caption>
          <View
            style={{
              marginHorizontal: 5,
              paddingHorizontal: 5,
              height: 1,
              borderColor: 'black',
            }}></View>
        </View>
      </View>
      {/**
   <DrawerItem
        label="Help"
        onPress={() => Linking.openUrl('https://www.buildchange.org')}
      />
  
   */}

      <DrawerItemList {...props} />

      <TouchableRipple onPress={() => {}}>
        <View style={styles.preference}>
          <Text>Dark Theme</Text>
          <View pointerEvents="none">
            <Switch value={false} />
          </View>
        </View>
      </TouchableRipple>
      <TouchableRipple onPress={() => {}}>
        <View style={styles.preference}>
          <Text>Spanish</Text>
          <View pointerEvents="none">
            <Switch value={false} />
          </View>
        </View>
      </TouchableRipple>
    </DrawerContentScrollView>
  );
};
/*function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}*/
/*function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}*/

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Username:</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Text>Password:</Text>
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({username, password})} />
    </View>
  );
}

const Stack = createStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          //animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="homeStack"
        component={HomeStack}
        options={{
         // headerShown: false,
          title: 'Home',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
              <Stack.Screen
        name="FormList"
        component={FormList}
        options={{
          title: 'My home',
          //headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            <Icons
              name="menu"
              onPress={() => props.navigation.toggleDrawer()}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('This is a button!')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="FormTab"
        component={FormTab}
        options={{
          title: 'Forms',
          //headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            <Icons
              name="arrow-left"
              onPress={() => props.navigation.navigate('FormList')}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('This is a button!')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="FormMain"
        component={FormMain}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'My home',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            <Icons
              name="menu"
              //onPress={() => alert()}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('This is a button!')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Submit1
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
            <Stack.Screen
        name="formStack"
        component={FormStack}
        options={{
         // headerShown: false,
          title: 'Home',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
        <Stack.Screen
        name="FormList"
        component={FormList}
        options={{
          title: 'My home',
          //headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            <Icons
              name="menu"
              onPress={() => props.navigation.toggleDrawer()}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('This is a button!')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Submit2
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="FormTab"
        component={FormTab}
        options={{
          title: 'Forms',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
         
            <Text></Text>

          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('Form submitted Sucessfully !')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Submit3
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="FormMain"
        component={FormMain}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );
}
const FormStack = props => {
  return (
    <Stack.Navigator initialRoute="FormList">
      <Stack.Screen
        name="FormList"
        component={FormList}
        options={{
          title: 'My home',
          //headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            {
              /**
                          <Icons
              name="menu"
              onPress={() => props.navigation.toggleDrawer()}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
              
               */
            }

          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('Form submitted Sucessfully')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Submit4
              </Text>
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="FormTab"
        component={FormTab}
        options={{
          title: 'Forms',
          //headerShown: false,
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            <Icons
              name="arrow-left"
              onPress={() => props.navigation.navigate('FormList')}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('This is a button!')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="FormMain"
        component={FormMain}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          // animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );
};
function DrawerStack() {
  return <Text></Text>;
}
function TabStack() {
  return <Text></Text>;
}
function Root() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Loading"
        component={LoadingScreen}
        options={{
          headerShown: false,
          title: 'LoadingScreen',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'My home',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: 'black',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
            alignSelf: 'center',
          },
          headerLeft: () => (
            <Icons
              name="menu"
              //onPress={() => alert()}
              size={30}
              color="#000"
              style={{marginLeft: 10}}
            />
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => alert('This is a button!')}>
              <Text
                style={{
                  color: 'purple',
                  fontWeight: 'bold',
                  marginRight: 10,
                }}>
                Save
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="HomePaperScreen"
        component={HomePaperScreen}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />

      <Stack.Screen
        name="FormTab"
        component={FormTab}
        options={{
          //headerShown: false,
          title: 'Forms',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
      <Stack.Screen
        name="FormMain"
        component={FormMain}
        options={{
          headerShown: false,
          title: 'Sign in',
          // When logging out, a pop animation feels intuitive
          // You can remove this if you want the default 'push' animation
          animationTypeForReplace: state.isSignout ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );
}
export default function App({navigation}) {
  const [locale, setLocale] = React.useState(i18n.locale);
  const localizationContext = React.useMemo(
    () => ({
      t: (scope, options) => i18n.t(scope, {locale, ...options}),
      locale,
      setLocale,
    }),
    [locale],
  );
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        /**3 */
       /* userToken = await AsyncStorage.getItem('userToken');
        console.log('USER TOKEN' + userToken);*/

       // userToken = await AsyncStorage.getItem('userFullname');
       // console.log('USER TOKEN' + userToken);
       
      //  alert(userToken);
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);
  const scheme = useColorScheme();
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token
        try {
          /**4 */
         // await AsyncStorage.setItem('userToken', 'stored value2');
        } catch (e) {
          // saving error
        }

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => {
        /**5 */
        //AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      },
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
    }),
    [],
  );

  if (state.isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }
  /**1 */
  /*const token = AsyncStorage.getItem('token');
*/
const token=null;
  return (
    <AuthContext.Provider value={authContext}>
      <LocalizationContext.Provider value={localizationContext}>
        <NavigationContainer
          theme={scheme === 'dark' ? DefaultTheme : DefaultTheme}>
    <Stack.Navigator>
      <Stack.Screen name="SignIn" component={AuthStack}      options={{
          headerShown: false,}} />
    </Stack.Navigator>
        </NavigationContainer>
      </LocalizationContext.Provider>
    </AuthContext.Provider>
  );
}
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
