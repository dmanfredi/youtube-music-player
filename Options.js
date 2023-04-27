import {
  StyleSheet,
  Text,
  Touchable,
  TouchableOpacity,
  View,
  Dimensions,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import GlobalStyles from './GlobalStyles';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Options = ({ props }) => {
  const { height, width } = useWindowDimensions();
  // { width: width, height: height }
  // , { width: width, height: height }

  let option =
    props.context === 'tracks'
      ? props.favorite
        ? 'Remove From Favorites'
        : 'Add To Favorites'
      : 'Edit';

  return (
    <Pressable
      style={styles.dimContainer}
      onPress={() => props.handleOptionsMenuToggle()}
    >
      <Pressable style={styles.menuContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          activeOpacity={0.6}
          underlayColor="#000000"
          onPress={() => {
            props.updateData(props.track, 'favorite', props.playlist);
            props.handleOptionsMenuToggle();
          }}
        >
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.4}
          onPress={() => {
            props.updateData(props.track, 'delete', props.playlist);
            //props.handleOptionsMenuToggle();
          }}
        >
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </Pressable>
    </Pressable>
  );
};

export default Options;

const styles = StyleSheet.create({
  dimContainer: {
    position: 'absolute',
    flex: 1,
    backgroundColor: '#171717f0',
    alignItems: 'center',
    justifyContent: 'center',
    width: '85%',
    height: '100%',
    // width: 100,
    zIndex: 100,
  },
  menuContainer: {
    width: '80%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
  },
  optionButton: {
    width: '70%',
    // backgroundColor: 'blue',
    height: 40,

    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  deleteButton: {
    width: '35%',
    // backgroundColor: 'red',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#ffb7b7',
  },
});
