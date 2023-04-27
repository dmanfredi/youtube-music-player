import {
  StyleSheet,
  Text,
  View,
  ViewBase,
  ViewComponent,
  Button,
  TextInput,
  TouchableHighlight,
  ToastAndroid,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
  initialWindowMetrics,
  withSafeAreaInsets,
} from 'react-native-safe-area-context';
// Note: Ive commented out a line in "node_modules\react-native-safe-area-context\src\index.tsx"
// because it giving me the error: Unable to resolve "./InitialWindow" from "node_modules\react-native-safe-area-context\src\index.tsx"
// Pray this breaks nothing
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import Main from './Main';
import Controller from './Controller';
import Tracks from './Tracks';
import GlobalStyles from './GlobalStyles';
import Playlists from './Playlists';
import { readDirectoryAsync } from 'expo-file-system';

let playlist;
let playlistPosistion;
export default function App() {
  let primaryComps = {
    main: (
      <Main
        props={{
          handleChangePrimaryComponent: handleChangePrimaryComponent,
          handleSetTrack: handleSetTrack,
        }}
      ></Main>
    ),
    tracks: (
      <Tracks
        props={{
          handleChangePrimaryComponent: handleChangePrimaryComponent,
          handleSetTrack: handleSetTrack,
          context: 'tracks',
        }}
      ></Tracks>
    ),
    playlists: (
      <Playlists
        props={{
          handleChangePrimaryComponent: handleChangePrimaryComponent,
          handleSetTrack: handleSetTrack,
        }}
      ></Playlists>
    ),
  };

  const [primaryComponent, setPrimaryComponent] = useState('main');
  const [track, setTrack] = useState({ uri: '' });
  const [trackDetails, setTrackDetails] = useState('{}');
  const [sound, setSound] = useState();
  const [status, setStatus] = useState({});

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.DuckOthers,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
      playThroughEarpieceAndroid: false,
    });
    initFavorites();
    initDirs();
  }, []);

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  useEffect(() => {
    if (track.uri === '') return;
    playSound();
  }, [track]);

  async function initFavorites() {
    // Create the favorites and playlists array
    try {
      const favs = await AsyncStorage.getItem('favorites');
      if (favs === null) await AsyncStorage.setItem('favorites', '[]');

      const lists = await AsyncStorage.getItem('playlists');
      if (lists === null) await AsyncStorage.setItem('playlists', '{}');
    } catch (e) {
      console.log(e);
    }
  }

  // Init music directory for this first time
  async function initDirs() {
    const musicDir = FileSystem.documentDirectory + 'music/';
    const musicInfo = await FileSystem.getInfoAsync(musicDir);
    if (!musicInfo.exists) await FileSystem.makeDirectoryAsync(musicDir);
  }

  function handleChangePrimaryComponent(comp) {
    setPrimaryComponent(comp);
  }

  async function handleSetTrack(item, context) {
    if (context === 'playlist') {
      let playlists = JSON.parse(await AsyncStorage.getItem('playlists'));
      playlist = playlists[item];
      playlistPosistion = 0;
      setTrack({
        uri: `${FileSystem.documentDirectory}music/${playlist[playlistPosistion]}/${playlist[playlistPosistion]}.mp3`,
      });
    } else {
      playlist = undefined;
      playlistPosistion = undefined;
      setTrack({
        uri: `${FileSystem.documentDirectory}music/${item}/${item}.mp3`,
      });
    }
  }

  function onPlaybackStatusUpdate(e) {
    setStatus(e);

    if (e.didJustFinish && playlist) {
      playlistPosistion++;

      if (playlistPosistion === playlist.length) playlistPosistion = 0;

      setTrack({
        uri: `${FileSystem.documentDirectory}music/${playlist[playlistPosistion]}/${playlist[playlistPosistion]}.mp3`,
      });
    }
  }

  async function playSound() {
    if (track.uri === '') return;
    let trackDetailsPath = track.uri.replace('mp3', 'json');
    let trackDetails = await FileSystem.readAsStringAsync(trackDetailsPath);

    const initialStatus = {
      shouldPlay: true,
      rate: 1,
      shouldCorrectPitch: false,
      volume: 1,
      isMuted: false,
      isLooping: true,
    };

    const { sound } = await Audio.Sound.createAsync(
      track,
      initialStatus,
      onPlaybackStatusUpdate
    );
    sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);

    setSound(sound);
    setTrackDetails(trackDetails);

    !playlist ? sound.setIsLoopingAsync(true) : sound.setIsLoopingAsync(false);
    await sound.playAsync();
  }

  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {primaryComps[primaryComponent]}
        <Controller
          props={{ status: status, sound: sound, trackDetails: trackDetails }}
        ></Controller>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GlobalStyles.color.varBackgroundColor,
  },
});
