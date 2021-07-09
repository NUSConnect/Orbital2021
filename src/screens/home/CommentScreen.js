import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  Dimensions,
  StyleSheet,
  Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import TitleWithBack from '../../components/TitleWithBack'
import CommentItem from '../../components/CommentItem'
import CreateComment from '../../components/CreateComment'
import PostCardView from '../../components/PostCardView'
import { sortByLatest } from '../../api/ranking'
import { textChecker } from '../../api/textChecker'

const DeviceWidth = Dimensions.get('window').width

const CommentScreen = ({ navigation, route, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [refreshing, setRefreshing] = useState(true)
  const [isFocused, setIsFocused] = useState(null)

  const { item } = route.params
  const os = Platform.OS

  const fetchComments = async () => {
    const list = []
    setRefreshing(true)
    console.log('fetching comments...')

    await firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .collection('comments')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { creator, postTime, text } = doc.data()
          list.push({
            overallCreator: item.userId,
            postId: item.postId,
            commentId: doc.id,
            userId: creator,
            postTime: postTime,
            commentBody: text
          })
        })
      })

    list.sort(sortByLatest)
    setComments(list)
    console.log('Comments: ', comments)

    if (refreshing) {
      setRefreshing(false)
    }
  }

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .collection('comments')
      .add({
        creator: currentUserId,
        postTime: firebase.firestore.Timestamp.fromDate(new Date()),
        text
      })
      .then(() => {
        console.log('Comment added')
        Alert.alert(
          'Comment published!',
          'Your comment has been published successfully!'
        )
        fetchComments()
        setRefreshing(false)
        setText('')
      })

    item.commentCount = item.commentCount + 1
    firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .update({ commentCount: item.commentCount })
  }

  const onPressComment = (comment) => {
    if (currentUserId === comment.userId) {
      if (os === 'ios') {
        Alert.alert(
          'Your comment has been selected',
          'What do you want to do with it?',
          [
            {
              text: 'Edit',
              onPress: () => onPressEdit(comment)
            },
            {
              text: 'Delete',
              onPress: () => handleDelete(comment.commentId)
            },
            {
              text: 'Cancel',
              onPress: () => console.log('cancel pressed'),
              style: 'cancel'
            }
          ],
          { cancelable: true }
        )
      } else {
        Alert.alert(
          'Your comment has been selected',
          'What do you want to do with it?',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('cancel pressed'),
              style: 'cancel'
            },
            {
              text: 'Delete',
              onPress: () => handleDelete(comment.commentId)
            },
            {
              text: 'Edit',
              onPress: () => onPressEdit(comment)
            }
          ],
          { cancelable: true }
        )
      }
    } else {
      handleReport(comment, comment.userId)
    }
  }

  const onPressEdit = (comment) => {
    if (currentUserId === comment.userId) {
      Alert.alert(
        'Edit comment',
        'Are you sure?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('cancel pressed')
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('EditCommentScreen', { comment })
          }

        ],
        { cancelable: true }
      )
    }
  }

  const handleDelete = (commentId) => {
    Alert.alert(
      'Delete comment',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => deleteComment(commentId)
        }
      ],
      { cancelable: false }
    )
  }

  const deleteComment = (commentId) => {
    console.log('Current Comment Id: ', commentId)

    firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .collection('comments')
      .doc(commentId)
      .delete()
      .then(() => {
        Alert.alert(
          'Comment deleted',
          'Your comment has been deleted successfully!'
        )
        fetchComments()
        setRefreshing(false)
      })
      .catch((e) => console.log('Error deleting comment.', e))

    item.commentCount = item.commentCount - 1
    firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .update({ commentCount: item.commentCount })
  }

  const handleReport = (postId, userId) => {
    Alert.alert(
      'Report Comment',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () =>
            navigation.navigate('ReportCommentScreen', { comment: postId, userId: userId })
        }
      ],
      { cancelable: false }
    )
  }

  const navigateProfile = (creatorId, ownNavigation, otherNavigation) => {
    return (currUserId) => {
      if (currUserId === creatorId) {
        ownNavigation()
      } else {
        otherNavigation()
      }
    }
  }

  const handleRefresh = () => {
    setRefreshing(false)
    fetchComments()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchComments()
    const _unsubscribe = navigation.addListener('focus', () => fetchComments())

    return () => {
      _unsubscribe()
    }
  }, [])

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.inner}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={false}
      keyboardShouldPersistTaps='always'
    >
      <TitleWithBack onPress={() => navigation.goBack()} />
      <FlatList
        numColumns={1}
        horizontal={false}
        data={comments}
        ListHeaderComponent={
          <PostCardView
            item={item}
            onViewProfile={navigateProfile(
              item.userId,
              () => navigation.navigate('Profile'),
              () =>
                navigation.push('ViewProfileScreen', {
                  item
                })
            )}
          />
                }
        ListHeaderComponentStyle={styles.headerComponentStyle}
        renderItem={({ item }) => (
          <CommentItem
            item={item}
            onViewProfile={navigateProfile(
              item.userId,
              () => navigation.navigate('Profile'),
              () =>
                navigation.push('ViewProfileScreen', {
                  item
                })
            )}
            onPressHandle={() => onPressComment(item)}
          />
        )}
        keyExtractor={(item) => item.commentId}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        style={{ width: '100%', paddingBottom: 20 }}
      />

      <CreateComment
        onPress={() => {
          if (textChecker(text)) {
            onCommentSend()
          } else {
            Alert.alert(
              'Cannot submit an empty comment!',
              'Fill in comment body to post.'
            )
          }
        }}
        setComment={setText}
        setIsFocused={setIsFocused}
        comment={text}
        isFocused={isFocused}
      />
    </KeyboardAwareScrollView>
  )
}

export default CommentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  headerComponentStyle: {
    marginVertical: 0
  },
  inner: {
    flex: 1,
    width: '100%',
    maxWidth: DeviceWidth,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
