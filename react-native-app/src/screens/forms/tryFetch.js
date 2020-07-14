import React, { Component } from 'react'
import { Text, View,Button } from 'react-native'
// require the module
var RNFS = require('react-native-fs');


 readMyFile=()=>{
// get a list of files and directories in the main bundle
RNFS.readDir(RNFS.CachesDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
  .then((result) => {
    console.log('GOT RESULT', result);
 
    // stat the first file
    return Promise.all([RNFS.stat(result[0].path), result[0].path]);
  })
  .then((statResult) => {
    if (statResult[0].isFile()) {
      // if we have a file, read it
      return RNFS.readFile(statResult[1], 'utf8');
    }
 
    return 'no file';
  })
  .then((contents) => {
    // log the file contents
    console.log(contents);
  })
  .catch((err) => {
    console.log(err.message, err.code);
  });
}
 

export class tryFetch extends Component {
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
                <Button title="Switch to French" onPress={() => readMyFile()} />
            </View>
        )
    }
}

export default tryFetch
