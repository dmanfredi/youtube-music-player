import {
  StyleSheet,
  Text,
  View,
  ViewBase,
  ViewComponent,
  Button,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import Header from './Header';
import Upload from './Upload';
import Quickplay from './Quickplay';
// import MusicControl from 'react-native-music-control';
// import { Command } from 'react-native-music-control'

const Main = ({ props }) => {
  let [trackImg, setTrackImg] = useState(require('./assets/placeholder1.png'));
  let [playlistImg, setPlaylistImg] = useState(
    require('./assets/placeholder2.png')
  );
  const [upload, inUploadMenu] = useState(false);

  useEffect(() => {
    setImg();
  }, []);

  function handleUploadMenuToggle() {
    inUploadMenu(!upload);
  }

  async function setImg() {
    let tracks = await FileSystem.readDirectoryAsync(
      `${FileSystem.documentDirectory}music/`
    );
    if (tracks.length === 0) return;
    let track = tracks[(Math.random() * tracks.length) << 0]; // << round
    let json = `${FileSystem.documentDirectory}music/${track}/${track}.json`;
    let imgURL = JSON.parse(await FileSystem.readAsStringAsync(json)).img;
    setTrackImg({
      uri: imgURL,
    });

    let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
    let keys = Object.keys(playlists);
    if (keys.length === 0) return;
    let playlistTrack = playlists[keys[(Math.random() * keys.length) << 0]][0];
    let playlistTrackJson = `${FileSystem.documentDirectory}music/${playlistTrack}/${playlistTrack}.json`;
    let playlistTrackImageURL = JSON.parse(
      await FileSystem.readAsStringAsync(playlistTrackJson)
    ).img;
    setPlaylistImg({
      uri: playlistTrackImageURL,
    });
  }

  return (
    <>
      {upload ? (
        <Upload
          setImg={setImg}
          handleUploadMenuToggle={handleUploadMenuToggle}
        ></Upload>
      ) : null}
      <Header
        title="Download"
        functionality={handleUploadMenuToggle}
        image={require('./assets/download.png')}
      ></Header>
      <View style={styles.mainContainer}>
        <View style={styles.trackPlaylistContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            underlayColor="#000000"
            onPress={() => {
              props.handleChangePrimaryComponent('tracks');
            }}
            style={styles.trackPlaylistButton}
          >
            <ImageBackground
              style={styles.trackPlaylistButton}
              source={trackImg}
            >
              <Text style={styles.trackPlaylistText}>Tracks</Text>
            </ImageBackground>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.6}
            underlayColor="#000000"
            onPress={() => {
              props.handleChangePrimaryComponent('playlists');
            }}
            style={styles.trackPlaylistButton}
          >
            <ImageBackground
              style={styles.trackPlaylistButton}
              source={playlistImg}
            >
              <Text style={styles.trackPlaylistText}>Playlists</Text>
            </ImageBackground>
          </TouchableOpacity>
          <Image
            style={[styles.trackPlaylistButton, styles.imageShadowAlbum]}
            source={playlistImg}
          ></Image>
          <Image
            style={[styles.trackPlaylistButton, styles.imageShadowTrack]}
            source={trackImg}
          ></Image>
        </View>
        <Quickplay
          props={{
            handleChangePrimaryComponent: props.handleChangePrimaryComponent,
            handleSetTrack: props.handleSetTrack,
          }}
        ></Quickplay>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  trackPlaylistContainer: {
    padding: 20,
    paddingLeft: 15,
    flexDirection: 'row',
    // backgroundColor: 'white',
    justifyContent: 'space-between',
    height: 200,
  },
  trackPlaylistButton: {
    width: 140,
    height: 140,
    borderRadius: 5,
    overflow: 'hidden',
  },
  imageShadowAlbum: {
    position: 'absolute',
    zIndex: -1,
    width: 140,
    height: 140,
    marginTop: 30,
    marginRight: 10,
    right: 0,
    opacity: 0.4,
  },
  imageShadowTrack: {
    position: 'absolute',
    zIndex: -1,
    width: 140,
    height: 140,
    marginTop: 30,
    marginLeft: 25,
    left: 0,
    opacity: 0.4,
  },
  trackPlaylistText: {
    padding: 5,
    fontWeight: 'bold',
    color: 'white',
    fontSize: 25,
  },
});

export default Main;
