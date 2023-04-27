import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';

import GlobalStyles from './GlobalStyles';

const Header = ({ title, functionality, image }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}> {title} </Text>
      <TouchableOpacity
        activeOpacity={0.7}
        underlayColor="#000000"
        onPress={() => functionality('main')} // Hackish. This function will either open the upload menu or return us to the menu
      >
        <View style={styles.button}>
          <Image style={styles.buttonImg} source={image}></Image>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: 25,
    paddingLeft: 10,
    paddingRight: 20,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // height: 100,
    // backgroundColor: 'blue',
    zIndex: 9999999999,
  },
  header: {
    color: 'white',
    fontSize: 32,
  },
  button: {
    width: 50,
    height: 50,
    // backgroundColor: GlobalStyles.color.varBackgroundColor,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // color: varAccentColor,
  },
  buttonImg: {
    color: 'black',
    width: 37,
    height: 37,
    zIndex: 99,
  },
});
