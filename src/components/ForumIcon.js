import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native'

const ForumIcon = ({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} testID='icon'>
      <Image
        style={styles.image}
        source={{
          uri:
                        item.forumImg ||
                        'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
        }}
        testID='image'
      />
      <Text style={styles.text} testID='text'>{item.forumName}</Text>
    </TouchableOpacity>
  )
}

export default ForumIcon

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: 130 * Dimensions.get('window').width / 414,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'black'
  },
  text: {
    fontSize: 16,
    color: 'black'
  }
})
