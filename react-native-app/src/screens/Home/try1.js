import React, {Component} from 'react';
import {
  View, Text, StyleSheet, ScrollView, Alert,
  Image, TouchableOpacity, NativeModules, Dimensions
} from 'react-native';

import Video from 'react-native-video';

var ImagePicker = NativeModules.ImageCropPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    backgroundColor: 'blue',
    marginBottom: 10
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  }
});

export default class App extends Component {

  constructor() {
    super();
    this.state = {
      image: null,
      images: null
    };
  }

  pickSingleWithCamera(cropping, mediaType='photo') {
    ImagePicker.openCamera({
      cropping: cropping,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType,
      freeStyleCropEnabled:true,
      avoidEmptySpaceAroundImage:true,
      cropperActiveWidgetColor:'red',
      //cropperStatusBarColor:'green',
     // cropperToolbarColor:'pink',
      //cropperToolbarTitle:'pinkdddddddd',
      cropperToolbarTitle:'edit image',
      cropperToolbarColor:'red',
      hideBottomControls:true,
      enableRotationGesture:true,
      showCropGuidelines:false,

    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null
      });
    }).catch(e => alert(e));
  }



  pickSingle(cropit, circular=false, mediaType) {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: cropit,
      cropperCircleOverlay: circular,
      sortOrder: 'none',
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      compressVideoPreset: 'MediumQuality',
      includeExif: true,

    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: {uri: image.path, width: image.width, height: image.height, mime: image.mime},
        images: null
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }



  scaledHeight(oldW, oldH, newW) {
    return (oldH / oldW) * newW;
  }



  renderImage(image) {
    return <Image style={{width: 300, height: 300, resizeMode: 'contain'}} source={image} />
  }

  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }

  render() {
    return (<View style={styles.container}>
      <ScrollView>
        {this.state.image ? this.renderAsset(this.state.image) : null}
       
      </ScrollView>


      <TouchableOpacity onPress={() => this.pickSingleWithCamera(true)} style={styles.button}>
        <Text style={styles.text}>Select Single With Camera With Cropping</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => this.pickSingle(true)} style={styles.button}>
        <Text style={styles.text}>Select Single With Cropping</Text>
      </TouchableOpacity>

    </View>);
  }
}