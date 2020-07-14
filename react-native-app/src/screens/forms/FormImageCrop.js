import { Component } from 'react';
import React, { useEffect, useState, PropTypes } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  PermissionsAndroid,
  Image,
  Platform,
  Alert,
  Keyboard,
  Picker,
  TextInput, Button, NativeModules, Dimensions
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";


import { RNCamera } from "react-native-camera";
import ImageEditor from "@react-native-community/image-editor";
import { Table, Row, Rows, TableWrapper, Col } from 'react-native-table-component';
// import ImagePicker from 'react-native-image-picker'
//import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
//import ImageComponent from './ImageComponent';
import { Appbar,FAB,Button as PaperButton } from 'react-native-paper';

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';

import Geolocation from '@react-native-community/geolocation';
import Icons from 'react-native-vector-icons/FontAwesome';
import IconsArrow from 'react-native-vector-icons/MaterialIcons';
import IconsAnt from 'react-native-vector-icons/AntDesign';

import Modal from 'react-native-modal';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//import LocalizationContext from '../../LocalizationContext';
import ImagePicker from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
var ImagePicker2 = NativeModules.ImageCropPicker;
import { StackActions } from '@react-navigation/native';
//const abc = React.useContext(LocalizationContext);



import { Surface } from 'gl-react-native';
import ImageFilters from 'react-native-gl-image-filters';

import Filter from './Filter';

const width = Dimensions.get('window').width - 80;

const settings = [
  {
    name: 'hue',
    minValue: -100.0,
    maxValue: 100.0,
  },
  {
    name: 'blur',
    maxValue: 2.0,
  },
  {
    name: 'sepia',
    maxValue: 2.0,
  },
  {
    name: 'sharpen',
    maxValue: 2.0,
  },
  {
    name: 'negative',
    maxValue: 2.0,
  },
  {
    name: 'contrast',
    maxValue: 2.0,
  },
  {
    name: 'saturation',
    maxValue: 2.0,
  },
  {
    name: 'brightness',
    maxValue: 2.0,
  },
  {
    name: 'temperature',
    minValue: 1000.0,
    maxValue: 40000.0,
  },
];

type Props = {
  navigation: Navigation,
};
const ContentTitle = ({ title, style }) => (
  <Appbar.Content
    title={<Text style={style}> {title} </Text>}
    style={{ alignItems: 'center' }}
  />
);
const options = [
  'Cancel',
  <Text style={{ color: 'blue' }}>Click a Photo</Text>,
  <Text style={{ color: 'blue' }}>Import from Gallery</Text>,
];

//const HomePage = props => {
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    let { width } = Dimensions.get("window");
    this.maskLength = (width * 90) / 100;
    // const { t, locale, setLocale } = React.useContext(LocalizationContext);
    this.state = {
      token: '',
      selected: undefined,
      Usrname: '',
      photo: null,
      email: '',
      password: '',
      status: '',
      Phone: '',
      long: '',
      lat: '',
      address: '',
      Description: '',
      disaster: '',

      masonry: '',
      external_face: '',
      damage_wall: '',
      storeys: '',
      pickerOptions: [
        { name: 'Yes', id: 1 },
        { name: 'No', id: 2 },
      ],

      avatarSource1: null,
      avatar1data: '',
      avatar1type: '',
      avatarSource2: null,
      avatar2data: '',
      avatar2type: '',
      avatarSource3: null,
      avatar3data: '',
      avatar3type: '',
      avatar4data: '',
      avatar4type: '',
      avatarSource4: null,

      showComponentA: true,
      showComponentB: true,
      showComponentC: true,
      value: null,

      isModalGo: false,
      isModalNogo: false,

      loading: false,
      finalimages: [],

      isModalVisible: false,

      image1file: '',
      image1tested: '',
      image1result: '',
      image1score: '',
      image2file: '',
      image2tested: '',
      image2result: '',
      image2score: '',
      image3file: '',
      image3tested: '',
      image3result: '',
      image3score: '',


      tableHead: ['', 'Head1', 'Head2', 'Head3'],
      tableTitle: ['Title', 'Title2', 'Title3', 'Title4'],
      tableData: [
        ['1', '2', '3'],
        ['a', 'b', 'c'],
        ['1', '2', '3'],
        ['a', 'b', 'c']
      ],
      isLoading: false,

      /**ncemra */
      showCamera1: false,
      type: "back",
      ratio: "16:9",
      ratios: [],
      photoId: 1,
      photos: [],
      croppedImageURI: undefined,


      isFilter1: false,
      //isFilter2: false,
      //isFilter3: false,
      currentFilter:null,
      currentFilterPath:null,
      ...settings,
      hue: 0,
      blur: 0,
      sepia: 0,
      sharpen: 0,
      negative: 0,
      contrast: 1,
      saturation: 1,
      brightness: 1,
      temperature: 6500,
    };
    this.deleteImageSingle2 = this.deleteImageSingle2.bind(this);
  }
  saveImage = async () => {
    console.log("Here");
    if (!this.image1) return;
   const currentFilter=this.state.currentFilter;
    const result = await this.image1.glView.capture();
    console.log(result);
if(currentFilter=="image1")
this.setState({
  avatarSource1: result,
  avatar1data: result.uri
})
else if(currentFilter=="image2")
this.setState({
  avatarSource2: result,
  avatar2data: result.uri
})
else if(currentFilter=="image3")
this.setState({
  avatarSource3: result,
  avatar3data: result.uri
})
else{

}
    this.setState({
                ...settings,
                hue: 0,
                blur: 0,
                sepia: 0,
                sharpen: 0,
                negative: 0,
                contrast: 1,
                saturation: 1,
                brightness: 1,
                temperature: 6500,
                //avatar1type: '',
    });
    this.toggleModalFilter1();
  };
  /**camra  fn*/
  getRatios = async function () {
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
  takePicture1 = async function () {
    if (this.camera) {
      Snackbar.show({
        text: 'Please wait Image is being cropped',
        duration: Snackbar.LENGTH_LONG,
      });
      this.camera.takePictureAsync({ forceUpOrientation: true, fixOrientation: true }).then(data => {
        let strData = data.uri
        // CameraRoll.saveToCameraRoll(data.uri);



        ImageEditor.cropImage(strData, {
          offset: {
            x: 200, y: 865
          },
          size: {
            width: 1850, height: 2000
          },

        }).then(url => {
          console.log("Cropped image uri", url);
          this.setState({
            croppedImageURI: url,

            avatarSource1: { uri: url },
            avatar1data: url,
            showCamera1: false
            // avatar1type:image.mime,
          })


        })

      });



    }
  }

  takePicture2 = async function () {
    if (this.camera) {
      Snackbar.show({
        text: 'Please wait Image is being cropped',
        duration: Snackbar.LENGTH_LONG,
      });
      this.camera.takePictureAsync({ forceUpOrientation: true, fixOrientation: true }).then(data => {
        let strData = data.uri
        // CameraRoll.saveToCameraRoll(data.uri);



        ImageEditor.cropImage(strData, {
          offset: {
            x: 200, y: 865
          },
          size: {
            width: 1850, height: 2000
          },

        }).then(url => {
          console.log("Cropped image uri", url);
          this.setState({
            croppedImageURI: url,

            avatarSource2: { uri: url },
            avatar2data: url,
            showCamera2: false
            // avatar1type:image.mime,
          })


        })

      });



    }
  }

  takePicture3 = async function () {
    if (this.camera) {
      Snackbar.show({
        text: 'Please wait Image is being cropped',
        duration: Snackbar.LENGTH_LONG,
      });
      this.camera.takePictureAsync({ forceUpOrientation: true, fixOrientation: true }).then(data => {
        let strData = data.uri
        // CameraRoll.saveToCameraRoll(data.uri);



        ImageEditor.cropImage(strData, {
          offset: {
            x: 200, y: 865
          },
          size: {
            width: 1850, height: 2000
          },

        }).then(url => {
          console.log("Cropped image uri", url);
          this.setState({
            croppedImageURI: url,

            avatarSource3: { uri: url },
            avatar3data: url,
            showCamera3: false
            // avatar1type:image.mime,
          })


        })

      });



    }
  }


  renderCamera() {
    alert();
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
            <Text style={styles.flipText}> CLICK </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overlay} />
      </RNCamera>
    );
  }
  /**eend f camr fn */
  showActionSheet1 = () => {
    this.ActionSheet1.show()
  }
  showActionSheet2 = () => {
    this.ActionSheet2.show()
  }
  showActionSheet3 = () => {
    this.ActionSheet3.show()
  }
  _goBack = () => console.log('Went back');

  _handleSearch = () => console.log('Searching');

  _handleMore = () => {



    let missingField = '';

    if (this.state.Usrname == '') {
      missingField += 'Enter Title\n';

    }
    if (this.state.Description == '') {
      missingField += 'Enter Description\n';


    }
    if (this.state.lat == '') {
      missingField += 'Enter latitude\n';

    }
    if (this.state.long == '') {
      missingField += 'Enter longitude\n';

    }
    if (this.state.avatar1data == '') {
      missingField += 'Upload Image 1\n';

    }
    if (this.state.avatar2data == '') {
      missingField += 'Upload Image 2\n';

    }
    if (this.state.avatar3data == '') {
      missingField += 'Upload Image 3\n';

    }
    if (missingField == '') {


      Keyboard.dismiss;
      NetInfo.fetch().then(state => {
        if (state.isConnected == true) {
          this.setState({
            isLoading: true,
            loading: true,
            isModalGo: true,
          });
          console.log('hi');
          console.log(
            { name: 'name', data: this.state.Usrname.toString() },
            { name: 'desc', data: this.state.Description.toString() },

            { name: 'lat', data: this.state.lat.toString() },
            { name: 'long', data: this.state.long.toString() },

            { name: 'img1', data: this.state.avatar1data.toString() },
            { name: 'img2', data: this.state.avatar2data.toString() },
            { name: 'img3', data: this.state.avatar3data.toString() },
          );


          RNFetchBlob.fetch(
            'POST',
            'https://www.isac-simo.net/api/image/',
            {
              'Authorization': 'Bearer ' + this.state.token,
              // otherHeader : "foo",
              'Content-Type': 'multipart/form-data',

              //'Content-Type': 'application/json',

            },
            [
              // element with property `filename` will be transformed into `file` in form data
              { name: 'title', data: this.state.Usrname.toString() },
              { name: 'description', data: this.state.Description.toString() },
              { name: 'lat', data: this.state.lat.toString() },
              { name: 'lng', data: this.state.long.toString() },
              {
                name: 'image_1',
                filename: 'front.jpeg',
                filetype: 'image/jpeg',
                data: RNFetchBlob.wrap(this.state.avatar1data),
              },

              {
                name: 'image_xyz',
                filename: 'front.jpeg',
                filetype: 'image/jpeg',
                data: RNFetchBlob.wrap(this.state.avatar2data),
              },
              {
                name: 'image_file1',
                filename: 'front.jpeg',
                filetype: 'image/jpeg',
                data: RNFetchBlob.wrap(this.state.avatar3data),
              },
            ],
          )
            .then(resp => {
              console.log('RE' + JSON.stringify(resp));
              const myrespnse = JSON.parse(resp.data);
              const imageres0 = myrespnse.image_files[0];
              const imageres1 = myrespnse.image_files[1];
              const imageres2 = myrespnse.image_files[2];
              const resData1 = JSON.parse(resp.data);
              const resData2 = resData1.image_files;
              console.log('RE' + JSON.stringify(resp.data));
              console.log('RE3' + JSON.stringify(resData2));
              /*
                      image1file
                      image1tested
                      image1result
                      image1score
              
                      */
              //file
              //tested
              //result 
              //score

              const resData = [
                {
                  "file": "1.jpg",
                  "tested": true,
                  "result": "go",
                  "score": 0.918
                },
                {
                  "file": "2.jpg",
                  "tested": true,
                  "result": "go",
                  "score": 0.913
                },
                {
                  "file": "3.jpg",
                  "tested": true,
                  "result": "go",
                  "score": 0.921
                },
                {
                  "file": "3.jpg",
                  "tested": true,
                  "result": "go",
                  "score": 0.944
                },
                {
                  "file": "4.jpg",
                  "tested": true,
                  "result": "go",
                  "score": 0.941
                }
              ];
              this.setState({
                isLoading: false
              });

              Alert.alert(
                'Sucessfully Submitted',
                'Form has been sucessfully submitted.Please go following link to see the result',
                [

                  { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                  {
                    text: 'OK', onPress: () =>

                      this.props.navigation.dispatch(
                        StackActions.replace('FormResult', {
                          resData: resData2,
                        })
                      )


                 /* this.props.navigation.navigate('FormResult',
                  
                  {
                    resData: resData2
                    
                  }
                  
                ) */},
                ],
                { cancelable: false }
              )

              this.setState({
                image1file: imageres0.file,
                image1tested: imageres0.tested,
                image1result: imageres0.result,
                image1score: imageres0.score,


                image2file: imageres1.file,
                image2tested: imageres1.tested,
                image2result: imageres1.result,
                image2score: imageres1.score,

                image3file: imageres2.file,
                image3tested: imageres2.tested,
                image3result: imageres2.result,
                image3score: imageres2.score,
              }
                //this.toggleModal()
              );

              console.log("new data" + imageres0.tested);
              // ...
            })
            .catch(err => {
              this.setState({
                isLoading: false
              });
              // ...
            });

        } else {
          Alert.alert("You are not connected to internet!");
        }
      });


    }
    else {
      this.setState({
        isLoading: false
      });
      alert(missingField);



    }


  };

  toggleModalFilter1 = () => {
    this.setState({ isFilter1: !this.state.isFilter1 });
  };
/*  toggleModalFilter2 = () => {
    this.setState({ isFilter2: !this.state.isFilter2 });
  };
  toggleModalFilter3 = () => {
    this.setState({ isFilter3: !this.state.isFilter4 });
  };*/


  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  toggleModal2 = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible2 });
  };

  _toggleComponentA = () =>
    this.setState({ showComponentA: !this.state.showComponentA });

  _toggleComponentB = () =>
    this.setState({ showComponentB: !this.state.showComponentB });
  _toggleComponentC = () =>
    this.setState({ showComponentC: !this.state.showComponentC });

  _toggleModalGo = () => this.setState({ isModalGo: !this.state.isModalGo });
  _toggleModalNoGo = () =>
    this.setState({ isModalNogo: !this.state.isModalNogo });

  selectPhotoTapped1() {
    /* const options = {
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
         let source = { uri: response.uri };
         let data = response.path;
         let type = response.type;
         // You can also display the image using data:
         // let source = { uri: 'data:image/jpeg;base64,' + response.data };
 
         this.setState({
           avatarSource1: source,
           avatar1data: data,
           avatar1type: type,
         });
       }
     });*/


    ImagePicker2.openPicker({
      cropping: true,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
      avoidEmptySpaceAroundImage: true,
      cropperActiveWidgetColor: 'red',
      //cropperStatusBarColor:'green',
      // cropperToolbarColor:'pink',
      //cropperToolbarTitle:'pinkdddddddd',
      cropperToolbarTitle: 'Crop Image',
      cropperToolbarColor: 'purple',
      hideBottomControls: true,
      enableRotationGesture: true,
      showCropGuidelines: false,

    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        //images: null
        avatarSource1: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        avatar1data: image.path,
        avatar1type: image.mime,
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }
  selectPhotoTapped2() {
    /*const options = {
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
        let source = { uri: response.uri };
        let data = response.path;
        let type = response.type;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource2: source,
          avatar2data: data,
          avatar2type: type,
        });
      }
    });*/

    ImagePicker2.openPicker({
      cropping: true,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
      avoidEmptySpaceAroundImage: true,
      cropperActiveWidgetColor: 'red',
      //cropperStatusBarColor:'green',
      // cropperToolbarColor:'pink',
      //cropperToolbarTitle:'pinkdddddddd',
      cropperToolbarTitle: 'Crop Image',
      cropperToolbarColor: 'purple',
      hideBottomControls: true,
      enableRotationGesture: true,
      showCropGuidelines: false,

    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        //images: null
        avatarSource2: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        avatar2data: image.path,
        avatar2type: image.mime,
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  selectPhotoTapped3() {
    /*const options = {
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
        let source = { uri: response.uri };
        let data = response.path;
        let type = response.type;
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource3: source,
          avatar3data: data,
          avatar3type: type,
        });
      }
    });*/

    ImagePicker2.openPicker({
      cropping: true,
      width: 500,
      height: 500,
      includeExif: true,
      mediaType: 'photo',
      freeStyleCropEnabled: true,
      avoidEmptySpaceAroundImage: true,
      cropperActiveWidgetColor: 'red',
      //cropperStatusBarColor:'green',
      // cropperToolbarColor:'pink',
      //cropperToolbarTitle:'pinkdddddddd',
      cropperToolbarTitle: 'Crop Image',
      cropperToolbarColor: 'purple',
      hideBottomControls: true,
      enableRotationGesture: true,
      showCropGuidelines: false,

    }).then(image => {
      console.log('received image', image);
      this.setState({
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        //images: null
        avatarSource3: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        avatar3data: image.path,
        avatar3type: image.mime,
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  handleChangeOption(val, type) {
    if (val !== 0) {
      if (type == 'masonry') {
        this.setState({
          masonry: val,
        });
      }

      if (type == 'external_face') {
        this.setState({
          external_face: val,
        });
      }
      if (type == 'damage_wall') {
        this.setState({
          damage_wall: val,
        });
      }
      if (type == 'storeys') {
        this.setState({
          storeys: val,
        });
      }
    }
  }
  deleteImageSingle2(item, index) {
    //console.log("=======================");
    console.log('item' + JSON.stringify(item));
    //  console.log("name"+JSON.stringify(name));
    const selectedItems = this.state.finalimages;
    // console.log("selectedItems"+JSON.stringify(selectedItems));
    const isSelected = Object.keys(selectedItems);
    //.find(i => i === item);
    console.log('issel' + JSON.stringify(isSelected));
    if (isSelected && selectedItems[isSelected] === true) {
      //selectedItems[1] = '';
      delete selectedItems[item];
    } else {
      //selectedItems[1] = '';
      delete selectedItems[item];
    }
    this.setState((prevState, props) => ({
      itemcount: prevState.itemcount - 1,
    }));
    this.setState({
      finalimages: selectedItems,
    });
    console.log('fianl' + JSON.stringify(selectedItems));
  }
  componentWillUnmount() {
    // Toast.toastInstance = null;
  }
  componentWillMount() {
    //Toast.toastInstance = null;
  }
  componentDidMount = async () => {
    this.getLatLong();
    console.log('token');
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          token: value
        })
        console.log("val" + value);
        // value previously stored
      }
    } catch (e) {
      console.log("val no");
      // error reading value
    }
  }

  getLatLong = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Survey App',
          message: 'Please grant permission for geolocation ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("You can use the location");
        // alert("You can use the location");
        // Instead of navigator.geolocation, just use Geolocation.
        //   if (hasLocationPermission) {
          Geolocation.getCurrentPosition(
            position => {
             
              const location = JSON.stringify(position.coords);
              console.log(location);
              console.log(position.coords.latitude);
              //this.setState({location});
              this.setState({
                lat: JSON.stringify(position.coords.latitude),
                long: JSON.stringify(position.coords.longitude),
                latlongSwitch: 1,
              });
            },
           /* error => Alert.alert('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},*/
          );
  


        // }
      } else {
        console.log('location permission denied');
        //alert('Location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  selectImageMultiple() {
    var _this = this;
    ImagePicker.openPicker({
      multiple: true,
      width: 500,
      height: 500,
      // cropping: cropit,
      // cropperCircleOverlay: circular,
      compressImageMaxWidth: 1000,
      compressImageMaxHeight: 1000,
      compressImageQuality: 1,
      //c compressVideoPreset: 'MediumQuality',
      // includeExif: true,
    })
      .then(images => {
        console.log('IMAGE' + JSON.stringify(images));
        //this.onChangeInput(images);
        _this.setState(
          {
            //itemcount: images.length,
            finalimages: images,
          },
          console.log('IMAGE ST'),
        );
        /*ToastAndroid.showWithGravity(
        images.length + "images uploaded",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );*/
      })
      .catch(e => {
        console.log(e);
        Alert.alert(e.message ? e.message : e);
      });
  }
  selectPhotoTapped = async (avatarnumber, e) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'ISAC SIMO App Camera Permission',
          message:
            'ISAC SIMO App App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        /* ImagePicker.openPicker({
          multiple: true,
        }).then(images => {
          console.log(images);
        });*/
        // this.selectImageMultiple();
        console.log('sss');
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled image picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            const source = { uri: response.uri };

            // You can also display the image using data:
            // const source = { uri: 'data:image/jpeg;base64,' + response.data };

            this.setState({
              avatarSource: source,
            });
          }
        });
        ImagePicker.showImagePicker(options, response => {
          console.log('Response = ', response);

          if (response.didCancel) {
            console.log('User cancelled photo picker');
          } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
          } else if (response.customButton) {
            console.log('User tapped custom button: ', response.customButton);
          } else {
            let source = { uri: response.uri };
            let data = response.path;
            let type = response.type;

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (avatarnumber == '1') {
              console.log('ssssss');
              console.log('Data from avatarno' + data);
              this.setState({
                avatarSource1: source,
                avatar1data: data,
                avatar1type: type,
              });
            }
            if (avatarnumber == '2') {
              this.setState({
                avatarSource2: source,
                avatar2data: data,
                avatar2type: type,
              });
            }

            if (avatarnumber == '3') {
              this.setState({
                avatarSource3: source,
                avatar3data: data,
                avatar3type: type,
              });
            }

            if (avatarnumber == '4') {
              this.setState({
                avatarSource4: source,
                avatar4data: data,
                avatar4type: type,
              });
            }
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };
  };
  clearData = () => {
    this.setState({
      Usrname: '',
      photo: null,
      email: '',
      password: '',
      status: '',
      Phone: '',
      long: '',
      lat: '',
      address: '',
      Description: '',
      disaster: '',

      avatar1data: '',
      avatar1type: '',
      avatarSource1: null,
      avatar2data: '',
      avatar2type: '',
      avatarSource2: null,
      avatar3data: '',
      avatar3type: '',
      avatarSource3: null,
      avatar4data: '',
      avatar4type: '',
      avatarSource4: null,

      masonry: '',
      external_face: '',
      damage_wall: '',
      storeys: '',
    });
  };

  SubmitData = async () => {
    Keyboard.dismiss;
    this.setState({
      loading: true,
      isModalGo: true,
    });
    console.log('hi');

    /* console.log(
      JSON.stringify([
        {name: 'email', data: this.state.email.toString()},
        {name: 'name', data: this.state.Usrname.toString()},
        {name: 'desc', data: this.state.Description.toString()},
        {name: 'phone_no', data: this.state.Phone.toString()},
        {name: 'lat', data: this.state.lat.toString()},
        {name: 'long', data: this.state.long.toString()},
        {name: 'disaster_timeline', data: this.state.disaster.toString()},

        {
          name: 'photo_1',
          filename: 'front.jpeg',
          filetype: 'image/jpeg',
          data: RNFetchBlob.wrap(this.state.avatar1data),
        },
        {
          name: 'photo_2',
          filename: 'right.jpeg',
          filetype: 'image/jpeg',
          data: RNFetchBlob.wrap(this.state.avatar2data),
        },
        {
          name: 'photo_3',
          filename: 'left.jpeg',
          filetype: 'image/jpeg',
          data: RNFetchBlob.wrap(this.state.avatar3data),
        },
        {
          name: 'photo_4',
          filename: 'back.jpeg',
          filetype: 'image/jpeg',
          data: RNFetchBlob.wrap(this.state.avatar4data),
        },

        {name: 'masonry', data: this.state.masonry == 1 ? 'yes' : 'no'},
        {
          name: 'external_face',
          data: this.state.external_face == 1 ? 'yes' : 'no',
        },
        {name: 'damage_wall', data: this.state.damage_wall == 1 ? 'yes' : 'no'},
        {name: 'storeys', data: this.state.storeys == 1 ? 'yes' : 'no'},
      ]),
    );*/

    let missingField = '';

    if (this.state.Usrname == '') {
      missingField += 'Enter Full Name\n';
      //console.log("MISSING FILES SURVEYNAME" + missingField);
      /*   this.setState({
                    surveyerNameError: "Enter surveyerName"
                  });*/
    }
    if (this.state.email == '') {
      missingField += 'Enter Email\n';
      /*  this.setState({
                    homeownerNameError: "Enter Home Owner"
                  });*/
    }
    if (this.state.Phone == '') {
      missingField += 'Enter Phone Number\n';
      /*this.setState({
                    documentNumberError: "Enter Document Number"
                  });*/
    }
 

    if (this.state.Description == null) {
      missingField += 'Write Description\n';
    }


    if (this.state.avatarSource1 == null) {
      missingField += 'Upload Front Image\n';
    }
    if (this.state.avatarSource2 == null) {
      missingField += 'Upload Back Image\n';
    }
    if (this.state.avatarSource3 == null) {
      missingField += 'Upload Left Image\n';
    }
  
    /*
              if (this.state.selectedItems == "") {
                missingField += "Select Municipality\n";
              }
              */

             console.log(
              { name: 'email', data: this.state.email.toString() },
              { name: 'name', data: this.state.Usrname.toString() },
              { name: 'desc', data: this.state.Description.toString() },
              { name: 'phone_no', data: this.state.Phone.toString() },
              { name: 'lat', data: this.state.lat.toString() },
              { name: 'long', data: this.state.long.toString() },
              { name: 'disaster_timeline', data: this.state.disaster.toString() },
            );


    if (missingField == '') {
      console.log('Authorization Bearer ' + this.state.token);
      RNFetchBlob.fetch(
        'POST',
        'https://www.isac-simo.net/api/image/',
        {
          'Authorization': 'Bearer ' + this.state.token,
          // otherHeader : "foo",
          'Content-Type': 'multipart/form-data',
        },
        [
          // element with property `filename` will be transformed into `file` in form data
          { name: 'title', data: this.state.email.toString() },
          { name: 'description', data: this.state.Description.toString() },
          { name: 'lat', data: this.state.lat.toString() },
          { name: 'lng', data: this.state.long.toString() },
          {
            name: 'image_1',
            filename: 'front.jpeg',
            filetype: 'image/jpeg',
            data: RNFetchBlob.wrap(this.state.finalimages[0].path),
          },
          {
            name: 'image_xyz',
            filename: 'front.jpeg',
            filetype: 'image/jpeg',
            data: RNFetchBlob.wrap(this.state.finalimages[0].path),
          },
          {
            name: 'image_file1',
            filename: 'front.jpeg',
            filetype: 'image/jpeg',
            data: RNFetchBlob.wrap(this.state.finalimages[0].path),
          },
        ],
      )
        .then(resp => {
          console.log('RE' + JSON.stringify(resp));
          // ...
        })
        .catch(err => {
          // ...
        });
    } else {
      console.log('Authorization Bearer ' + this.state.token);
      RNFetchBlob.fetch(
        'POST',
        'https://www.isac-simo.net/api/image/',
        {
          'Authorization':
            'Bearer ' + this.state.token,
          // otherHeader : "foo",
          'Content-Type': 'multipart/form-data',
        },
        [
          // element with property `filename` will be transformed into `file` in form data
          { name: 'title', data: this.state.email.toString() },
          { name: 'description', data: this.state.Description.toString() },
          { name: 'lat', data: this.state.lat.toString() },
          { name: 'lng', data: this.state.long.toString() },
          {
            name: 'image_1',
            filename: 'front.jpeg',
            filetype: 'image/jpeg',
            data: RNFetchBlob.wrap(this.state.finalimages[0].path),
          },
          {
            name: 'image_xyz',
            filename: 'front.jpeg',
            filetype: 'image/jpeg',
            data: RNFetchBlob.wrap(this.state.finalimages[0].path),
          },
          {
            name: 'image_file1',
            filename: 'front.jpeg',
            filetype: 'image/jpeg',
            data: RNFetchBlob.wrap(this.state.finalimages[0].path),
          },
        ],
      )
        .then(resp => {
          console.log('RE' + JSON.stringify(resp));
          // ...
        })
        .catch(err => {
          // ...
        });
    }
  };

  render() {
    const finalimage = this.state.finalimage;
    const showCamera1 = this.state.showCamera1;
    const showCamera2 = this.state.showCamera2;
    const showCamera3 = this.state.showCamera3;


    if (showCamera1 == true) {
      return (<RNCamera
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
            onPress={this.takePicture1.bind(this)}
          >
            <Text style={styles.flipText}> CLICK </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overlay} />
      </RNCamera>);

    }
    if (showCamera2 == true) {
      return (<RNCamera
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
            onPress={this.takePicture2.bind(this)}
          >
            <Text style={styles.flipText}> SNAP </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overlay} />
      </RNCamera>);

    }
    if (showCamera3 == true) {
      return (<RNCamera
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
            onPress={this.takePicture3.bind(this)}
          >
            <Text style={styles.flipText}> CLICK </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overlay} />
      </RNCamera>);

    }
    else {
      return (<View style={{ backgroundColor: '#d2dae2' }}>



        <ScrollView>
          {this.state.showCamera == true ?
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
                  <Text style={styles.flipText}> CLICK </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.overlay} />
            </RNCamera> : null
          }

<Modal
                    style={{ backgroundColor: '#fff', height: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    animationType="up"

                    backdropColor="black"
                    backdropOpacity={0.5}
                    swipeDirection="down"

                    isVisible={this.state.isFilter1}>
                    <View style={{flex:1,backgroundColor: '#fff'}}>

                        <Appbar style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            borderTopLeftRadius: 10, borderTopRightRadius: 10
                        }}>

                            <Appbar.Content title="Apply Filter" />
                            <Appbar.Action icon="check" onPress={() => 
                            this.saveImage()
                            
                            } />
                            <Appbar.Action
                                icon="close"
                                onPress={() =>this.toggleModalFilter1()}
                            />
                        </Appbar>
                    
                        <Surface style={{ width:width, height: 300,alignSelf:'center',marginTop:30}} ref={ref => (this.image1 = ref)}>
             <ImageFilters {...this.state} width={width} height="300">

               {
                 this.state.currentFilter=='image1'?
                 this.state.avatarSource1:
                 this.state.currentFilter=='image2'?
                 this.state.avatarSource2:
                 this.state.currentFilter=='image3'?
                 this.state.avatarSource3:
                 null
               }
          

             </ImageFilters>
           </Surface>

                              
                        <ScrollView>
                          
                        <Text style={{fontWeight:'bold',textAlign:'center',fontSize:16,marginHorizontal:5}}>Filters</Text>
   
                        {settings.map(filter => (
             <Filter
               key={filter.name}
               name={filter.name}
               minimum={filter.minValue}
               maximum={filter.maxValue}
               onChange={value => this.setState({ [filter.name]: value })}
             />
           ))}

<Text style={{marginBottom:100}}>

</Text>
                        </ScrollView>




                    </View>


                </Modal>
         

      

          <Modal
            style={{ backgroundColor: '#fff', height: 200 }}
            animationType="slide"
            visible={false}
            backdropColor="black"
            backdropOpacity={0.5}
            swipeDirection="down"
            // transparent
            isVisible={this.state.isModalVisible2}>


          </Modal>


          <Modal
            style={{ backgroundColor: '#fff', height: 200 }}
            animationType="slide"
            // visible={visible}
            backdropColor="black"
            backdropOpacity={0.5}
            swipeDirection="down"
            // transparent
            isVisible={this.state.isModalVisible2}>

            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <View style={{
                width: 300,
                height: 300
              }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Sorry </Text>

                <View style={{ backgroundColor: '#fff', height: 200 }}>
                  <View style={{ flex: 1 }}>
                    <Image
                      style={{
                        width: 120,
                        height: 90,
                        alignSelf: 'center',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      source={require('../../assets/nogo.png')}
                    />
                  </View>

                  <Text>Image 1 Score</Text>
                  <Text>{this.state.image1score}</Text>
                  <Text>Image 1 Result</Text>
                  <Text>{this.state.image1result}</Text>

                  <Text>Image 2 Score</Text>
                  <Text>{this.state.image2score}</Text>
                  <Text>Image 2 Result</Text>
                  <Text>{this.state.image2result}</Text>

                  <Text>Image 3 Score</Text>
                  <Text>{this.state.image3score}</Text>
                  <Text>Image 3 Result</Text>
                  <Text>{this.state.image3result}</Text>

                  <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Your Score is </Text>
                  <Text style={{ textAlign: 'center', fontSize: 25, fontWeight: 'bold' }}>69 </Text>
                  <Button style={{ width: 200 }} title="Close" onPress={this.toggleModal2} />
                </View>
              </View>
            </View>
          </Modal>


          <Modal
            style={{ backgroundColor: '#fff', height: 200 }}
            animationType="slide"
            // visible={visible}
            backdropColor="black"
            backdropOpacity={0.5}
            swipeDirection="down"
            // transparent
            isVisible={this.state.isModalVisible}>

            <View style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>




              <View style={{
                width: 300,
                height: 300
              }}>
                <Text style={{ textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>We have detected: </Text>

                <View style={{ backgroundColor: '#fff', height: 200 }}>
                  <View style={{ marginVertical: 10 }}></View>
                  <View style={{ height: 1, width: '100%', backgroundColor: '#000' }}></View>

                  <Text style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                  }}>Image 1 Score :
         <Text style={{
                      textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>{this.state.image1score * 100} %</Text>
                  </Text>

                  <Text style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                  }}>Image 1 Result :
         <Text style={{
                      textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>{this.state.image1result}</Text>
                  </Text>

                  <View style={{ height: 1, width: '100%', backgroundColor: '#000' }}></View>

                  <Text style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                  }}>Image 2 Score :
         <Text style={{
                      textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>{this.state.image2score * 100} %</Text>
                  </Text>

                  <Text style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                  }}>Image 2 Result :
         <Text style={{
                      textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>{this.state.image2result}</Text>
                  </Text>
                  <View style={{ height: 1, width: '100%', backgroundColor: '#000' }}></View>

                  <Text style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                  }}>Image 3 Score :
         <Text style={{
                      textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>{this.state.image3score * 100} %</Text>
                  </Text>

                  <Text style={{
                    textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                  }}>Image 3 Result :
         <Text style={{
                      textAlign: 'center', fontSize: 20, fontWeight: 'bold'
                    }}>{this.state.image3result}</Text>
                  </Text>

                  <View style={{ height: 1, width: '100%', backgroundColor: '#000' }}></View>
                  <View style={{ marginVertical: 10 }}></View>




                  <Button style={{ width: 200 }} title="Close" onPress={this.toggleModal} />
                </View>
              </View>
            </View>
          </Modal>
          <Card style={styles.cardWrapper} elevation={5}>
            <Card.Title
              title="General Question"
              right={props => (
                <IconsArrow
                  name="keyboard-arrow-up"
                  color="purple"
                  size={32}
                  onPress={this._toggleComponentA}
                />
              )}
            />
            {this.state.showComponentA ? (
              <Card.Content>
                <KeyboardAwareScrollView>
                  <View style={{ paddingVertical: 8 }}>
                    <Text style={styles.newText}>
                      <Text style={styles.required}>*</Text>
              Title
            </Text>

                    <TextInput
                      style={styles.newInput}
                      placeholder=" Enter Full Name"
                      value={this.state.Usrname}
                      onChangeText={text =>
                        this.setState({
                          Usrname: text,
                        })
                      }
                    />
                  </View>

                  <KeyboardAwareScrollView>
                    <View style={{ paddingVertical: 8 }}>
                      <Text style={styles.newText}>
                        <Text style={styles.required}>*</Text>
                Description
              </Text>

                      <TextInput
                        value={this.state.Description}
                        rowSpan={6}
                        bordered
                        placeholder=" Enter Details here"
                        placeholderTextColor="#888888"
                        onChangeText={text =>
                          this.setState({
                            Description: text,
                          })
                        }
                        style={{
                          width: '100%',
                          height: 50,
                          fontSize: 15,

                          backgroundColor: '#F8F9FC',

                          color: '#000',
                          // fontSize: 15,

                          //  paddingVertical:
                          //  Platform.OS === "ios" ? 7 : 0,
                          //  paddingHorizontal: 7,
                          borderRadius: 0,
                          borderColor: '#ccc',
                          borderWidth: 0,
                          //marginBottom: 5
                        }}
                      />
                    </View>
                  </KeyboardAwareScrollView>

                  <View style={{ paddingVertical: 8 }}>
                    <Text style={styles.newText}>
                      <Text style={styles.required}>*</Text>
              latitude
            </Text>

                    <TextInput
                      style={styles.newInput}
                      value={this.state.lat}
                      disabled
                    />
                  </View>

                  <View style={{ paddingVertical: 8 }}>
                    <Text style={styles.newText}>
                      <Text style={styles.required}>*</Text>
              longitude
            </Text>

                    <TextInput
                      style={styles.newInput}
                      value={this.state.long}
                      disabled
                    />
                  </View>

                  <PaperButton title="Get My Location" mode="outlined"
                  icon="enviromento"


                    onPress={() => this.getLatLong()}
                  >
                    <Text>Get My Location</Text>
                    </PaperButton>
                </KeyboardAwareScrollView>
              </Card.Content>
            ) : (
                <Text></Text>
              )}
          </Card>

          <Card style={styles.cardWrapper} elevation={5}>
            <Card.Title
              title="Pictures"
              right={props => (
                <IconsArrow
                  name="keyboard-arrow-down"
                  color="purple"
                  size={32}
                  onPress={this._toggleComponentC}
                />
              )}
            />

            {this.state.showComponentC ? (
              <Card.Content>
                <ActionSheet
                  ref={o => (this.ActionSheet1 = o)}
                  title={
                    <Text style={{ color: '#000', fontSize: 18 }}>
                      Upload a Photo
                </Text>
                  }
                  options={options}
                  cancelButtonIndex={0}
                  destructiveButtonIndex={3}
                  onPress={index => {
                    //alert('index' + index);
                    if (index == 1) {
                      this.setState({
                        showCamera1: true
                      })


                    } else if (index == 2) {
                      // alert('dd');
                      ImagePicker2.openPicker({
                        cropping: true,
                        width: 500,
                        height: 500,
                        includeExif: true,
                        mediaType: 'photo',
                        freeStyleCropEnabled: true,
                        avoidEmptySpaceAroundImage: true,
                        cropperActiveWidgetColor: 'red',
                        //cropperStatusBarColor:'green',
                        // cropperToolbarColor:'pink',
                        //cropperToolbarTitle:'pinkdddddddd',
                        cropperToolbarTitle: 'Crop Image',
                        cropperToolbarColor: 'purple',
                        hideBottomControls: true,
                        enableRotationGesture: true,
                        showCropGuidelines: false,

                      }).then(image => {
                        console.log('received image', image);
                        this.setState({
                          image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          //images: null
                          avatarSource1: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          avatar1data: image.path,
                          avatar1type: image.mime,
                        });
                      }).catch(e => {
                        console.log(e);
                        Alert.alert(e.message ? e.message : e);
                      });
                    } else {
                    }
                  }}
                />
                <ActionSheet
                  ref={o => (this.ActionSheet2 = o)}
                  title={
                    <Text style={{ color: '#000', fontSize: 18 }}>
                      Upload a Photo
                </Text>
                  }
                  options={options}
                  cancelButtonIndex={0}
                  destructiveButtonIndex={3}
                  onPress={index => {
                    //alert('index' + index);
                    if (index == 1) {




                      this.setState({
                        showCamera2: true
                      })





                    } else if (index == 2) {
                      ImagePicker2.openPicker({
                        cropping: true,
                        width: 500,
                        height: 500,
                        includeExif: true,
                        mediaType: 'photo',
                        freeStyleCropEnabled: true,
                        avoidEmptySpaceAroundImage: true,
                        cropperActiveWidgetColor: 'red',
                        //cropperStatusBarColor:'green',
                        // cropperToolbarColor:'pink',
                        //cropperToolbarTitle:'pinkdddddddd',
                        cropperToolbarTitle: 'Crop Image',
                        cropperToolbarColor: 'purple',
                        hideBottomControls: true,
                        enableRotationGesture: true,
                        showCropGuidelines: false,

                      }).then(image => {
                        console.log('received image', image);
                        this.setState({
                          image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          //images: null
                          avatarSource2: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          avatar2data: image.path,
                          avatar2type: image.mime,
                        });
                      }).catch(e => {
                        console.log(e);
                        Alert.alert(e.message ? e.message : e);
                      });
                    } else {
                    }
                  }}
                />
                <ActionSheet
                  ref={o => (this.ActionSheet3 = o)}
                  title={
                    <Text style={{ color: '#000', fontSize: 18 }}>
                      Upload a Photo
                </Text>
                  }
                  options={options}
                  cancelButtonIndex={0}
                  destructiveButtonIndex={3}
                  onPress={index => {
                    //alert('index' + index);
                    if (index == 1) {
                      this.setState({
                        showCamera3: true
                      })


                    } else if (index == 2) {
                      // alert('dd');
                      ImagePicker2.openPicker({
                        cropping: true,
                        width: 500,
                        height: 500,
                        includeExif: true,
                        mediaType: 'photo',
                        freeStyleCropEnabled: true,
                        avoidEmptySpaceAroundImage: true,
                        cropperActiveWidgetColor: 'red',
                        //cropperStatusBarColor:'green',
                        // cropperToolbarColor:'pink',
                        //cropperToolbarTitle:'pinkdddddddd',
                        cropperToolbarTitle: 'Crop Image',
                        cropperToolbarColor: 'purple',
                        hideBottomControls: true,
                        enableRotationGesture: true,
                        showCropGuidelines: false,

                      }).then(image => {
                        console.log('received image', image);
                        this.setState({
                          image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          //images: null
                          avatarSource3: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          avatar3data: image.path,
                          avatar3type: image.mime,
                        });
                      }).catch(e => {
                        console.log(e);
                        Alert.alert(e.message ? e.message : e);
                      });

                    } else if (index == 2) {
                      ImagePicker2.openPicker({
                        cropping: true,
                        width: 500,
                        height: 500,
                        includeExif: true,
                        mediaType: 'photo',
                        freeStyleCropEnabled: true,
                        avoidEmptySpaceAroundImage: true,
                        cropperActiveWidgetColor: 'red',
                        //cropperStatusBarColor:'green',
                        // cropperToolbarColor:'pink',
                        //cropperToolbarTitle:'pinkdddddddd',
                        cropperToolbarTitle: 'Crop Image',
                        cropperToolbarColor: 'purple',
                        hideBottomControls: true,
                        enableRotationGesture: true,
                        showCropGuidelines: false,

                      }).then(image => {
                        console.log('received image', image);
                        this.setState({
                          image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          //images: null
                          avatarSource3: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
                          avatar3data: image.path,
                          avatar3type: image.mime,
                        });
                      }).catch(e => {
                        console.log(e);
                        Alert.alert(e.message ? e.message : e);
                      });
                    } else {
                    }
                  }}
                />
                <View style={{  alignItems: 'center' }}>
                  <View style={styles.container}>
                    <Text style={{fontWeight:'bold',marginBottom:20}}>
                      {' '}
                      <Text style={styles.required}>* </Text>Image 1
            </Text>
                    <TouchableOpacity
                      //onPress={this.selectPhotoTapped1.bind(this)}
                      onPress={this.showActionSheet1}
                    >
                      <View
                        style={[
                          styles.avatar,
                          styles.avatarContainer,
                          { marginBottom: 20 },
                        ]}>
                        {this.state.avatarSource1 === null ? (
                          <IconsAnt name="camerao" size={50} color="#bedff6" />
                        ) : (
                            <View >
                              <Image
                                style={styles.avatar}
                                source={this.state.avatarSource1}
                              />


                            </View>

                          )}
                      </View>
                    </TouchableOpacity>

                    {this.state.avatarSource1 === null ? null :




                      <TouchableOpacity onPress={() => {
                        this.setState({currentFilter:'image1',
                      
                    
                      })
                        this.toggleModalFilter1()

                      }}>
                        <Text style={{ marginTop: 20,fontWeight:'bold',color:'blue' }}>Apply Filter on Image1</Text>
                      </TouchableOpacity>

                    }



<Text style={{fontWeight:'bold',marginBottom:20}}>
                      {' '}
                      <Text style={styles.required}>* </Text>Image 2
            </Text>
                    <TouchableOpacity
                      //onPress={this.selectPhotoTapped2.bind(this)}
                      onPress={this.showActionSheet2}
                    >
                      <View
                        style={[
                          styles.avatar,
                          styles.avatarContainer,
                          { marginBottom: 20 },
                        ]}>
                        {this.state.avatarSource2 === null ? (
                          <IconsAnt name="camerao" size={50} color="#bedff6" />
                        ) : (
                            <Image
                              style={styles.avatar}
                              source={this.state.avatarSource2}
                            />
                          )}
                      </View>
                    </TouchableOpacity>


                    {this.state.avatarSource2 === null ? null :




                      <TouchableOpacity onPress={() => {
                        this.setState({currentFilter:'image2'}),
                        this.toggleModalFilter1()

                      }}>
                        <Text style={{ marginTop: 20,fontWeight:'bold',color:'blue' }}>Apply Filter on Image2</Text>
                      </TouchableOpacity>

                    }

<Text style={{fontWeight:'bold',marginBottom:20}}>
                      {' '}
                      <Text style={styles.required}>* </Text>Image 3
            </Text>
                    <TouchableOpacity
                      //  onPress={this.selectPhotoTapped3.bind(this)}
                      onPress={this.showActionSheet3}
                    >
                      <View
                        style={[
                          styles.avatar,
                          styles.avatarContainer,
                          { marginBottom: 20 },
                        ]}>
                        {this.state.avatarSource3 === null ? (
                          <IconsAnt name="camerao" size={50} color="#bedff6" />
                        ) : (
                            <Image
                              style={styles.avatar}
                              source={this.state.avatarSource3}
                            />
                          )}
                      </View>
                    </TouchableOpacity>


                    {this.state.avatarSource3 === null ? null :




                      <TouchableOpacity onPress={() => {
                        this.setState({currentFilter:'image3'}),
                        this.toggleModalFilter1()

                      }}>
                        <Text style={{ marginTop: 20,fontWeight:'bold',color:'blue' }}>Apply Filter on Image3</Text>
                      </TouchableOpacity>

                    }

                  </View>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}></View>

                <View>
                  {this.state.finalimages.map((data, index) => {
                    return (
                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          backgroundColor: '#bedff6',
                          marginHorizontal: 2,
                          marginVertical: 2,
                        }}>
                        <View>
                          <Text>
                            {data.path.substring(
                              data.path.lastIndexOf('/') + 1,
                            )}
                          </Text>
                        </View>
                        <View>
                          <TouchableOpacity
                            onPress={this.deleteImageSingle2.bind(data, index)}>
                            <Icons
                              name="close"
                              size={16}
                              color="red"
                              style={styles.panelIcon}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </Card.Content>
            ) : (
                <Text></Text>
              )}
          </Card>
        </ScrollView>



        <FAB
          style={styles.fab}
          color="#fff"
          small
          icon="caretright"
          loading={this.state.isLoading == true ? true : false}
          onPress={() => this._handleMore()}
        />
      </View>);
    }

  }

}

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
const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 10,
    zIndex: 9999999999999999,
    elevation:10,
    backgroundColor: 'purple'

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

  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa' },
  row: { height: 28 },
  text: { textAlign: 'center' },

  /**camera */
  container2: {
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
  },
  content: { marginTop: 20, marginHorizontal: 20 },
  button: { marginVertical: 20, borderRadius: 0 },
  /**end of camera */
});
