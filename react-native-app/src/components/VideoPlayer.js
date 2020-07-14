 
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import VideoPlayer from 'react-native-video-player';

const VIMEO_ID = '179859217';

export default class App extends Component {
  constructor() {
    super();

    this.state = {
      video: { width: undefined, height: undefined, duration: undefined },
      thumbnailUrl: undefined,
      videoUrl: undefined,
    };
  }

  componentDidMount() {
    global.fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
      .then(res => res.json())
      .then(res => this.setState({
        thumbnailUrl: res.video.thumbs['720'],
        videoUrl: res.request.files.hls.cdns[res.request.files.hls.default_cdn].url,
        video: res.video,
      }));
  }

  //{"name":"mobile-video-upload","type":"video/mp4","uri":"file:///data/user/0/com.isac/cache/Camera/1d0a4e70-67a8-4ed0-a00e-e1f2c990d901.mp4"}

  render() {
    const newurl=this.props.newurl;
    return (
      <View>
       
        <VideoPlayer
          endWithThumbnail
          //thumbnail={{ uri: this.state.thumbnailUrl }}
          thumbnail={require('../assets/thumnail.png') }
          //video={{ uri: this.state.videoUrl }}
        // video={{uri: 'file:///data/user/0/com.isac/cache/Camera/1d0a4e70-67a8-4ed0-a00e-e1f2c990d901.mp4'}}
         video={{uri: this.props.newurl}}

         // video={require("file:///data/user/0/com.isac/cache/Camera/1d0a4e70-67a8-4ed0-a00e-e1f2c990d901.mp4")}
          videoWidth={this.state.video.width}
          videoHeight={this.state.video.height}
          duration={this.state.video.duration/* I'm using a hls stream here, react-native-video
            can't figure out the length, so I pass it here from the vimeo config */}
          ref={r => this.player = r}
        />

      </View>
    );
  }
}