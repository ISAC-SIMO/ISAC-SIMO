import React from 'react';


import QualityCheckList from '../screens/forms/QualityCheckList';
import FormList from '../screens/forms/FormList';
import FormImage from '../screens/forms/FormImageCrop';
import FormVideo from '../screens/forms/FormVideo';
import FormResult from '../screens/forms/FormResult';
import RecordVideo from '../screens/forms/RecordVideo';
import LoginScreen from '../screens/Auth/Login';
import {createStackNavigator} from '@react-navigation/stack';

import {Button, View, Text} from 'react-native';
import { StyleSheet, Linking, Alert} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icons from 'react-native-vector-icons/Feather';
import IconsAnt from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native';
import {DrawerNavigationProp} from '@react-navigation/drawer';
import {Appbar, Avatar, useTheme} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AuthContext } from "../context/authcontext";
import { CommonActions } from '@react-navigation/native';

import Information from '../screens/Information/index';
import Reports from '../screens/Reports/index';

//import AsyncStorage from '@react-native-community/async-storage';
import AAA from "../screens/Home/signout";
import try1 from "../screens/Home/try1";

import rncamera from "../screens/Home/rncamera";
import rncamera2 from "../screens/Home/rncamera2";
import {
  //createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import {
  //useTheme,
  //Avatar,
  Title,
  Caption,
  Paragraph,
  //Text,
  TouchableRipple,
  Switch,
  //Button,
} from 'react-native-paper';

function CustomDrawerContent(props) {
  //alert('here')
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
        <View style={{marginVertical:10}}>
        <AAA/>
        </View>

      </View>

    <View style={{width:'100%',height:2,backgroundColor:'#b19cd9'}}/>

          <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="camera"
                color={color}
                size={size}
              />
            )}
            label="Image Form"
            onPress={() => {props.navigation.navigate('FormImage')}}
          />
                    <DrawerItem
            icon={({ color, size }) => (
              <MaterialCommunityIcons
                name="video"
                color={color}
                size={size}
              />
            )}
            label="Video Form"
            onPress={() => {props.navigation.navigate('FormVideo')}}
          />
      {
        /**
         *       <TouchableRipple onPress={() => {}}>
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
         * 
         * 
         */
      }

    </DrawerContentScrollView>
  );
};

const Stack = createStackNavigator();
const myOptions = {
  header: ({scene, previous, navigation}) => {
    const {options} = scene.descriptor;
    const title =
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
        ? options.title
        : scene.route.name;

    return (
      <Appbar.Header theme={{colors: {primary: '#fff'}}}>
      
        {scene.route.name != 'FormList' ? (
  
<TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => {

              navigation.navigate('Home', {screen: 'FormList'});
              //((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
              //navigation.navigate('Home', {screen: 'FormList'})
            }}>
            <IconsAnt name="arrowleft" color="#000" size={32} />
    </TouchableOpacity>
         
        ) : 
        
       
        
        (
          <TouchableOpacity
            style={{marginLeft: 10}}
            onPress={() => {
              //((navigation as any) as DrawerNavigationProp<{}>).openDrawer();
              navigation.openDrawer();
            }}>
            <Icons name="align-right" color="#000" size={32} />
          </TouchableOpacity>
        )}
        <Appbar.Content
          title={
            title === 'Feed' ? (
              <MaterialCommunityIcons
                style={{marginRight: 10}}
                name="twitter"
                size={40}
                color="#000"
              />
            ) : (
              title
            )
          }
          titleStyle={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#000',
          }}
        />
      </Appbar.Header>
    );
  }
}


function QualityCheckNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      //initialRouteName="FeedList"
      headerMode="screen"
      screenOptions={myOptions}
      
      >
      
      
         <Stack.Screen name="QualityCheckList" component={QualityCheckList} 
         
         options={{
          title: 'FormList'
        }}
         
         />
         <Stack.Screen name="rncamera2" component={rncamera2} />
            <Stack.Screen name="FormResult" component={FormResult} />
      
   

      <Stack.Screen name="FormImage" component={FormImage} 
          options={{
            title: 'Image Form'
          }}
      
      options={{...myOptions,headerRight: () => (
       <Text>dddd</Text>
          )}} />
      <Stack.Screen name="FormVideo" component={FormVideo} 
            options={{
              title: 'Video Form'
            }}
      
      />
      <Stack.Screen name="RecordVideo" component={RecordVideo} mode="modal" options={{...myOptions,headerShown:false}}/>
      <Stack.Screen name="Information" component={Information} 
      
      options={{
        title: 'Information'
      }}
      />
           <Stack.Screen name="Reports" component={Reports} 
      
      options={{
        title: 'Reports'
      }}
      />
    
      
    
    </Stack.Navigator>
  );
}

function HomeNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      //initialRouteName="FeedList"
      headerMode="screen"
      screenOptions={myOptions}>
      
      {
        /**
         * <Stack.Screen name="FormList" component={FormList} />
         <Stack.Screen name="rncamera2" component={rncamera2} />
            <Stack.Screen name="FormResult" component={FormResult} />
      
   

      <Stack.Screen name="FormImage" component={FormImage} options={{...myOptions,headerRight: () => (
       <Text>dddd</Text>
          )}} />
      <Stack.Screen name="FormVideo" component={FormVideo} />
      <Stack.Screen name="RecordVideo" component={RecordVideo} mode="modal" options={{...myOptions,headerShown:false}}/>
     
         * 
         * 
         */
      }
         
         <Stack.Screen name="FormList" component={FormList} />
     
      <Stack.Screen name="Information" component={Information} 
      
      options={{
        title: 'Information'
      }}
      />
            <Stack.Screen name="Reports" component={Reports} 
      
      options={{
        title: 'Reports'
      }}
      />
            <Stack.Screen name="QualityCheck" component={QualityCheckNavigator} 
      
      options={{
        title: 'QualityCheck'
      }}
      />
    
      
    
    </Stack.Navigator>
  );
}





const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={props => CustomDrawerContent(props)}>
    
      <Drawer.Screen name="Home" component={HomeNavigator} />
      
      <Drawer.Screen name="Notifications" component={try1} />
  
    </Drawer.Navigator>
  );
}

//export default HomeNavigator;
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
