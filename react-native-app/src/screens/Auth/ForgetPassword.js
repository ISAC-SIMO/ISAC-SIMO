import React, {memo, useState,PropTypes} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Alert} from 'react-native';
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
      <Logo />

      <Header>Forget Password.</Header>

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

      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.label}>Back to Login Screen</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={_onButtonPressed}>
        Request Password
      </Button>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
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
});

export default ForgetPassword;
