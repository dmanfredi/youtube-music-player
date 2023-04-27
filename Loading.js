import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState } from 'react';

const Loading = () => {
  return (
    <View style={styles.dimContainer}>
      <Image
        style={styles.loading}
        source={require('./assets/loading.gif')}
      ></Image>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  dimContainer: {
    position: 'absolute',
    flex: 1,
    // backgroundColor: '#00000012',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '110%',
    zIndex: 99999,
  },
  loading: {
    width: 70,
    height: 70,
    opacity: 0.6,
  },
});
