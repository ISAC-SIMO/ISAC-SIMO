import React, {memo, useState,PropTypes} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Alert,ActivityIndicator} from 'react-native';
import Background from '../../components/Background';
import Logo from '../../components/Logo';
import Header from '../../components/Header';
import Button from '../../components/Button';
import TextInput from '../../components/TextInput';

import {theme} from '../../core/theme';
import {emailValidator, passwordValidator} from '../../core/utils';

import AsyncStorage from '@react-native-community/async-storage';
const ForgetPassword = ({navigation}: Props) => {
  const [email, setEmail] = useState({value: '', error: ''});

  const _onButtonPressed = async () => {
    console.log('here');
    const emailError = emailValidator(email.value);
   
    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
           return;
    }

    var formData = new FormData();
    formData.append('email', email.value);

    fetch('https://niush.pythonanywhere.com/api/auth/', {
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
        /**
         *
         *
         *
         */
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <Background>
     

      <Header>ISAC-SIMO APP</Header>

      <View style={[styles.container, styles.horizontal]}>

      <ActivityIndicator size="large" color="purple" />

    </View>
    </Background>
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
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});

export default ForgetPassword;
