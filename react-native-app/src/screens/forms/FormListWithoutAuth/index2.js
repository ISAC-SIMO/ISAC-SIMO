import React from "react";
import {FlatList} from 'react-native';
import styles from './style';
import CardBox from '../../../components/CardBox/index';

const AskHelp=(props)=>{

const GridViewItems = [
         {
            key: "One",
            name: "Information",
            screen: "Information",
            imageIcons: require('../../../assets/1.jpeg'),
            link:"screen"
          },
          {
            key: "Two",
            name:  "Quality Control",
            screen: "",
            imageIcons: require('../../../assets/1.jpeg'),
            link:"nolink"
          }
      ];

return(
    <FlatList
      data={GridViewItems}
      renderItem={({ item }) => (
        <CardBox key={item.key} name={item.name} screen={item.screen} icon={item.imageIcons} link={item.link} parentProp={props}/>
      )}
      numColumns={1}
    />
);
};
export default AskHelp;


