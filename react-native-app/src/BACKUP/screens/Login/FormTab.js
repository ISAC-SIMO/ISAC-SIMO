// You can import Ionicons from @expo/vector-icons if you use Expo or
// react-native-vector-icons/Ionicons otherwise.
import * as React from 'react';
import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import FormMain from './FormMain';

function SettingsScreen() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Saved Data</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export function App() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({})}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Forms"
        component={FormMain}
        options={{
          title: 'Forms',
       
          headerShown: true,
          headerStyle: {
            backgroundColor: '#000',
          },
          tabBarIcon: () => (
            <Ionicons name="form" color="red" size={32}></Ionicons>
          ),
        }}
      />
      <Tab.Screen
        name="Saved Data"
        component={SettingsScreen}
        options={{
          title: 'Saved Data',

          tabBarIcon: () => (
            <Ionicons name="database" color="red" size={32}></Ionicons>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default App;
