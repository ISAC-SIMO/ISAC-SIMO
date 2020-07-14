import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme,Provider as PaperProvider } from 'react-native-paper';
import { AuthContext } from "./src/context/authcontext";

import AuthStack from './src/navigation/AuthStack';
import HomeStack from './src/navigation/HomeStack';

import AsyncStorage from '@react-native-community/async-storage';
import Splash from './src/screens/Auth/Splash';

import AwesomeIcon from 'react-native-vector-icons/AntDesign';
const ScreenContainer = ({ children }) => (
  <View>{children}</View>
);

const RootStack = createStackNavigator();
storeData = async () => {
  try {
    await AsyncStorage.setItem('authToken', 'stored value')
  } catch (e) {
    // saving error
  }
}

getData = async () => {

  AsyncStorage.getItem('authToken', (err, result) => {
    if (!err && result != null) {
      // alert("1"+result);
      return result;
    }
    else {
      //alert("2"+result);
      return 'no-data';
      // do something else
    }
    //callback(result);
  });
}
removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  }
  catch (exception) {
    return false;
  }
}


const RootStackScreen = ({ userToken }) => (
  //console.log("usertoken"+JSON.stringify(userToken));

  <RootStack.Navigator headerMode="none">
    {userToken ? (
      <RootStack.Screen
        name="App"
        component={HomeStack}
        options={{
          animationEnabled: false
        }}
      />
    ) : (
        <RootStack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            animationEnabled: false
          }}
        />
      )}
  </RootStack.Navigator>


);
/*
function App() {
  return (
    <NavigationContainer>
      <HomeStack />
    </NavigationContainer>
  );
}

export default App;

*/
export default () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [userToken, setUserToken] = React.useState(null);

  console.log("user Toekn" + userToken);
  const authContext = React.useMemo(() => {
    return {
      signIn: () => {
        //  alert('ignin');
        setIsLoading(false);
        this.storeData();
        setUserToken("asdf");
      },
      signUp: () => {
        setIsLoading(false);
        setUserToken("asdf");
        this.getData();
      },
      signOut: () => {
        // alert('ss');
        setIsLoading(false);
        setUserToken(null);
        this.removeData('authToken');
        this.removeData('userFullname');
        this.removeData('userId');
        this.removeData('userEmail');
        this.removeData('userType');
        this.removeData('userImage');

      }
    };
  }, []);

  React.useEffect(() => {
   // setIsLoading(false);
    //alert('d');
    AsyncStorage.getItem('authToken', (err, result) => {
      if (!err && result != null) {
        // alert("1"+result);
        setIsLoading(false);
        //this.storeData();
        setUserToken("asdf");
      }
      else {
        //alert("2"+result);
        // return 'no-data';
        // do something else
      }
      //callback(result);
    });



    setTimeout(() => {
      setIsLoading(false);

    }, 1000);
  }, []);

  if (isLoading) {
    return <Splash />;
  }

  return (
    <AuthContext.Provider value={authContext}>
        <PaperProvider
       // theme={theme}
        settings={{
          icon: props => <AwesomeIcon {...props} />,
        }}>
      <NavigationContainer>
        <RootStackScreen userToken={userToken} />
      </NavigationContainer>

        </PaperProvider>

    </AuthContext.Provider>
  );
};