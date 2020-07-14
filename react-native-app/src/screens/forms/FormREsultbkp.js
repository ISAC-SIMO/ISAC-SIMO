import React, {Component, useState, useEffect,PropTypes} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import {Table, TableWrapper, Row, Cell} from 'react-native-table-component';
import Lightbox from 'react-native-lightbox';
const response = {
  id: 35,
  url: 'http://127.0.0.1:8000/api/video/35/',
  title: 'Wall House Video Test',
  description:
    'Abandoned building wall to object detect and test using video cv2 - (Via Video Upload)',
  lat: 27.7,
  lng: 85.3,
  user_id: 2,
  user_name: 'Mr. Admin',
  user_type: 'admin',
  image_files: [
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
  ],
  created_at: '2020-03-25T06:47:53.703119Z',
  updated_at: '2020-03-25T06:47:53.703119Z',
};
export default class ExampleFour extends Component {
  constructor(props) {
    super(props);
    const state1 = props.navigation;
console.log("PROPS " + JSON.stringify(state1));
    this.state = {
      tableHead: ['Image', 'Tested', 'Score', 'Result'],
      tableData: [
        ['1', 'Image 1', '3', 'Go'],
        ['2', 'Image 2', 'c', 'NoGo'],
        ['3', 'Image 3', '3', 'Go'],
        ['4', 'Image 4', 'c', 'NoGo'],
      ],
      tableData3: [[]],
      tableData2: [
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
      ],
    };
  }
  componentDidMount() {
    const bb = [];
    this.state.tableData2.map((cellData, cellIndex) => {
      bb.push([
        cellData.file,
        cellData.tested,
        cellData.score,
        cellData.result,
      ]);
    });
    this.setState({tableData3: bb});
  }

  /*componentDidMount(() => {
   alert('DD');
   this.state.tableData2.map((cellData, cellIndex) => {
    var joined = this.state.tableData.concat([
        [
          '70','80','90'
        ]
      ]);
     

   });
   this.setState({ tableData3: joined });
  });*/

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>button</Text>
        </View>
      </TouchableOpacity>
    );
    const cellElement1 = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <Lightbox>
          <Image
            style={{width: 70, height: 70, marginTop: 3}}
            source={require("../../assets/1.jpeg")}
            //source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
          />
        </Lightbox>
      </TouchableOpacity>
    );

    const cellElement2 = (data, index) => (
      <View>
        {data == true ? (
          <Text style={styles.positive}>True</Text>
        ) : (
          <Text style={styles.negative}>False</Text>
        )}
      </View>
    );

    const cellElement3 = (data, index) => (
      <Text style={{fontWeight: 'bold'}}>{data}</Text>
    );

    const cellElement4 = (data, index) => (
      <View>
        {data == 'go' ? (
          <Text style={styles.positive}>Go</Text>
        ) : (
          <Text style={styles.negative}>NoGo</Text>
        )}
      </View>
    );

    return (
      <View style={styles.container}>
        <Table borderStyle={{borderColor: 'transparent'}}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {state.tableData3.map((rowData, index) => (
            <TableWrapper key={index} style={styles.row}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 0
                      ? cellElement1(cellData, index)
                      : cellIndex === 1
                      ? cellElement2(cellData, index)
                      : cellIndex === 2
                      ? cellElement3(cellData, index)
                      : cellIndex === 3
                      ? cellElement4(cellData, index)
                      : null
                  }
                  textStyle={styles.text}
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  container: {flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff'},
  head: {height: 40, backgroundColor: '#808B97'},
  text: {margin: 6},
  row: {flexDirection: 'row', backgroundColor: '#FFF1C1'},
  btn: {width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2},
  btnText: {textAlign: 'center', color: '#fff'},
});
