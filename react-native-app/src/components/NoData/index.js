import React from 'react';
import { Text, TouchableOpacity, View,Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


import styles from './style';
const NoData = (props) => {
 const parentProps=props.parentProps;
 const bbb=props.bbb;
    return (
        <Card style={{height:'100%'}}>
  
        <Card.Content
        style={{
          flex:1,
          justifyContent: 'center',
          alignItems: 'center',
        
        }}
        
        >
        
          <Image
          style={{
            width:100,
            height:100
          }}
        //style={styles.stretch}
        source={require('../../assets/norecord.png')}
      />
         <Title style={{marginTop:50,marginBottom:20}}>Coming Soon!</Title>
        <Paragraph style={{textAlign:'center'}}>This feature is under construction</Paragraph>
        <Card.Actions>

    
        </Card.Actions>
        </Card.Content>

      
      </Card>
    );
};
export default NoData;