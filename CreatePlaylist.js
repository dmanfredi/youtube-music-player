import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import Header from './Header';
import Tracks from './Tracks';

const CreatePlaylist = ({
  handleChangePrimaryComponent,
  handleToggleCreatePlaylistMenu,
  editPlaylist,
  editPlatlistTitle,
}) => {
  const [playlist, updatePlaylist] = useState([]);
  const playlistTitle = useRef('Untitled Playlist');
  //let playlistTitle = 'Untitled Playlist';

  useEffect(() => {
    if (editPlaylist) updatePlaylist([...editPlaylist]);
    if (editPlatlistTitle) playlistTitle.current = editPlatlistTitle;
  }, []);

  function handleUpdatePlaylist(track) {
    if (playlist.includes(track)) playlist.splice(playlist.indexOf(track), 1);
    else playlist.push(track);

    updatePlaylist([...playlist]);
  }

  // async function getplaylists() {
  //   let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
  //   console.log(playlists);
  // }
  // getplaylists();

  async function createPlaylist() {
    // Bad code
    playlist.current = playlist.current + ''; // In case of numbers
    let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));

    if (editPlaylist) {
      if (
        playlists[playlistTitle.current] && // Dont cause a fuss if your just editing the tracks of a playlist without renaming it
        playlistTitle.current !== editPlatlistTitle
      ) {
        ToastAndroid.show('Playlist already exists!', ToastAndroid.SHORT);
        return;
      }

      delete playlists[editPlatlistTitle];
    } else {
      // Not editing
      if (playlists[playlistTitle.current]) {
        ToastAndroid.show('Playlist already exists!', ToastAndroid.SHORT);
        return;
      }
    }

    if (playlist.length === 0) {
      ToastAndroid.show('Cannot create an empty playlist!', ToastAndroid.SHORT);
      return;
    }

    // Update playlists
    playlists[playlistTitle.current] = playlist;
    await AsyncStorage.setItem('playlists', JSON.stringify(playlists));

    // This is bad
    if (editPlatlistTitle === playlistTitle.current) {
      handleToggleCreatePlaylistMenu(
        'editedPlaylistContents',
        playlistTitle.current,
        editPlatlistTitle
      );
    } else if (editPlaylist)
      handleToggleCreatePlaylistMenu(
        'editedPlaylist',
        playlistTitle.current,
        editPlatlistTitle
      );
    else
      handleToggleCreatePlaylistMenu(
        'addedPlaylist',
        playlistTitle.current,
        editPlatlistTitle
      );
    // handleToggleCreatePlaylistMenu(editPlaylist ? 'editedPlaylist': 'addedPlaylist', playlistTitle.current, editPlatlistTitle);
  }

  return (
    <>
      <SafeAreaView style={styles.dimContainer}>
        <Header
          title=""
          functionality={handleToggleCreatePlaylistMenu}
          image={require('./assets/back_arrow2.png')}
        ></Header>
        <View style={styles.inputContainer}>
          <TextInput
            onChangeText={(e) => {
              playlistTitle.current = e;
            }}
            style={styles.input}
            placeholder="Name Your Playlist"
            placeholderTextColor="darkgray"
            defaultValue={playlistTitle.current}
          ></TextInput>
          <TouchableOpacity
            activeOpacity={0.6}
            underlayColor="#000000"
            style={styles.confirmButton}
            onPress={() => createPlaylist()}
          >
            <Image
              style={styles.confirmImage}
              source={require('./assets/confirm2.png')}
            ></Image>
          </TouchableOpacity>
        </View>
        <Tracks
          props={{
            context: 'playlistCreation',
            playlist: playlist,
            functionality: handleUpdatePlaylist,
          }}
        ></Tracks>
      </SafeAreaView>
    </>
  );
};
export default CreatePlaylist;

const styles = StyleSheet.create({
  dimContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#000000e1',
    // alignItems: 'center',
    // justifyContent: 'center',
    width: '100%',
    height: '110%',
    zIndex: 10,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  input: {
    width: '70%',
    height: 30,
    borderColor: GlobalStyles.color.varAccentColor,
    borderWidth: 1,
    color: 'white',
    textAlign: 'center',
    // backgroundColor: 'blue',
  },
  confirmButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmImage: {
    width: 30,
    height: 30,
  },
  // addAlbum: {
  //   padding: 20,
  //   width: '98%',
  //   height: 60,
  //   backgroundColor: GlobalStyles.color.varBackgroundColor,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // add: {
  //   width: 50,
  //   height: 50,
  //   zIndex: 99,
  // },
});
