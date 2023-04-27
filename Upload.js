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
  ToastAndroid,
  Image,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import Loading from './Loading';
import { useState } from 'react';
import GlobalStyles from './GlobalStyles';

let trackDir = '';
const Upload = ({ handleUploadMenuToggle, setImg }) => {
  const [loading, setLoading] = useState(false);

  let link = '';

  (async function initTrackIDCounter() {
    // Create the ID tracker
    try {
      const value = await AsyncStorage.getItem('ID');
      if (value === null) await AsyncStorage.setItem('ID', '0');
    } catch (e) {
      console.log(e);
    }
  })();
  async function updateTrackID() {
    try {
      const value = +(await AsyncStorage.getItem('ID'));
      await AsyncStorage.setItem('ID', value + 1 + '');
    } catch (e) {
      console.log(e);
    }
  }
  async function getLastID() {
    try {
      return +(await AsyncStorage.getItem('ID'));
    } catch (e) {
      console.log(e);
    }
  }

  function validateUrl(url) {
    let p =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.match(p)) return !!url.match(p)[1];
    return false;
  }

  // async function allkeys() {
  //   let keys = await AsyncStorage.getAllKeys();
  //   let playlists = await AsyncStorage.getItem('playlists');
  //   console.log(keys);
  //   console.log(playlists);
  // }
  // allkeys();

  // async function wipePlaylists() {
  //   // ['Untitled Playlist', 'Dddddd', 'Hello World...']

  //   await AsyncStorage.removeItem('playlists');
  // }
  // wipePlaylists();

  async function wipeNonesense() {
    await AsyncStorage.removeItem('ID');
    await AsyncStorage.removeItem('playlists');
    await AsyncStorage.removeItem('favorites');
    // console.log(bar);
    await FileSystem.deleteAsync(
      'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540dm4n%252Fmusic-player/music/'
    );
    console.log('Done');
  }
  //wipeNonesense();

  async function checkNonsense() {
    // let count = await getLastID();
    // console.log(count);
    let info = await FileSystem.getInfoAsync(
      'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540dm4n%252Fmusic-player/music/'
    );
    console.log(info);
    let contents = await FileSystem.readDirectoryAsync(
      'file:///data/user/0/host.exp.exponent/files/ExperienceData/%2540dm4n%252Fmusic-player/music/'
    );
    console.log(contents);
  }
  checkNonsense();

  async function downloadData() {
    try {
      if (!validateUrl(link)) {
        ToastAndroid.show('Invalid URL!', ToastAndroid.SHORT);
        return;
      }
      setLoading(true);

      let address = `http://18.237.229.212:8080/audio/video=${link}`;
      let trackID = (await getLastID()) + 1;
      let folder = 'track' + trackID + '/';
      trackDir = FileSystem.documentDirectory + 'music/' + folder;

      await FileSystem.makeDirectoryAsync(trackDir);

      const downloadResumableAudio = FileSystem.createDownloadResumable(
        address,
        trackDir + 'track' + trackID + '.mp3',
        {}
        // callback
      );
      await downloadResumableAudio.downloadAsync();

      updateTrackID();
      let detailsAddress = `http://18.237.229.212:8080/details/video=${link}`;
      // Name and thumbnail
      const downloadResumableDetails = FileSystem.createDownloadResumable(
        detailsAddress,
        trackDir + 'track' + trackID + '.json',
        {}
        // callback
      );
      await downloadResumableDetails.downloadAsync();
      setImg();
      handleUploadMenuToggle();
    } catch (e) {
      console.log(e);
      if (String(e).includes('Failed to connect')) {
        ToastAndroid.show('Could not connect to server!', ToastAndroid.SHORT);
      } else ToastAndroid.show('An error occured', ToastAndroid.SHORT);

      // Whatever the error, make sure a new directory isnt made
      await FileSystem.deleteAsync(trackDir);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <View style={styles.dimContainer}>
        <Text style={styles.prompt}>
          Provide a valid Youtube link to begin downloading
        </Text>
        <TextInput
          onChangeText={(e) => (link = e)}
          style={styles.input}
        ></TextInput>
        <TouchableOpacity
          activeOpacity={0.7}
          underlayColor="#000000"
          style={styles.confirmCancel}
          onPress={() => downloadData()}
        >
          <View>
            <Text style={styles.confirmText}>Download</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          underlayColor="#000000"
          style={styles.confirmCancel}
          onPress={() => handleUploadMenuToggle()}
        >
          <View>
            <Text style={styles.cancelText}>Cancel</Text>
          </View>
        </TouchableOpacity>
        {loading ? <Loading> </Loading> : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  dimContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#000000b7',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '110%',
    zIndex: 999,
  },
  prompt: {
    textAlign: 'center',
    width: '80%',
    color: 'white',
    paddingBottom: 20,
  },
  input: {
    width: '80%',
    height: 30,
    borderColor: GlobalStyles.color.varAccentColor,
    borderWidth: 1,
    color: 'white',
  },
  confirmCancel: {
    // backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'green',
    width: '80%',
    height: 30,
    marginTop: 20,
  },
  confirmText: {
    color: 'white',
    fontSize: 18,
  },
  cancelText: {
    color: '#ffb7b7',
    fontSize: 18,
  },
});

export default Upload;
