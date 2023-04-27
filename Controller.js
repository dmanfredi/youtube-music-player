import {
  StyleSheet,
  Text,
  View,
  ViewBase,
  ViewComponent,
  Button,
  TextInput,
  Pressable,
  TouchableOpacity,
  Image,
  ImageBackground,
  TouchableOpacityComponent,
} from 'react-native';
import GlobalStyles from './GlobalStyles';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';

let playerWidth;
const Controller = ({ props }) => {
  // const [status, setStatus] = useState();
  const [offset, setOffset] = useState('98%');
  const [image, setImage] = useState(require('./assets/play.png'));

  useEffect(() => {
    if (!props.status) return;
    if (props.status.isPlaying) setImage(require('./assets/pause.png'));
    else setImage(require('./assets/play.png'));

    let off =
      ((98 -
        (props.status.positionMillis / props.status.durationMillis) * 100) >>
        0) +
      '%';
    if (off === '0%') return;
    setOffset(off);
  }, [props.status]);

  function formatTime(duration) {
    let totalSeconds = duration / 1000;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = (Math.floor(totalSeconds % 60) + '').padStart(2, '0');
    let formatedTime = minutes + ':' + seconds;
    return formatedTime;
  }

  let detailsParsed = JSON.parse(props.trackDetails);
  let title = detailsParsed.title ?? 'Select A Track';
  let duration = '';
  if (props.status.positionMillis) {
    duration =
      formatTime(props.status.positionMillis) +
      '/' +
      formatTime(detailsParsed.duration);
  } else duration = '0:00';

  function scrubToPosisiton(e) {
    if (!props.status.positionMillis) return; // Any property would do.
    let pos = e.nativeEvent.locationX;
    let percent = pos / playerWidth;

    props.sound.playFromPositionAsync(
      (props.status.durationMillis * percent) >> 0
    );
  }

  return (
    <>
      <View style={styles.playerContainer}>
        <View style={styles.seperator}></View>
        <View style={styles.trackControllerContainer}>
          <View style={styles.trackControllerTitleWrapper}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.trackControllerTitle}
            >
              {title}
            </Text>
          </View>
          <View style={styles.trackControllerPlay}>
            <TouchableOpacity
              activeOpacity={0.6}
              underlayColor="#000000"
              onPress={() => {
                if (!props.sound) return;

                if (props.status.isPlaying) props.sound.pauseAsync();
                else props.sound.playAsync();
              }}
              style={styles.trackControllerPlayButton}
            >
              <Image
                style={styles.trackControllerPlayImage}
                source={image}
              ></Image>
            </TouchableOpacity>
          </View>
          <View style={styles.trackControllerTimeWrapper}>
            <Text style={styles.trackControllerTime}>{duration}</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <Pressable
            style={styles.progressInteractor}
            onPress={(e) => scrubToPosisiton(e)}
            onLayout={(e) => (playerWidth = e.nativeEvent.layout.width)}
          >
            <View style={styles.progressLine}>
              <View
                style={[styles.progressIndicator, { right: offset }]}
              ></View>
            </View>
          </Pressable>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  playerContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  seperator: {
    height: 10,
    backgroundColor: GlobalStyles.color.varBackgroundColor,
  },
  trackControllerContainer: {
    flexDirection: 'row',
    backgroundColor: GlobalStyles.color.varBackgroundColorMedium,
    height: 50,
  },
  trackControllerTitleWrapper: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  trackControllerTitle: {
    color: 'white',
  },
  trackControllerPlay: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackControllerPlayButton: {
    width: 30,
    height: 30,
    // backgroundColor: GlobalStyles.color.varAccentColor,
  },
  trackControllerPlayImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  trackControllerTimeWrapper: {
    width: '40%',
    height: '100%',
    justifyContent: 'center',
    paddingRight: 20,
  },
  trackControllerTime: {
    textAlign: 'right',
    color: 'white',
  },
  progressContainer: {
    backgroundColor: GlobalStyles.color.varBackgroundColorLight,
    height: 50,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressInteractor: {
    height: '100%',
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLine: {
    position: 'relative',
    backgroundColor: GlobalStyles.color.varAccentColor,
    width: '100%',
    height: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressIndicator: {
    position: 'absolute',
    backgroundColor: GlobalStyles.color.varAccentColor,
    width: 10,
    height: 10,
    borderRadius: 10,
    // right: '97%',
  },
});

export default Controller;
