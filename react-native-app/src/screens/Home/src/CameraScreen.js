import React, { Component } from 'react';
import {
  Alert
} from 'react-native';
import { CameraKitCameraScreen,CameraKitCamera } from 'react-native-camera-kit';


export default class CameraScreen extends Component {


  onBottomButtonPressed(event) {
    const captureImages = JSON.stringify(event.captureImages);
    Alert.alert(
      `${event.type} button pressed`,
      `${captureImages}`,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false }
    );
    if (Platform.OS === 'android') {
      ImageEditor.cropImage(`file://${image.uri}`, {
        offset: { x: 0, y: 0 },
        size: { width: image.width, height: image.width }
      },
        (uri) => console.log('New cropped image uri', uri),
        () => console.log('FAILED')
        )
} 
  }

  render() {
    return (
<CameraKitCamera
  ref={cam => this.camera = cam}
  style={{
    flex: 1,
    backgroundColor: 'white'
  }}
  cameraOptions={{
    flashMode: 'auto',             // on/off/auto(default)
    focusMode: 'on',               // off/on(default)
    zoomMode: 'on',                // off/on(default)
    ratioOverlay:'1:1',            // optional, ratio overlay on the camera and crop the image seamlessly
    ratioOverlayColor: '#00000077' // optional
  }}
  onReadQRCode={(event) => console.log(event.nativeEvent.qrcodeStringValue)} // optional
  
/>
    );
  }
}



