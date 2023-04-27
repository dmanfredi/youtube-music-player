import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Header from './Header';
import GlobalStyles from './GlobalStyles';
import CreatePlaylist from './CreatePlaylist';
import Tracks from './Tracks';
import Loading from './Loading';
import TrackItem from './TrackItem';

const Playlists = ({ props }) => {
  const [inCreatePlaylistMenu, toggleCreatePlaylistMenu] = useState(false);
  const [menuType, setMenuType] = useState(
    <CreatePlaylist
      handleChangePrimaryComponent={props.handleChangePrimaryComponent}
      handleToggleCreatePlaylistMenu={handleToggleCreatePlaylistMenu}
    ></CreatePlaylist>
  );
  const [loading, setLoading] = useState(true);
  const [renderer, forceRender] = useState(0); // Stupid hack
  const playlistData = useRef([]);

  useEffect(() => {
    getPlaylistsData();
  }, []);

  async function handleToggleCreatePlaylistMenu(
    action,
    playlist,
    editedPlaylist
  ) {
    let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
    if (action === 'addedPlaylist') {
      let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
      await addPlaylist(playlist, playlists);
      toggleCreatePlaylistMenu(!!inCreatePlaylistMenu); // I don't get why I have to do this.
    } else if (action === 'editedPlaylist') {
      await updatePlaylistData(false, 'delete', editedPlaylist); // Not ideal
      await addPlaylist(playlist, playlists); // Shit dude none of this is ideal
      toggleCreatePlaylistMenu(!!inCreatePlaylistMenu);
    } else if (action === 'editedPlaylistContents') {
      // console.log(playlistData);
      // await addPlaylist(playlist, playlists);
      toggleCreatePlaylistMenu(!!inCreatePlaylistMenu);
    } else if (action === 'edit') {
      let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
      setMenuType(
        <CreatePlaylist
          handleChangePrimaryComponent={props.handleChangePrimaryComponent}
          handleToggleCreatePlaylistMenu={handleToggleCreatePlaylistMenu}
          editPlaylist={playlists[playlist]}
          editPlatlistTitle={playlist}
        ></CreatePlaylist>
      );
      toggleCreatePlaylistMenu(!inCreatePlaylistMenu);
    } else {
      setMenuType(
        <CreatePlaylist
          handleChangePrimaryComponent={props.handleChangePrimaryComponent}
          handleToggleCreatePlaylistMenu={handleToggleCreatePlaylistMenu}
        ></CreatePlaylist>
      );
      toggleCreatePlaylistMenu(!inCreatePlaylistMenu);
    }

    // getPlaylistsData();
  }

  async function addPlaylist(playlist, playlists) {
    let json = `${FileSystem.documentDirectory}music/${playlists[playlist][0]}/${playlists[playlist][0]}.json`;
    let imgURL = JSON.parse(await FileSystem.readAsStringAsync(json)).img;
    let duration = '';

    let config = {
      imgURL: imgURL,
      title: playlist,
      duration: duration,
      playlist: playlist,
    };

    playlistData.current.push(config);
  }

  async function updatePlaylistData(track, action, playlist) {
    // Track is useless here
    if (action === 'delete') {
      let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
      delete playlists[playlist];
      await AsyncStorage.setItem('playlists', JSON.stringify(playlists));

      for (let i = 0; i < playlistData.current.length; i++) {
        if (playlistData.current[i].playlist === playlist) {
          playlistData.current.splice(i, 1);
        }
      }
    } else if (action === 'favorite') {
      handleToggleCreatePlaylistMenu('edit', playlist);
    }
    forceRender(renderer + 1);
  }

  async function getPlaylistsData() {
    let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
    for (let playlist in playlists) {
      await addPlaylist(playlist, playlists);
    }
    setLoading(false);
  }

  return (
    <>
      {loading ? <Loading> </Loading> : null}
      {inCreatePlaylistMenu ? menuType : null}
      <Header
        title="Playlists"
        functionality={
          inCreatePlaylistMenu
            ? handleToggleCreatePlaylistMenu
            : props.handleChangePrimaryComponent
        }
        image={require('./assets/back_arrow2.png')}
      ></Header>
      <ScrollView
        contentContainerStyle={styles.centerer}
        style={styles.playlistsContainer}
      >
        <View style={styles.addPlaylistContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            underlayColor="#000000"
            style={styles.addPlaylist}
            onPress={() => handleToggleCreatePlaylistMenu()}
          >
            <Image
              style={styles.add}
              source={require('./assets/add.png')}
            ></Image>
          </TouchableOpacity>
        </View>
        {loading
          ? null
          : playlistData.current.map((config, i) => (
              <TrackItem
                key={i} // Getting a bit silly in here
                imgURL={config.imgURL}
                title={config.title}
                duration={config.duration}
                context="playlist"
                playlist={config.playlist}
                functionality={props.functionality}
                handleSetTrack={props.handleSetTrack}
                updateData={updatePlaylistData}
              ></TrackItem>
            ))}
      </ScrollView>
    </>
  );
};

export default Playlists;

const styles = StyleSheet.create({
  centerer: {
    justifyContent: 'center',
  },
  playlistsContainer: {
    overflow: 'visible',
    flex: 1,
  },
  addPlaylistContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  addPlaylist: {
    width: '90%',
    height: 60,
    backgroundColor: GlobalStyles.color.varBackgroundColorMedium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  add: {
    width: 50,
    height: 50,
    zIndex: 99,
  },
});
