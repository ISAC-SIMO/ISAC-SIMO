import React,{useEffect,useState} from 'react';
import { Button ,TextInput} from 'react-native-paper';
import {
  ActivityIndicator,
  Text,View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../../context/authcontext";
import { StyleSheet, Linking, Alert} from 'react-native';
import {Appbar, Avatar, useTheme} from 'react-native-paper';
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
const HomeScreen = (props) => {
    const { signOut } = React.useContext(AuthContext);
  //  const {state,dispatch} = React.useContext(AuthContext)
   const [email,setEmail] = useState("loading");
   const [fullName,setFullName] = useState("loading");
   const [image,setImage] = useState("loading");

   const Boiler = async ()=>{
      const token = await AsyncStorage.getItem("authToken");
      const email = await AsyncStorage.getItem("userEmail");
      const fullName = await AsyncStorage.getItem("userFullname");
      const image = await AsyncStorage.getItem("userImage");
     // userFullname
     setFullName(fullName);
      setEmail(email);
      setImage(image)

   }
useEffect(()=>{
   Boiler()
},[])

   const logout =(props)=>{
      AsyncStorage.removeItem("authToken");
      
      /**
       * 
       *                     await AsyncStorage.setItem('userFullname', data2.full_name);
                    await AsyncStorage.setItem('userId', data2.id.toString());
                    await AsyncStorage.setItem('userEmail', data2.email);
                    await AsyncStorage.setItem('userType', data2.user_type);
                    await AsyncStorage.setItem('userImage', data2.image);
       */
   }

  return (
   <> 
        <View style={styles.userInfoSection}>
          <Avatar.Image
            source={{
              uri: image,
            }}
            size={50}
          />
          
       
       
        
        
          <Title style={styles.title}>{fullName}</Title>
          <Caption style={styles.caption}>{email}</Caption>
          <View
            style={{
              marginHorizontal: 5,
              paddingHorizontal: 5,
              height: 1,
              borderColor: 'black',
            }}></View>
        </View>


    <Button 
        mode="contained"
        style={{marginLeft:18,marginRight:18,marginTop:18}}
        onPress={signOut}>
        logout
      </Button>
   </>
  );
};



export default HomeScreen;

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