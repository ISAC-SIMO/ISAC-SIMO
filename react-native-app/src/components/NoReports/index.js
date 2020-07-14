import React from 'react';
import { Text, TouchableOpacity, View,Image } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';


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
        source={require('../../assets/no-reports.png')}
      />
         <Title style={{marginTop:50,marginBottom:20}}>No Reports!</Title>
        <Paragraph style={{textAlign:'center'}}>No report found in the offline database</Paragraph>
        <Card.Actions>

    
        </Card.Actions>
        </Card.Content>

      
      </Card>
    );
};
export default NoData;