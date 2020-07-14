import React, {useEffect, useState} from 'react';
import {Button, TextInput} from 'react-native-paper';
import {ActivityIndicator, Text} from 'react-native';

import {Avatar, Card, Title, Paragraph} from 'react-native-paper';
import {View, StyleSheet, FlatList, SafeAreaView, Image} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-community/async-storage';
//import LocalizationContext from '../../LocalizationContext';
type Props = {
  navigation: Navigation,
};
/*const DATA = [
  {
    id: '1',
    title: 'Image Form',
    description: 'First Form description',
    link:'FormImage',
    icon:'camera'
  },
  {
    id: '2',
    title: 'Video Form',
    description: 'First Form description',
    link:'FormVideo',
    icon:'video'
  }
];

*/
const DATA = [
  {
    id: '1',
    title: 'Information',
    description: 'First Form description',
    link:'Information',
    icon:'server'
  },
  {
    id: '2',
    title: 'Quality Check',
    description: 'First Form description',
    link:'QualityCheck',
    icon:'check-circle'
  },
  {
    id: '3',
    title: 'Reports',
    description: 'First Form description',
    link:'Reports',
    icon:'chart-bar'
  }
];
const Item = ({title}) => {
  //function Item({title},props) {
  return (
    <Card
      style={styles.cardWrapper}
      elevation={5}
     // onPress={() => this.logout(props)}
      //  onPress={() => nav(props)}
    >
      <Card.Title
        title={title}
        //subtitle="Card Subtitle"
        left={props => <Avatar.Icon {...props} icon="folder" />}
      />
      <Card.Content>
        <Icons
          name="forms"
          size={60}
          color="black"
          style={{alignSelf: 'center'}}
        />
      </Card.Content>
    </Card>
  );
};
const FormList = props => {
 // const {t, locale, setLocale} = React.useContext(LocalizationContext);
  const [email, setEmail] = useState('loading');
  const Boiler = async () => {
    const token = await AsyncStorage.getItem('token');
   /* fetch('http://10.0.2.2:3000/', {
      headers: new Headers({
        Authorization: 'Bearer ' + token,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setEmail(data.email);
      });*/
  };
  useEffect(() => {
    // Boiler()
  }, []);

  const logout = props => {
    AsyncStorage.removeItem('token').then(() => {
      props.navigation.replace('LoginScreen');
    });
  };
  const nav = (props,link) => {
    //  AsyncStorage.removeItem('token').then(() => {
      //  alert(link);
    props.navigation.replace(link);
    // });
  };

  return (
    <>
    {}
    {
      /**
      
            <Text>Current locale: {locale}. </Text>
      <Text>
        {locale !== 'en' && locale !== 'fr'
          ? 'Translations will fall back to "en" because none available'
          : null}
      </Text>
      <Text>{t('bar', {someValue: Date.now()})}</Text>
      {locale === 'en' ? (
        <Button title="Switch to French" onPress={() => setLocale('fr')} />
      ) : (
        <Button title="Switch to English" onPress={() => setLocale('en')} />
      )}
       */
    }


      <FlatList
        data={DATA}
        renderItem={({item}) => (
          <Card
            style={styles.cardWrapper}
            elevation={5}
            onPress={() => nav(props,item.link)}

            //  onPress={() => nav(props)}
          >
            <Card.Title
              title={item.title}
              //subtitle="Card Subtitle"
              left={props => <Avatar.Icon {...props} icon="bars" />}
            />
            <Card.Content>
              <Icons
                name={item.icon}
                size={60}
                color="black"
                style={{alignSelf: 'center'}}
              />
            </Card.Content>
          </Card>
        )}
        keyExtractor={item => item.id}
      />
    </>
  );
};

export default FormList;

const styles = StyleSheet.create({
  cardWrapper: {
    marginHorizontal: 5,
    marginTop: 5,
    marginBottom: 6,
    padding: 0,
    height: 150,
    borderRadius: 10,
  },
  cardTitle: {
    margin: 0,
  },
});
