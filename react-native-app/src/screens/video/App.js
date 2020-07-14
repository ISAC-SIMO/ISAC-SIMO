"use strict";
import React, { Component } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Tabs from "react-native-tabs";
import RecordVideo from "./RecordVideo";
import VideoOverview from "./VideoOverview";
const { height, width } = Dimensions.get("window");

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      page: "watch"
    };
  }
  render() {
    const { page } = this.state;
    return (
      <View style={styles.container}>
        <Tabs
          selected={page}
          style={{ backgroundColor: "white" }}
          selectedStyle={{ fontWeight: "bold" }}
          onSelect={el => this.setState({ page: el.props.name })}
        >
          <Text name="watch">Watch</Text>
          <Text name="record">Record</Text>
        </Tabs>

        {page === "record" && (
          <View style={styles.contentContainer}>
            <RecordVideo />
          </View>
        )}
        {page === "watch" && (
          <View style={styles.contentContainer}>
            <VideoOverview />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start"
  },
  contentContainer: {
    height: height - 75
  }
});