import React, { PureComponent } from 'react';
import { View, Text, Image, Button ,StyleSheet,ScrollView} from 'react-native';
import ImageEditor from "@react-native-community/image-editor";
class componentName extends PureComponent {
  constructor(route,props) {
    super(props);
    var resData = '';
    resData=route.route.params.resData;
    console.log('ResDATA'+JSON.stringify(route));
    console.log('ResDATA2'+JSON.stringify(resData));
    this.state = {
      original_image:resData,
      cropped_image:''
    };
  }

  cropMyImage (){
   

   /* ImageEditor.cropImage(this.state.original_image, {
      offset: {x: 1100, y: 600},
      size: {width: 200, height: 200},
     // displaySize: {width: 500, height: 500},
      //resizeMode: 'contain',
    }).then(url => {
      console.log("Cropped image uri", url);
      this.setState({
        cropped_image: url
      })
    })*/


    Image.getSize(this.state.original_image, (w, h) => {
     const a=h / 2 - w / 2;
   
      const cropData = {
        offset: {
          x: 0,
          y: h / 2 - w / 2,
        },
        size: {
          width: w,
          height: w,
        },

      };
      ImageEditor.cropImage(this.state.original_image, {
        offset: {
          x: w*2,
          y: h / 1.5 - w / 2,
        },
        size: {
          width: w,
          height: w,
        },

      }).then(url => {
        console.log("Cropped image uri", url);
        this.setState({
          cropped_image: url
        })
      })

    });

  }

  render() {
    return (
      <ScrollView>
        <Text> original image </Text>
        {
          /**
           *        <Image
          style={styles.tinyLogo}
          source={{
            uri: this.state.original_image,
          }}
        />
           * 
           * 
           */
        }
             <Image
          style={styles.tinyLogo}
          source={{
            uri: this.state.original_image,
          }}
        />
 
        <Button
 onPress={() => this.cropMyImage()}
          title="Crop My IMage"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        <Text> Cropped image </Text>
        {
          this.state.cropped_image == '' ? <Text>Nothing cropped</Text> :       <Image
          style={styles.tinyLogo}
          source={{
            uri: this.state.cropped_image,
          }}
        />
        }
      </ScrollView>
    );
  }
}

export default componentName;
const styles = StyleSheet.create({
  container: {
    //paddingTop: 50,
  },
  tinyLogo: {
    //flex:2,
    backgroundColor:'red',

    width: 250,
    height: 250,
  //  aspectRatio: 1/1,
   // height:1000
    resizeMode:'cover'
  },
  logo: {
    width: 66,
    height: 58,
  },
});

