import React from 'react';
import { Text, TouchableWithoutFeedback, View, Image,Linking } from 'react-native';
import styles from './style';
const CardBox = (props) => {
    const name = props.name;
    const screen = props.screen;
    const icon = props.icon;
    const link=props.link;
    const parentProps=props.parentProp;
    return (
        <TouchableWithoutFeedback
            onPress={() =>
                {
                    link=='screen'?
                    parentProps.navigation.navigate(screen)
                   :
                    link=='website'?Linking.openURL(screen):
                    null
                }
            }
        >
            <View style={styles.GridViewBlockStyle}>
                <View style={styles.boxTextWrapper}>
                    <Image
                        source={icon}
                        style={styles.gridImage}
                    />
                    <Text style={styles.boxText}>{name}</Text>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
export default CardBox;