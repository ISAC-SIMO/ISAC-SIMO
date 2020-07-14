import {StyleSheet} from 'react-native'
const styles = StyleSheet.create({
    MainContainer: {
        justifyContent: "center",
        flex: 1,
        margin: 10
      },
      GridViewBlockStyle: {
        justifyContent: "center",
        flex: 1,
        alignItems: "center",
        height: 150,
        margin: 5,
        padding: 2,
    
        borderWidth: 2,
        borderColor: "gray",
        backgroundColor: "#f5f5f5",
        borderRadius: 10
      },
      boxTextWrapper: {
        //  position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center"
      },
      gridImage: {
        width: 100,
        height: 85,
        alignSelf: "center",
        paddingVertical:5
      },
      boxText: {
        fontSize: 17,
        color: "#595959",
        alignItems: "center",
        justifyContent: "center",
    
        fontFamily: "HelveticaNeue-Thin"
      },
  });
  export default styles;
  