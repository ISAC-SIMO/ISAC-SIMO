import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Slider,
  Dimensions,

  CameraRoll,
  Alert
} from "react-native";
import { RNCamera } from "react-native-camera";
import ImageEditor from "@react-native-community/image-editor";

export default class CameraScreen extends Component {
  constructor(props) {
    super();
    let { width } = Dimensions.get("window");
    this.maskLength = (width * 90) / 100;
  }

  state = {
    type: "back",
    ratio: "16:9",
    ratios: [],
    photoId: 1,
    photos: [],
    croppedImageURI: undefined
  };

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  setRatio(ratio) {
    this.setState({
      ratio
    });
  }

  failure(msg) {
    const data = msg;
    const strData = JSON.stringify(data);
    console.log("failed:", strData);
  }

  newImage = newUri => {
    const data = newUri;
    const strData = JSON.stringify(data);
    this.setState({ croppedImage: strData });
    console.log(croppedImage);
  };

  takePicture = async function() {
    if (this.camera) {
      this.camera.takePictureAsync({forceUpOrientation: true, fixOrientation: true}).then(data => {
       let strData = data.uri
      // CameraRoll.saveToCameraRoll(data.uri);



      ImageEditor.cropImage(strData, {
        offset: {
          x:200,y:865
        },
        size: {
          width:1850, height:2000
        },

      }).then(url => {
        console.log("Cropped image uri", url);
        this.setState({croppedImageURI:url})
        Alert.alert("Saved to Camera Roll");
        this.props.navigation.replace('rncamera2',
      
      {
        resData: url
        
      }
      
      )

      })

    });



    }
  };

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={styles.preview}
        type={this.state.type}
        ratio={this.state.ratio}
       /* permissionDialogTitle={"Permission to use camera"}
        permissionDialogMessage={
          "We need your permission to use your camera phone"
        }*/
      >
        <View style={styles.overlay} />
        <View style={styles.snapText}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>
            PLACE IMAGE INSIDE THE FRAME
          </Text>
        </View>
        <View style={[styles.contentRow, { height: this.maskLength }]}>
          <View style={styles.overlay} />

          <View
            style={[
              styles.content,
              { width: this.maskLength, height: this.maskLength }
            ]}
          />
          <View style={styles.overlay} />
        </View>
        <View style={styles.snapText}>
          <TouchableOpacity
            style={[styles.flipButton, styles.picButton]}
            onPress={this.takePicture.bind(this)}
          >
            <Text style={styles.flipText}> SNAP </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overlay} />
      </RNCamera>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderCamera()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#000"
  },

  snap: {
    alignItems: "center"
  },
  snapText: {
    alignItems: "center",
    fontSize: 15
  },
  flipButton: {
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center"
  },

  picButton: {
    backgroundColor: "darkseagreen"
  },

  row: {
    flexDirection: "row"
  },

  preview: {
    flex: 1
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)"
  },
  contentRow: {
    flexDirection: "row"
  },
  content: {
    borderWidth: 3,
    borderColor: "#00FF00"
  },
  snapText: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)"
  }
});