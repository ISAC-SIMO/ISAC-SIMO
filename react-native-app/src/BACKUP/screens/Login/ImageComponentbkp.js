

import React from 'react';
import {
  Image,
  PixelRatio,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import IconsAnt from 'react-native-vector-icons/AntDesign';
 class ImageComponent extends React.Component {
  state = {
    avatarSource: null,
    avatarSource1: null,
    avatarSource2: null,
    avatarSource3: null,

  };

  constructor(props) {
    super(props);

    this.selectPhotoTapped1 = this.selectPhotoTapped1.bind(this);
    this.selectPhotoTapped2 = this.selectPhotoTapped2.bind(this);
    this.selectPhotoTapped3 = this.selectPhotoTapped3.bind(this);

    
}

  selectPhotoTapped1() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource1: source,
        });
      }
    });
  }
  selectPhotoTapped2() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource2: source,
        });
      }
    });
  }

  selectPhotoTapped3() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource3: source,
        });
      }
    });
  }


  
  render() {
    return (
      <View style={styles.container}>


<Text>
                    {' '}
                    <Text style={styles.required}>* </Text>Image 1
                  </Text>
        <TouchableOpacity onPress={this.selectPhotoTapped1.bind(this)}>
          <View
            style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            {this.state.avatarSource1 === null ? (
                <IconsAnt name="camerao" size={50} color="#bedff6" />
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource1} />
            )}
          </View>
        </TouchableOpacity>
        <Text>
                    {' '}
                    <Text style={styles.required}>* </Text>Image 2
                  </Text>
        <TouchableOpacity onPress={this.selectPhotoTapped2.bind(this)}>
          <View
            style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            {this.state.avatarSource2 === null ? (
                <IconsAnt name="camerao" size={50} color="#bedff6" />
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource2} />
            )}
          </View>
        </TouchableOpacity>
        <Text>
                    {' '}
                    <Text style={styles.required}>* </Text>Image 3
                  </Text>
        <TouchableOpacity onPress={this.selectPhotoTapped3.bind(this)}>
          <View
            style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            {this.state.avatarSource3 === null ? (
                <IconsAnt name="camerao" size={50} color="#bedff6" />
            ) : (
              <Image style={styles.avatar} source={this.state.avatarSource3} />
            )}
          </View>
        </TouchableOpacity>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150,
  },
  cardWrapper: {
    marginTop: 10,
    marginHorizontal: 10,
    padding: 0,
  },

  required: {
    color: 'red',
  },
  label: {
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
    paddingVertical: 3,
  },
  customBtnDNG: {
    backgroundColor: '#9ec54d',
    // paddingHorizontal: 30,
    // paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    width: '90%',
    height: 50,
    // marginBottom:10,
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '300',
    alignItems: 'center',
    justifyContent: 'center',

    color: '#fff',
  },
  avatarContainer: {
    backgroundColor: '#fff',

    borderColor: '#bedff6',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    borderRadius: 75,
    width: 100,
    height: 100,
  },

  newText: {
    fontSize: 14,
    paddingBottom: 5,
    color: '#000',
  },

  newInput: {
    height: 35,
    marginBottom: 0,
    padding: 2,
    //backgroundColor: '#fff',
    // borderRadius: 4,

    borderWidth: 0,
    width: '100%',
    fontSize: 15,

    backgroundColor: '#F8F9FC',

    color: '#000',
    // fontSize: 15,

    //  paddingVertical:
    //  Platform.OS === "ios" ? 7 : 0,
    //  paddingHorizontal: 7,
    borderRadius: 4,
    borderColor: '#ccc',
    //borderWidth: 1,
  },
  pickerIcon: {
    backgroundColor: 'transparent',
    right: 5,
    paddingLeft: 5,
    marginLeft: 0,
    marginTop: 20,
    flex: 1,
    position: 'absolute',
    top: -15,
    zIndex: 1000,
    color: '#012552',
    fontSize: 20,
  },
  panelIcon: {
    marginTop: 2,
    marginRight: 2,
  },
});

export default  ImageComponent;
const picker = StyleSheet.create({
    pickerContainer: {
      borderColor: '#dee1df',
      borderWidth: 1,
      borderRadius: 4,
    },
    pickerIcon: {
      backgroundColor: 'transparent',
      right: 5,
      paddingLeft: 5,
      marginLeft: 0,
      marginTop: 20,
      flex: 1,
      position: 'absolute',
      top: -15,
      zIndex: 1000,
      color: '#012552',
      fontSize: 20,
    },
    pickerMain: {
      height: 35,
      marginBottom: 0,
      padding: 0,
      backgroundColor: '#F8F9FC',
  
      borderColor: 'red',
      borderWidth: 0,
    },
  });
 
  