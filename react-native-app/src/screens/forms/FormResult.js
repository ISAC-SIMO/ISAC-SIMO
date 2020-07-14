import React, { Component, useState, useEffect, PropTypes } from 'react';
import { Button, TextInput } from 'react-native-paper';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  KeyboardAvoidingView, Alert,
  Image, StyleSheet,ScrollView
} from 'react-native';

import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import Lightbox from 'react-native-lightbox';

const FormResult = (route, props) => {
  var resData = '';
  resData=route.route.params.resData;

  const [tableHead, setTableHead] = useState(['Image', 'Tested', 'Score', 'Result']);
  const [tableData3, setTableData3] = useState([[]]);
  const [tableData2, setTableData2] = useState(resData);

  React.useEffect(() => {
    const bb = [];
    tableData2.map((cellData, cellIndex) => {
      bb.push([
        cellData.file,
        cellData.tested,
        cellData.score,
        cellData.result,
      ]);
    });
    setTableData3(bb);


  }, []);
  const cellElement1 = (data, index) => (
    <TouchableOpacity onPress={() => this._alertIndex(index)}>
      <Lightbox>
  
        <Image
          style={{ width: 70, height: 70, marginTop: 3 }}
         // source={require("../../assets/1.jpeg")}
        source={{uri: data}}
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
    <Text style={{ fontWeight: 'bold' }}>{data}</Text>
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

  const sendCred = async (props) => {

  }
  return (
    <>


      <View style={styles.container}>
      <ScrollView>
      <Table borderStyle={{ borderColor: 'transparent' }}>
          <Row
            data={tableHead}
            style={styles.head}
            textStyle={styles.text}
          />
          {tableData3.map((rowData, index) => (
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


      </ScrollView>

      </View>

    </>
  );
};



export default FormResult;

const styles = StyleSheet.create({
  positive: {
    color: 'green',
  },
  negative: {
    color: 'red',
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', backgroundColor: '#FFF1C1' },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB', borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
});
