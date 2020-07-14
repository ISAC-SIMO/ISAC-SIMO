import React, {memo, useState,PropTypes,useContext}from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Alert, Keyboard,ScrollView,ActivityIndicator} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import {Button as PaperButton,} from 'react-native-paper'
import TextInput from '../../components/TextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import {theme} from '../../core/theme';
import {emailValidator, passwordValidator} from '../../core/utils';

import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from "../../context/authcontext";
const LoginScreen = ({navigation}: Props) => {
  const { signIn } = React.useContext(AuthContext);
  const {state,dispatch} = React.useContext(AuthContext);
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [userFullName, setuserFullName] = useState({value: '', error: ''});
  const [loading, setLoading] = useState(false);
  const _onLoginPressed = async () => {
    Keyboard.dismiss;
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }
    setLoading(true);
    var formData = new FormData();
    formData.append('email', email.value);
    formData.append('password', password.value);

  NetInfo.fetch().then(state => {
    if (state.isConnected==true) {
      fetch('https://www.isac-simo.net/api/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
        .then(res => res.json())
        .then(async data => {
          try {
            console.log("@"+JSON.stringify(data));
            if(data.detail){
              alert(data.detail);
            }
            await AsyncStorage.setItem('token', data.access);
            try {
              console.log('login' + JSON.stringify(data));
  
              fetch('https://www.isac-simo.net/api/profile/', {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + data.access,
                  // Authorization: 'Bearer ' + data.access,
                },
              })
                .then(res2 => res2.json())
                .then(async data2 => {
                  try {
                  console.log('profile' + JSON.stringify(data2));
                    console.log('profile' + JSON.stringify(data2));
                    try {
                      setuserFullName({...userFullName, error: 'sss'});
                      await AsyncStorage.setItem('userFullname', data2.full_name);
                      await AsyncStorage.setItem('userId', data2.id.toString());
                      await AsyncStorage.setItem('userEmail', data2.email);
                      await AsyncStorage.setItem('userType', data2.user_type);
                      await AsyncStorage.setItem('userImage', data2.image);
  //alert('ddd');
                     // navigation.navigate('ForgetPasswordScreen');
                     setLoading(false);
                     signIn();
                    // dispatch({type:"signIn"});
                    } catch (e) {
                      setLoading(false);
                      console.log('error bhayo', e);
                      Alert(e);
                    }
                  } catch (e) {
                    console.log('error aayo', e);
                  }
                })
                .catch(error => {
                  setLoading(false);
                  console.error(error);
                });
            } catch (e) {
              setLoading(false);
              console.log('error bhayo', e);
              Alert(e);
            }
          } catch (e) {
            setLoading(false);
            console.log('error aayo', e);
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(error);
        });
    } else {
      setLoading(false);
      Alert.alert("You are not connected to internet!");
    }
  });

   
  };

  return (
    <ScrollView> 
    <Background>
     
      <Logo />

      <Header>Welcome to ISAC-SIMO .</Header>



  
   <Button title="Skip Authentication" mode="contained" 
   onPress={()=>{
     navigation.navigate('FormWithoutAuth')
   }}
   >
   Skip Authentication

   </Button>
   <Text>OR</Text>
   <Text style={{color:theme.colors.primary,fontWeight:'bold'}}>Sign In</Text>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={text => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={text => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />


  {
    loading==true?
    <ActivityIndicator animating={true} color="purple" />
    :null
  }
      

      <PaperButton mode="contained" 
     onPress={_onLoginPressed}
     icon="login"
      title="Login"
      disabled={loading==true?true:false}
      >
        <Text>LOgin</Text>
      </PaperButton>
{
  /**
   *       <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
   * 
   */
}
<View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>

    </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom:50
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default LoginScreen;
