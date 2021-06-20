import * as firebase from 'firebase'
import React, { useState } from 'react'
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import CancelButton from '../../components/CancelButton'
import SubmitButton from '../../components/SubmitButton'
import { textChecker } from '../../api/textChecker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const EditPostScreen = ({ navigation, route }) => {
  const { item } = route.params
  const [text, setText] = useState(item.post)
  const [image, setImage] = useState(item.postImg)

  const updatePost = async (navigator) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .update({
        post: text
      })
      .then(() => {
        console.log('Post updated!')
        Alert.alert(
          'Post updated',
          'Your post has been successfully updated!',
          [
            {
              text: 'OK',
              onPress: navigator
            }
          ],
          { cancelable: false }
        )
      })
      .catch((error) => {
        console.log(
          'Something went wrong when updating post to firestore.',
          error
        )
      })
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled
    >
      <Text style={styles.title}>Edit Your Post</Text>

      {image != null
        ? (
          <Image
            style={styles.image}
            source={{ uri: image }}
            resizeMode='contain'
          />
          )
        : null}

      <TextInput
        style={styles.input}
        onChangeText={(text) => setText(text)}
        value={text}
        multiline
      />

      <View style={styles.buttons}>
        <CancelButton goBack={() => navigation.goBack()} />
        <View style={styles.space} />
        <SubmitButton
          goBack={() => {
            textChecker(text)
              ? updatePost(() => navigation.goBack())
              : Alert.alert(
                'Cannot submit an empty post!',
                'Write something into the text box to post.'
              )
          }}
          string='Edit'
        />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default EditPostScreen

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row'
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    height: 60,
    lineHeight: 60,
    width: '100%',
    backgroundColor: '#ff8c00',
    color: '#ffffff',
    fontSize: 30,
    paddingLeft: 15,
    marginBottom: 10
  },
  image: {
    width: '100%',
    height: '50%',
    marginBottom: 15
  },
  input: {
    flex: 0,
    height: 400,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    fontSize: 18,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlignVertical: 'top'
  },
  buttons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  space: {
    width: 20
  },
  actionButton: {
    position: 'absolute',
    bottom: -300,
    right: -10
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  }
})
