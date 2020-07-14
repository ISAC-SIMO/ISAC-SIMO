import * as React from 'react';
import { Appbar, Button, Text } from 'react-native-paper';

const ContentTitle = ({ title, style }) => (
  <Appbar.Content
    title={<Text style={style}> {title} </Text>}
    style={{ alignItems: 'center' }}
  />
);

const App = () => (
  <Appbar.Header style={{background:"#fff"}}> 
    <Appbar.Action icon="close" onPress={() => {
console.log("ss");
    }
    
    //this.close()
    } />
    <ContentTitle title={'Go Page'} style={{color:'white'}} />

  </Appbar.Header>
);

export default App;