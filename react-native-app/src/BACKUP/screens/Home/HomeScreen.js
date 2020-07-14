import React, {Component} from 'react';
import {Text, View,Button} from 'react-native';
import AuthContext from '../../AuthContext';
function HomeScreen() {
  const {signOut} = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

export default HomeScreen;
