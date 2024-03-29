import * as firebase from 'firebase'
import React, { useState } from 'react'
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native'
import CancelButton from '../../components/CancelButton'
import SubmitButton from '../../components/SubmitButton'
import { textChecker } from '../../api/textChecker'

const EditCommentScreen = ({ navigation, route }) => {
  const { comment } = route.params
  const [text, setText] = useState(comment.commentBody)

  const updatePost = async (navigator) => {
    firebase
      .firestore()
      .collection('posts')
      .doc(comment.overallCreator)
      .collection('userPosts')
      .doc(comment.postId)
      .collection('comments')
      .doc(comment.commentId)
      .update({
        text: text
      })
      .then(() => {
        console.log('Comment updated!')
        Alert.alert(
          'Comment updated',
          'Your comment has been successfully updated!',
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
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Edit Your Comment</Text>

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
                    'Cannot submit an empty comment!',
                    'Write something into the comment box to post.'
                  )
              }}
              string='Edit'
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default EditCommentScreen

const styles = StyleSheet.create({
  container: {
    flex: 0,
    //    alignItems: 'center',
    //    justifyContent: 'center',
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
    height: 100,
    width: '90%',
    margin: 12,
    borderWidth: 1,
    fontSize: 18,
    paddingLeft: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
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
