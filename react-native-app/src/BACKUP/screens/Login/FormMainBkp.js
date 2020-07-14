import {Component,PropTypes} from 'react';
import React, {useEffect, useState} from 'react';
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
} from 'react-native';
// import ImagePicker from 'react-native-image-picker'
//import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import ImageComponent from './ImageComponent'
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
import {Avatar, Button, Card, Title, Paragraph} from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import LocalizationContext from '../../LocalizationContext';
import ImagePicker from 'react-native-image-picker';
//const abc = React.useContext(LocalizationContext);
type Props = {
  navigation: Navigation,
};

//const HomePage = props => {
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    // const { t, locale, setLocale } = React.useContext(LocalizationContext);
    this.state = {
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
        {name: 'Yes', id: 1},
        {name: 'No', id: 2},
      ],

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

      showComponentA: true,
      showComponentB: true,
      showComponentC: true,
      value: null,

      isModalGo: false,
      isModalNogo: false,

      loading: false,
      finalimages: [],

      isModalVisible: false
    };
    this.deleteImageSingle2 = this.deleteImageSingle2.bind(this);
  }
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  _toggleComponentA = () =>
    this.setState({showComponentA: !this.state.showComponentA});

  _toggleComponentB = () =>
    this.setState({showComponentB: !this.state.showComponentB});
  _toggleComponentC = () =>
    this.setState({showComponentC: !this.state.showComponentC});

  _toggleModalGo = () => this.setState({isModalGo: !this.state.isModalGo});
  _toggleModalNoGo = () =>
    this.setState({isModalNogo: !this.state.isModalNogo});

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
  componentDidMount() {
    this.getLatLong();
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
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
console.log("sss");
ImagePicker.showImagePicker(options, (response) => {
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
            let source = {uri: response.uri};
            let data = response.path;
            let type = response.type;

            // You can also display the image using data:
            // let source = { uri: 'data:image/jpeg;base64,' + response.data };
            if (avatarnumber == '1') {
              console.log("ssssss");
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
      isModalGo:true
    });
    console.log('hi');
    console.log(
      {name: 'email', data: this.state.email.toString()},
      {name: 'name', data: this.state.Usrname.toString()},
      {name: 'desc', data: this.state.Description.toString()},
      {name: 'phone_no', data: this.state.Phone.toString()},
      {name: 'lat', data: this.state.lat.toString()},
      {name: 'long', data: this.state.long.toString()},
      {name: 'disaster_timeline', data: this.state.disaster.toString()},
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
      RNFetchBlob.fetch('POST', 'https://isac-simo.herokuapp.com/api/image/', {
        Authorization : "Bearer access-token",
       // otherHeader : "foo",
        'Content-Type' : 'multipart/form-data',
      }, [
        // element with property `filename` will be transformed into `file` in form data
        {name: 'title', data: this.state.email.toString()},
        {name: 'description', data: this.state.Description.toString()},
        {name: 'lat', data: this.state.lat.toString()},
        {name: 'lng', data: this.state.long.toString()},
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
      ]).then((resp) => {
        console.log('RE'+JSON.stringify(resp));
        // ...
      }).catch((err) => {
        // ...
      });
    }
    else{
      RNFetchBlob.fetch('POST', 'https://isac-simo.herokuapp.com/api/image/', {
        Authorization : "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTg1NzE2NzY4LCJqdGkiOiI5MDQ0NmJlNjc5MGI0NjYxYjU3MzdmNGZkZmY2ZDBmMiIsInVzZXJfaWQiOjN9.DyMW_pIBddxN2CZcas1pSi_gH-65q6alas_KYYoWAXY",
       // otherHeader : "foo",
        'Content-Type' : 'multipart/form-data',
      }, [
        // element with property `filename` will be transformed into `file` in form data
        {name: 'title', data: this.state.email.toString()},
        {name: 'description', data: this.state.Description.toString()},
        {name: 'lat', data: this.state.lat.toString()},
        {name: 'lng', data: this.state.long.toString()},
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
      ]).then((resp) => {
        console.log('RE'+JSON.stringify(resp));
        // ...
      }).catch((err) => {
        // ...
      });
    }
  };

  render() {
    const finalimage = this.state.finalimage;
    //console.log(JSON.stringify(sampleState));
    return (
      <View style={{backgroundColor: '#d2dae2'}}>
        <ScrollView>
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
                  <View style={{paddingVertical: 8}}>
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
                    <View style={{paddingVertical: 8}}>
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
                          height:50,
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

                  <View style={{paddingVertical: 8}}>
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

                  <View style={{paddingVertical: 8}}>
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
                <View style={styles.label}>
                <ImageComponent/>
                 
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                

                </View>

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
