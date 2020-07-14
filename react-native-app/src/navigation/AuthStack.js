import React from 'react';
import LoginScreen from '../screens/Auth/Login';
import RegisterScreen from '../screens/Auth/Register';
import ForgetPasswordScreen from '../screens/Auth/ForgetPassword';
//import CameraApp from "../screens/video/App";
//import FormVideo from '../screens/Home/FormVideo';

import QualityCheckList from '../screens/forms/QualityCheckList';
import FormList from '../screens/forms/FormList';
import FormImage from '../screens/forms/FormImageCrop';
import FormVideo from '../screens/forms/FormVideo';
import FormResult from '../screens/forms/FormResult';
import RecordVideo from '../screens/forms/RecordVideo';
import rncamera2 from "../screens/Home/rncamera2";

import { CommonActions } from '@react-navigation/native';
import { Header, Left, Body, Right, Button, Icon, Title, ActionSheet,Text } from 'native-base';
import IconsAnt from 'react-native-vector-icons/AntDesign'

import FormListWithoutAuth from '../screens/forms/FormListWithoutAuth/index';
import Information from '../screens/Information/index';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const myOptions = {


  header: ({ scene, previous, navigation }) => {
    const { options } = scene.descriptor;
    const title =
      options.headerTitle !== undefined
        ? options.headerTitle
        : options.title !== undefined
          ? options.title
          : scene.route.name;
          

    return (
      <Header>
                    <Left>
                    {scene.route.name == 'FormWithoutAuth' ?
                <Button transparent
                  onPress={() => {
                    // navigation.pop();
                    navigation.dispatch(CommonActions.goBack());
                  }}
                >
                
                  <IconsAnt name='left' style={{color:'#fff'}}/>
  
                </Button>
                :
                <Button transparent
                onPress={() => {
                  
                  navigation.navigate('FormListWithoutAuth2');
                }}
              >
                 
                <IconsAnt name='left' style={{color:'#fff'}}/>

              </Button>
  }
              </Left>
              <Body style={{ flex: 2, textAlign: 'center' }}>
                
                <Text style={{color:'#fff'}}>{JSON.stringify(scene.route.name)}</Text>
              </Body>
              <Right />



      </Header>
    );
  }
}

function InformationNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
  
    >
        <Stack.Screen name="Information" component={Information} />


    </Stack.Navigator>
  );
}
function QualityCheckNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
      //initialRouteName="FeedList"
      headerMode="none"
      screenOptions={myOptions}
    >
     <Stack.Screen name="QualityCheckList" component={FormImage} />
           <Stack.Screen name="rncamera2" component={rncamera2} />
              <Stack.Screen name="FormResult" component={FormResult} />
        
     
  
        <Stack.Screen name="FormImage" component={FormImage} options={{...myOptions,headerRight: () => (
         <Text>dddd</Text>
            )}} />
        <Stack.Screen name="FormVideo" component={FormVideo} />
        <Stack.Screen name="RecordVideo" component={RecordVideo} mode="modal" options={{...myOptions,headerShown:false}}/>
        <Stack.Screen name="Information" component={Information} 
        
        options={{
          title: 'Information'
        }}
        />

    </Stack.Navigator>
  );
}


function NewsNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
   
    >
       <Stack.Screen
          name="FormListWithoutAuth2"
  
          component={FormListWithoutAuth}
          options={{
            title: 'Home'
          }}
  
        />
           <Stack.Screen
          name="InformationNavigator"
  
          component={InformationNavigator}
          options={{
            title: 'Home'
          }}
  
        />
                   <Stack.Screen
          name="QualityCheckNavigator"
  
          component={QualityCheckNavigator}
          options={{
            title: 'Homes'
          }}
  
        />

       
    </Stack.Navigator>
  );
}

function AuthNavigator(): React.ReactElement {
  return (
    <Stack.Navigator
    screen={false}
  //  initialRouteName="HomeScreen"
    //headerMode="screen"
   // screenOptions={myOptions}
    /*  screenOptions={{
        headerShown: false,
      }}
     */
    >


      <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgetPasswordScreen"
        component={ForgetPasswordScreen}
      />
      <Stack.Screen
        name="FormWithoutAuth"

        component={NewsNavigator}
        options={{
          headerShown: false,
          title: 'Home'
        }}
      
      />


    </Stack.Navigator>
  );
}
  export default AuthNavigator;
