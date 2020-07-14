import React, {memo, useState,PropTypes} from 'react';
import {View, Text, StyleSheet, TouchableOpacity,ScrollView,ActivityIndicator} from 'react-native';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';
import BackButton from '../../components/BackButton';
import {theme} from '../../core/theme';
//import {Navigation} from '../types';
import {emailValidator, passwordValidator, nameValidator} from '../../core/utils';
import { RegisterURL } from "../../config/API";
type Props = {
  navigation: Navigation,
};

const RegisterScreen = ({navigation}: Props) => {
  const [name, setName] = useState({value: '', error: ''});
  const [email, setEmail] = useState({value: '', error: ''});
  const [password, setPassword] = useState({value: '', error: ''});
  const [loading, setLoading] = useState(false);

  const _onSignUpPressed = async (props) => {

    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || nameError) {
      setName({...name, error: nameError});
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    
    }
    setLoading(true);
    fetch('https://isac-simo.herokuapp.com/api/register/',{
      method:"POST",
      headers: {
       'Content-Type': 'application/json'
     },
     body:JSON.stringify({
      full_name:name,
      image:"",


       "email":email,
       "password":password
     })
    })
    .then(res=>res.json())
    .then(async (data)=>{
           try {
            setLoading(false);
             console.log(data);
            // await AsyncStorage.setItem('token',data.token)
            // props.navigation.replace("home")
           } catch (e) {
            setLoading(false);
             console.log("error aayo",e)
           }
    })
    .catch((error) => {
      setLoading(false);
      console.error(error);
    });
    setLoading(false);
    navigation.navigate('LoginScreen');
  };



  return (
    <ScrollView>
    <Background>
      <BackButton goBack={() => navigation.navigate('LoginScreen')} />

      <Logo />
      <Button title="Skip Authentication" mode="contained"
   onPress={()=>{
    navigation.navigate('FormWithoutAuth')
   }}
   >
   <Text>Skip Authentication</Text>

   </Button>
   <Text>OR</Text>
   <Text style={{color:theme.colors.primary,fontWeight:'bold'}}>Sign In</Text>
      <Header>Create Account</Header>

      <TextInput
        label="Full Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={text => setName({value: text, error: ''})}
        error={!!name.error}
        errorText={name.error}
      />

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
     
      <Button mode="contained" onPress={_onSignUpPressed} style={styles.button}
      disabled={loading==true?true:false}
      icon="login"
      >
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
  },
  button: {
    marginTop: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom:50
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default RegisterScreen;
