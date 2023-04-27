import { Button, StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './Loading';
import TrackItem from './TrackItem';
import Header from './Header';

const Tracks = ({ props }) => {
  const [loading, setLoading] = useState(true);
  const [renderer, forceRender] = useState(0); // Stupid hack
  const trackData = useRef([]);

  let headers = {
    tracks: (
      <Header
        title="Tracks"
        functionality={props.handleChangePrimaryComponent}
        image={require('./assets/back_arrow2.png')}
      ></Header>
    ),
    favorite: null,
    playlistCreation: null,
  };

  useEffect(() => {
    getTrackData();
  }, []);

  async function updateTrackData(track, action) {
    for (let i = 0; i < trackData.current.length; i++) {
      if (trackData.current[i].track === track) {
        if (action === 'delete') {
          trackData.current.splice(i, 1);
          await FileSystem.deleteAsync(
            `${FileSystem.documentDirectory}music/${track}`
          );
          // const value = +(await AsyncStorage.getItem('ID'));
          // await AsyncStorage.setItem('ID', value - 1 + '');

          // If you have this track in a playlist. Remove it from the playlist.
          let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
          let favorites = JSON.parse(await AsyncStorage.getItem('favorites'));
          for (let key in playlists) {
            let playlist = playlists[key];

            if (playlist.includes(track)) {
              playlist.splice(playlist.indexOf(track), 1);

              if (playlist.length === 0) delete playlists[key];
            }
          }

          if (favorites.includes(track)) {
            favorites.splice(favorites.indexOf(track), 1);
          }

          await AsyncStorage.setItem('playlists', JSON.stringify(playlists));
          await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
        } else if (action === 'favorite') {
          let favorites = JSON.parse(await AsyncStorage.getItem('favorites'));
          let index = favorites.indexOf(trackData.current[i]);

          if (!trackData.current[i].favorite) {
            favorites.push(track);
            trackData.current[i].favorite = true;
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
          } else {
            favorites.splice(index, 1);
            trackData.current[i].favorite = false;
            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
          }
        }
        forceRender(renderer + 1);
        return;
      }
    }
  }

  async function getTrackData() {
    let tracks = [];
    if (props.context === 'tracks' || props.context === 'playlistCreation') {
      tracks = await FileSystem.readDirectoryAsync(
        `${FileSystem.documentDirectory}music/`
      );
    } else if (props.context === 'favorites') {
      tracks = JSON.parse(await AsyncStorage.getItem('favorites'));
      if (!tracks) {
        setLoading(false);
        return;
      }
    }
    for (let i = 0; i < tracks.length; i++) {
      let track = tracks[i];
      let json = `${FileSystem.documentDirectory}music/${track}/${track}.json`;

      let imgURL = JSON.parse(await FileSystem.readAsStringAsync(json)).img;
      let title = JSON.parse(await FileSystem.readAsStringAsync(json)).title;
      let duration = JSON.parse(
        await FileSystem.readAsStringAsync(json)
      ).duration;

      let totalSeconds = duration / 1000;
      let minutes = Math.floor(totalSeconds / 60);
      let seconds = (Math.floor(totalSeconds % 60) + '').padStart(2, '0');
      let formatedTime = minutes + ':' + seconds;
      let favorites = JSON.parse(await AsyncStorage.getItem('favorites'));

      let config = {
        imgURL: imgURL,
        title: title,
        duration: formatedTime,
        track: track,
        favorite: favorites.includes(track),
      };

      // console.log(trackData);
      trackData.current.push(config);
    }

    // setTrackData(trackDataTemp);
    setLoading(false);
  }

  return (
    <>
      {loading ? <Loading> </Loading> : null}
      {headers[props.context]}
      <ScrollView
        contentContainerStyle={styles.centerer}
        fadingEdgeLength={50}
        style={styles.tracksContainer}
      >
        {loading
          ? null
          : trackData.current.map((config, i) => (
              <TrackItem
                key={i} // Getting a bit silly in here
                imgURL={config.imgURL}
                title={config.title}
                duration={config.duration}
                track={config.track}
                favorite={config.favorite}
                context={props.context}
                playlist={props.playlist}
                functionality={props.functionality}
                updateData={updateTrackData}
                handleSetTrack={props.handleSetTrack}
              ></TrackItem>
            ))}
      </ScrollView>
    </>
  );
};

export default Tracks;

const styles = StyleSheet.create({
  centerer: {
    justifyContent: 'center',
    // alignItems: 'center'
  },
  tracksContainer: {
    // position: 'relative',
    // overflow: 'visible',
    // height: '100%',
    flex: 1,
    // backgroundColor: 'blue',
    // zIndex: 1,
  },
});
