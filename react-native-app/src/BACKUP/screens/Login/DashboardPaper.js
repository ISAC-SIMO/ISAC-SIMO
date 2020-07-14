import * as React, { Component, PropTypes } from 'react';
import {useState} from 'react';
import {View, StyleSheet, Linking, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Text,
  TouchableRipple,
  Switch,
  Button,
} from 'react-native-paper';
import {MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeScreen from './HomePaper';
import FormList from './FormList';
import FormTab from './FormTab';
import AuthStack from '../../navigation/AuthStack';
import AuthContext from '../../AuthContext';
import AsyncStorage from '@react-native-community/async-storage';
//const CustomDrawerContent = async (props) => {
//const CustomDrawerContent = async (props) => {
  function CustomDrawerContent(props) {
  // const signOut=Alert.alert('ddd');
  const username=  'aa';
  //const uu=useState('userFullName'); 
  try {
    const value =  AsyncStorage.getItem('userFullname');
    if(value !== null) {
      
      this.username=value;
    }
  } catch(e) {
    // error reading value
  }
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
          <Text>{JSON.stringify(AuthContext.data)}</Text>
          <Button
            mode="contained"
            style={{marginLeft: 18, marginRight: 18, marginTop: 18}}
            onPress={() => logout(props)}>
            logout
          </Button>
          <Title style={styles.title}>fff</Title>
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

const Drawer = createDrawerNavigator();
const logout = props => {
  AsyncStorage.removeItem('token').then(() => {
    props.navigation.replace('AuthStack');
  });
};
function MyDrawer() {
  const {signOut} = React.useContext(AuthContext);
  return (
    <Drawer.Navigator drawerContent={props => CustomDrawerContent(props)}>
      <Drawer.Screen
        name="FormList"
        component={FormList}
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
      <Drawer.Screen name="Forms" component={FormTab} />
    </Drawer.Navigator>
  );
}

export function App() {
  return <MyDrawer />;
}

export default App;

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
