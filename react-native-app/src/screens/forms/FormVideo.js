import { Component } from 'react';
import React, { useEffect, useState, PropTypes } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";
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
  TextInput,
  Button, ActivityIndicator
} from 'react-native';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Col,
} from 'react-native-table-component';
import RNFetchBlob from 'rn-fetch-blob';
import { Appbar } from 'react-native-paper';
import { FAB } from 'react-native-paper';
//import ImagePicker from 'react-native-image-crop-picker';
/*import {
  Root,
  Spinner,
  Toast,
  Container,
  Header,
  Icon,
  Content,
  Picker,
  Title,
  Form,
  Item,
  Input,
  Label,
  Button,
  Body,
  Left,
  Right,
  Textarea,
  Card,
  CardItem,
} from 'native-base';*/
import Geolocation from 'react-native-geolocation-service';
import Icons from 'react-native-vector-icons/FontAwesome';
import IconsArrow from 'react-native-vector-icons/MaterialIcons';
import IconsAnt from 'react-native-vector-icons/AntDesign';

import Modal from 'react-native-modal';
import { Avatar, Card, Title, Paragraph } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
//import LocalizationContext from '../../LocalizationContext';
//import ImagePicker from 'react-native-image-picker';
//const abc = React.useContext(LocalizationContext);

import { ActionSheetCustom as ActionSheet } from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-crop-picker';

import Video from 'react-native-video';

import VideoPlayer from '../../components/VideoPlayer';
const options = [
  'Cancel',
  <Text style={{ color: 'blue' }}>Record a Video</Text>,
  <Text style={{ color: 'blue' }}>Import from Gallery</Text>,
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
//const HomePage = props => {
export default class HomePage extends Component {
  constructor(props) {
    super(props);
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
        ['a', 'b', 'c'],
      ],

      videoFile: '',
      videoPath: '',
      resData2: '',
      isLoading: false
    };
    this.deleteImageSingle2 = this.deleteImageSingle2.bind(this);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.route.params?.video !== this.props.route.params?.video) {
      const result = this.props.route.params?.video;
      console.log('reee' + JSON.stringify(result));
      this.setState({
        videoFile: result,
        videoPath: result.uri,
      });
      //this._onSelectCountry(result);
    }
  }
  showActionSheet = () => {
    this.ActionSheet.show();
  };
  _goBack = () => console.log('Went back');

  _handleSearch = () => console.log('Searching');
  storeData = async (data) => {
    try {
      await AsyncStorage.setItem('responseData', data)
    } catch (e) {
      // saving error
    }
  }

  getData = async () => {

    AsyncStorage.getItem('responseData', (err, result) => {
      if (!err && result != null) {
        // alert("1"+result);
        return result;
      }
      else {
        //alert("2"+result);
        return 'no-data';
        // do something else
      }
      //callback(result);
    });
  }
  removeData = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }
  _handleMore = async () => {
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
    if (this.state.videoPath == '') {
      missingField += 'Upload Video  1\n';

    }
    if (missingField == '') {
      const videoType = this.state.videoFile.mime;
      const videoPath = this.state.videoFile.path;
      Keyboard.dismiss;
      NetInfo.fetch().then(async state  => {
        if (state.isConnected==true) {
          this.setState({
            loading: true,
            isModalGo: true,
            isLoading: true,
          });
          console.log('hi');
          console.log(
            { name: 'title', data: this.state.Usrname.toString() },
            { name: 'description', data: this.state.Description.toString() },
            { name: 'lat', data: this.state.lat.toString() },
            { name: 'lng', data: this.state.long.toString() },
            { name: 'image_1', filename: 'vid.mp4', data: RNFetchBlob.wrap(this.state.videoPath) },
          );
          const data = new FormData();
          data.append('video', {
            name: 'mobile-video-upload',
            videoType,
            videoPath,
          });
          console.log('DATE0' + JSON.stringify(data));
          await RNFetchBlob.fetch(
            'POST',
            'https://www.isac-simo.net/api/video/',
            {
              Authorization: 'Bearer ' + this.state.token,
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
              { name: 'image_1', filename: 'vid.mp4', data: RNFetchBlob.wrap(this.state.videoPath) }
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
    
    
              setTimeout(() => {
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
                      
                    
                    },
                  ],
                  { cancelable: false }
                );
                this.setState({
                  isLoading: false
                })
              }, 9000);
    
              this.setState({
                isLoading: false
              })
    
    
              this.setState(
                {
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
                //this.toggleModal(),
              );
    
              console.log('new data' + imageres0.tested);
              // ...
            })
            .catch(err => {
              // ...
            });
        }
        else{
alert('You are not cnneceted to interrnet');
        }
      });


    
    }
    else {
      alert(missingField);
      this.setState({
        isLoading: false
      })
    }





  };
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

  recordVideo = () => {
    const navigation = useNavigation();
    //alert('from record Video');
    navigation.navigate('RecordVideo');
  };

  importVideo = () => {
    // alert('from import Video');
    ImagePicker.openPicker({
      mediaType: 'video',
    }).then(video => {
      console.log(video);

      this.setState({
        videoFile: video,
        videoPath: video.path,
      });
    });

    /**
   * 
   * { modificationDate: '1584796531000',
                             │ width: 720,
                             │ size: 8282570,
                             │ mime: 'video/mp4',
                             │ path: 'file:///storage/emulated/0/DCIM/Camera/VID_20200321_190022778.mp4',
                             └ height: 1280 }

   * 
   */
  };

  selectPhotoTapped1() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    /*  ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let source = {uri: response.uri};
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
          token: value,
        });
        console.log('val' + value);
        // value previously stored
      }
    } catch (e) {
      console.log('val no');
      // error reading value
    }
  };

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
            this.setState({
              lat: JSON.stringify(position.coords.latitude),
              long: JSON.stringify(position.coords.longitude),
              latlongSwitch: 1,
            });
          },

          error => {
            // See error code charts below.
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
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
    console.log(
      { name: 'email', data: this.state.email.toString() },
      { name: 'name', data: this.state.Usrname.toString() },
      { name: 'desc', data: this.state.Description.toString() },
      { name: 'phone_no', data: this.state.Phone.toString() },
      { name: 'lat', data: this.state.lat.toString() },
      { name: 'long', data: this.state.long.toString() },
      { name: 'disaster_timeline', data: this.state.disaster.toString() },
    );
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
    if (this.state.disaster == '') {
      missingField += 'Select Disaster Time\n';
    }

    if (this.state.Description == null) {
      missingField += 'Write Description\n';
    }
    if (this.state.masonry == null) {
      missingField += 'Select masonry option\n';
    }
    if (this.state.external_face == null) {
      missingField += 'Select External option\n';
    }
    if (this.state.storeys == null) {
      missingField += 'Select Storeys  option\n';
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
    if (this.state.avatarSource4 == null) {
      missingField += 'Upload Right Image\n';
    }
    /*
              if (this.state.selectedItems == "") {
                missingField += "Select Municipality\n";
              }
              */

    if (missingField == '') {
      console.log('Authorization Bearer ' + this.state.token);
      RNFetchBlob.fetch(
        'POST',
        'https://niush.pythonanywhere.com/api/image/',
        {
          Authorization: 'Bearer ' + this.state.token,
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
        'https://niush.pythonanywhere.com/api/image/',
        {
          Authorization: 'Bearer ' + this.state.token,
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
    //console.log(JSON.stringify(sampleState));

    return (
      <View style={{ backgroundColor: '#d2dae2' }}>
        {
          this.state.isLoading == true ?
            <ActivityIndicator size="large" color="purple" /> : null
        }
        <FAB
          loading={this.state.isLoading == true ? true : false}
          style={styles.fab}
          color="#fff"
          small
          icon="send"
          onPress={() => this._handleMore()}
        />

        <ScrollView>
          <Modal
            style={{ backgroundColor: '#fff', height: 200 }}
            animationType="slide"
            // visible={visible}
            backdropColor="black"
            backdropOpacity={0.5}
            swipeDirection="down"
            // transparent
            isVisible={this.state.isModalVisible2}>
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 300,
                  height: 300,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  Sorry{' '}
                </Text>

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

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Your Score is{' '}
                  </Text>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 25,
                      fontWeight: 'bold',
                    }}>
                    69{' '}
                  </Text>
                  <Button
                    style={{ width: 200 }}
                    title="Close"
                    onPress={this.toggleModal2}
                  />
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
            <View
              style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={styles.container}>
                <Table borderStyle={{ borderWidth: 1 }}>
                  <Row
                    data={this.state.tableHead}
                    flexArr={[1, 2, 1, 1]}
                    style={styles.head}
                    textStyle={styles.text}
                  />
                  <TableWrapper style={styles.wrapper}>
                    <Col
                      data={this.state.tableTitle}
                      style={styles.title}
                      heightArr={[28, 28]}
                      textStyle={styles.text}
                    />
                    <Rows
                      data={this.state.tableData}
                      flexArr={[2, 1, 1]}
                      style={styles.row}
                      textStyle={styles.text}
                    />
                  </TableWrapper>
                </Table>
              </View>

              <View
                style={{
                  width: 300,
                  height: 300,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}>
                  We have detected:{' '}
                </Text>

                <View style={{ backgroundColor: '#fff', height: 200 }}>
                  <View style={{ marginVertical: 10 }}></View>
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#000',
                    }}></View>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Image 1 Score :
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {this.state.image1score * 100} %
                    </Text>
                  </Text>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Image 1 Result :
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {this.state.image1result}
                    </Text>
                  </Text>

                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#000',
                    }}></View>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Image 2 Score :
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {this.state.image2score * 100} %
                    </Text>
                  </Text>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Image 2 Result :
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {this.state.image2result}
                    </Text>
                  </Text>
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#000',
                    }}></View>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Image 3 Score :
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {this.state.image3score * 100} %
                    </Text>
                  </Text>

                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 'bold',
                    }}>
                    Image 3 Result :
                    <Text
                      style={{
                        textAlign: 'center',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {this.state.image3result}
                    </Text>
                  </Text>

                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#000',
                    }}></View>
                  <View style={{ marginVertical: 10 }}></View>

                  <Button
                    style={{ width: 200 }}
                    title="Close"
                    onPress={this.toggleModal}
                  />
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
                </KeyboardAwareScrollView>
              </Card.Content>
            ) : (
                <Text></Text>
              )}
          </Card>

          <Card style={styles.cardWrapper} elevation={5}>
            <Card.Title
              title="Video"
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
              <Card.Content style={{ marginBottom: 50, paddingBottom: 50 }}>
                <View style={{ flex: 1, alignItems: 'center' }}>


                  <View style={styles.container}>
                    <ActionSheet
                      ref={o => (this.ActionSheet = o)}
                      title={
                        <Text style={{ color: '#000', fontSize: 18 }}>
                          Upload a Video
                        </Text>
                      }
                      options={options}
                      cancelButtonIndex={0}
                      destructiveButtonIndex={3}
                      onPress={index => {
                        //alert('index' + index);
                        if (index == 1) {
                          //Make change like this
                          this.props.navigation.navigate('RecordVideo');
                        } else if (index == 2) {
                          this.importVideo();
                        } else {
                        }
                      }}
                    />

                    <Text>
                      {' '}
                      <Text style={styles.required}>* </Text>Video
                    </Text>


                    <View
                      style={[
                        styles.avatar,
                        styles.avatarContainer,
                        { marginBottom: 20 },
                      ]}>
                      {this.state.avatarSource1 === null ? (
                        <IconsAnt
                          name="camerao"
                          size={50}
                          color="#bedff6"
                          onPress={this.showActionSheet}
                        />
                      ) : (
                          <Image
                            style={styles.avatar}
                            source={this.state.avatarSource1}
                          />
                        )}
                    </View>


                  </View>
                </View>

                <View style={{ flex: 1, alignItems: 'center' }}></View>

                <View>
                  {this.state.videoPath != '' ? (
                    <View style={{
                      backgroundColor: '#525252',
                      margin: 2,
                      padding: 5
                    }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',

                        }}>
                        <Text style={{ textAlign: 'left', color: '#fff', paddingVertical: 3 }}>
                          Uploaded Video
                    </Text>
                        <Icons
                          name="close"
                          size={20}
                          style={{ textAlign: 'right', color: '#fff' }}

                          onPress={index => {
                            console.log('sss');
                            this.setState({
                              videoFile: '',
                              videoPath: ''
                            })
                          }}
                        />

                      </View>
                      <VideoPlayer
                        style={{
                          marginBottom: 50,
                          backgroundColor: 'gray',
                          paddingVertical: 0,
                          marginHorizontal: 5,
                          paddingHorizontal: 5,
                        }}
                        newurl={this.state.videoPath}
                      />
                    </View>
                  ) : null}
                </View>
                <View></View>
              </Card.Content>
            ) : (
                <Text></Text>
              )}
          </Card>
        </ScrollView>
      </View>
    );
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
    zIndex: 99999,
    backgroundColor: '#64b3ea'

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
});
