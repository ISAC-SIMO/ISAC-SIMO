import React, {useContext}from 'react';
import { Button, View,Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from "../context/authcontext";
import AsyncStorage from '@react-native-community/async-storage';
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        onPress={() => navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    </View>
  );
}

getData = async () => {
  try {
    const value = await AsyncStorage.getItem('authToken')

    return value;
  } catch(e) {
    // error reading value
    
  }
  return null;
}
function NotificationsScreen({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  const myval=await this.getData();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>sss{myval}</Text>
      <Button onPress={() => signOut} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();

export default function App() {
  return (

    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notificationss" component={NotificationsScreen} />
    </Drawer.Navigator>

  );
}
