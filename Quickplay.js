import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';
import Tracks from './Tracks';
import GlobalStyles from './GlobalStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Quickplay = ({ props }) => {
  // const [renderer, forceRender] = useState(0); // Stupid hack
  // const trackData = useRef([]);

  return (
    <>
      <View style={styles.quickPlayHeaderContainer}>
        <Text style={styles.quickPlayHeader}>Quick Play</Text>
      </View>
      <View style={styles.quickPlayContainer}>
        <Tracks
          props={{
            handleChangePrimaryComponent: props.handleChangePrimaryComponent,
            handleSetTrack: props.handleSetTrack,
            context: 'favorites',
          }}
        ></Tracks>
      </View>
    </>
  );
};

export default Quickplay;

const styles = StyleSheet.create({
  quickPlayHeaderContainer: {
    backgroundColor: GlobalStyles.color.varBackgroundColor,
    paddingLeft: 15,
    zIndex: 99,
  },
  quickPlayHeader: {
    color: 'white',
    fontSize: 28,
    paddingBottom: 5,
  },
  quickPlayContainer: {
    flex: 1,
    padding: 10,
    height: 200,
  },
});
