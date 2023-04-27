import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  PanResponder,
  Animated,
  ImageBackground,
} from 'react-native';
import React, { useRef, useState } from 'react';
import GlobalStyles from './GlobalStyles';
import Options from './Options';

const TrackItem = (props) => {
  let [inOptionsMenu, toggleOptionsMenu] = useState(false);
  let image = { uri: props.imgURL };
  let icon =
    props.context === 'playlistCreation'
      ? props.playlist.includes(props.track)
        ? require(`./assets/remove3.png`)
        : require(`./assets/add.png`)
      : undefined;

  function handleOptionsMenuToggle() {
    toggleOptionsMenu(!inOptionsMenu);
  }

  let buttons = {
    tracks: (
      <TouchableOpacity
        activeOpacity={0.6}
        underlayColor="#000000"
        onPress={(e) => handleOptionsMenuToggle(inOptionsMenu)}
        style={styles.trackItemButton}
      >
        <Image
          source={require('./assets/edit2.png')}
          style={styles.trackItemButtonImage}
        ></Image>
      </TouchableOpacity>
    ),
    playlistCreation: (
      <TouchableOpacity
        activeOpacity={0.6}
        underlayColor="#000000"
        onPress={() => props.functionality(props.track)}
        style={styles.trackItemButton}
      >
        <Image source={icon} style={styles.trackItemButtonImage}></Image>
      </TouchableOpacity>
    ),
    playlist: (
      <TouchableOpacity
        activeOpacity={0.6}
        underlayColor="#000000"
        onPress={() => handleOptionsMenuToggle(inOptionsMenu)}
        style={styles.trackItemButton}
      >
        <Image
          source={require('./assets/edit2.png')}
          style={styles.trackItemButtonImage}
        ></Image>
      </TouchableOpacity>
    ),
    favorite: null,
  };

  return (
    <View style={styles.conatiner}>
      {inOptionsMenu ? (
        <Options
          props={{
            handleOptionsMenuToggle: handleOptionsMenuToggle,
            updateData: props.updateData,
            track: props.track,
            playlist: props.playlist,
            favorite: props.favorite,
            context: props.context,
          }}
        ></Options>
      ) : null}
      <TouchableOpacity
        activeOpacity={0.6}
        underlayColor="#000000"
        onPress={() =>
          props.track
            ? props.handleSetTrack(props.track, 'track')
            : props.handleSetTrack(props.playlist, 'playlist')
        }
      >
        <View style={styles.trackItemContainer}>
          <ImageBackground style={styles.trackImage} source={image}>
            {props.favorite ? (
              <Image
                source={require('./assets/star.png')}
                style={styles.star}
              ></Image>
            ) : null}
          </ImageBackground>
          <Image
            style={styles.palceholderImage}
            source={require('./assets/placeholder1.png')}
          ></Image>
          <View style={styles.trackItemDetails}>
            <View style={styles.trackTextContainer}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.trackText}
              >
                {props.title}
              </Text>
              <Text style={[styles.trackText, styles.trackTextTime]}>
                {props.duration}
              </Text>
            </View>
          </View>
          {buttons[props.context]}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TrackItem;

const styles = StyleSheet.create({
  conatiner: {
    position: 'relative',
    // backgroundColor: 'green',
  },
  star: {
    position: 'absolute',
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -8,
    marginLeft: -8,
    zIndex: 10,
  },
  palceholderImage: {
    marginLeft: 10,
    position: 'absolute',
    height: 60,
    width: 60,
    zIndex: 5,
  },
  trackItemContainer: {
    marginBottom: 8,
    marginTop: 8,
    //backgroundColor: 'beige',
    flexDirection: 'row',
    width: '100%',
    height: 60,
  },
  trackItemDetails: {
    flex: 1,
    //backgroundColor: 'black',
  },
  trackImage: {
    marginLeft: 10,
    height: 60,
    width: 60,
    zIndex: 8,
  },
  trackTextContainer: {
    padding: 5,
    paddingLeft: 15,
    justifyContent: 'center',
  },
  trackText: {
    color: 'white',
    fontSize: 15,
  },
  trackTextTime: {
    fontSize: 14,
  },
  trackItemButton: {
    marginRight: 10,
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'red',
  },
  trackItemButtonImage: {
    // backgroundColor: GlobalStyles.color.varAccentColor,
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});
