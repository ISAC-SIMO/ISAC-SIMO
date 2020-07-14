import React, { Component } from 'react'
import { Text, View, ScrollView, Button, Dimensions, StyleSheet } from 'react-native'
import { Surface } from 'gl-react-native';
import ImageFilters from 'react-native-gl-image-filters';
import Modal from 'react-native-modal';
import Filter from './Filter';
import { Appbar } from 'react-native-paper';
const width = Dimensions.get('window').width -60;

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
export class FormImageCrop extends Component {
    constructor(props) {
        super(props);
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
            isFilter2: false,
            isFilter3: false,

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

    }
    saveImage = async () => {
        if (!this.image) return;

        const result = await this.image.glView.capture();
        console.warn(result);
    };
    render() {
        return (
            <View>
                <Modal
                    style={{ backgroundColor: '#fff', height: '100%', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                    animationType="up"

                    backdropColor="black"
                    backdropOpacity={0.5}
                    swipeDirection="down"

                    isVisible={true}>
                    <View style={{flex:1}}>

                        <Appbar style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            borderTopLeftRadius: 10, borderTopRightRadius: 10
                        }}>

                            <Appbar.Content title="Apply Filter" />
                            <Appbar.Action icon="check" onPress={() => console.log('Pressed mail')} />
                            <Appbar.Action
                                icon="close"
                                onPress={() => console.log('Pressed delete')}
                            />
                        </Appbar>
                    
                        <Surface style={{ width:width, height: 300,alignSelf:'center',marginTop:30}} ref={ref => (this.image = ref)}>
             <ImageFilters {...this.state} width={width} height="300">
             {{ uri: 'https://i.imgur.com/5EOyTDQ.jpg' }}

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
            </View>
        )
    }
}

export default FormImageCrop;

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

