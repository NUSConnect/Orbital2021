import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  Dimensions,
  FlatList,
  StyleSheet
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ForumCommentItem from '../../components/ForumCommentItem'
import CreateComment from '../../components/CreateComment'
import ForumPost from '../../components/ForumPost'
import ForumPostHeader from '../../components/ForumPostHeader'
import { textChecker } from '../../api/textChecker'

const DeviceWidth = Dimensions.get('window').width

const ForumPostScreen = ({ navigation, route, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const [comments, setComments] = useState([])
  const [refreshing, setRefreshing] = useState(true)
  const [comment, setComment] = useState('')
  const [isFocused, setIsFocused] = useState(null)

  const { item, forumId, forumName } = route.params

  const fetchComments = async () => {
    const list = []
    setRefreshing(true)

    await firebase
      .firestore()
      .collection('forums')
      .doc(forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .collection('comments')
      .orderBy('postTime', 'desc')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { userId, postTime, commentBody } = doc.data()
          list.push({
            postId: item.postId,
            commentId: doc.id,
            userId,
            postTime: postTime,
            commentBody
          })
        })
      })

    if (refreshing) {
      setRefreshing(false)
    }

    setComments(list)
    console.log('Post comments: ', comments)
  }

  const onCommentSend = () => {
    firebase
      .firestore()
      .collection('forums')
      .doc(forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .collection('comments')
      .add({
        userId: currentUserId,
        postTime: firebase.firestore.Timestamp.fromDate(new Date()),
        commentBody: comment
      })
      .then(() => {
        console.log('Comment added')
        fetchComments()
        setRefreshing(false)
        setComment('')
      })

    item.commentCount = item.commentCount + 1
    firebase
      .firestore()
      .collection('forums')
      .doc(forumId)
      .collection('forumPosts')
      .doc(item.postId)
      .update({ commentCount: item.commentCount })
  }

  const navigateProfile = (creatorId, ownNavigation, otherNavigation) => {
    return (currUserId) => {
      console.log('Current User: ', currUserId)
      console.log('Creator User: ', creatorId)
      if (currUserId === creatorId) {
        ownNavigation()
      } else {
        otherNavigation()
      }
    }
  }

  const handleEdit = (comment, forumId) => {
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
          onPress: () => navigation.navigate('EditForumCommentScreen', { comment, forumId })
        }

      ],
      { cancelable: true }
    )
  }

  const handleDelete = (comment) => {
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
          onPress: () => deleteComment(comment)
        }
      ],
      { cancelable: false }
    )
  }

  const deleteComment = (comment) => {
    console.log('Current Comment Id: ', comment.commentId)

    firebase
      .firestore()
      .collection('forums')
      .doc(forumId)
      .collection('forumPosts')
      .doc(comment.postId)
      .collection('comments')
      .doc(comment.commentId)
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
      .collection('forums')
      .doc(forumId)
      .collection('forumPosts')
      .doc(comment.postId)
      .update({ commentCount: item.commentCount })
  }

  const handleReport = (comment) => {
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
            navigation.navigate('ReportForumCommentScreen', { comment: comment, post: item })
        }
      ],
      { cancelable: false }
    )
  }

  const handleEditPost = (post) => {
    Alert.alert(
      'Edit post',
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
            navigation.navigate('EditForumPostScreen', {
              post,
              forumId,
              goBack: () => navigation.pop(2)
            })
        }
      ],
      { cancelable: false }
    )
  }

  const handleDeletePost = (post) => {
    Alert.alert(
      'Delete post',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => deletePost(post)
        }
      ],
      { cancelable: false }
    )
  }

  const deletePost = (post) => {
    console.log('Current Post Id: ', post.postId)

    firebase
      .firestore()
      .collection('forums')
      .doc(forumId)
      .collection('forumPosts')
      .doc(post.postId)
      .delete()
      .then(() => {
        Alert.alert(
          'Post deleted',
          'Your post has been deleted successfully!'
        )
        navigation.goBack()
      })
      .catch((e) => console.log('Error deleting post.', e))
  }

  const handleReportPost = (post) => {
    Alert.alert(
      'Report Post',
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
            navigation.navigate('ReportForumPostScreen', { post: post })
        }
      ],
      { cancelable: false }
    )
  }

  const handleRefresh = () => {
    setRefreshing(false)
    fetchComments()
    setRefreshing(false)
  }

  useEffect(() => {
    fetchComments()
    const _unsubscribe = navigation.addListener('focus', () =>
      fetchComments()
    )

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
      <ForumPostHeader
        goBack={() => navigation.goBack()}
        title={forumName}
      />
      <FlatList
        data={comments}
        ListHeaderComponent={
          <ForumPost
            item={item}
            onViewProfile={navigateProfile(
              item.userId,
              () => navigation.navigate('Profile'),
              () =>
                navigation.navigate('ViewProfileScreen', {
                  item
                })
            )}
            onEdit={() => handleEditPost(item)}
            onDelete={() => handleDeletePost(item)}
            onReport={() => handleReportPost(item)}
          />
                }
        ListHeaderComponentStyle={styles.headerComponentStyle}
        renderItem={({ item }) => (
          <ForumCommentItem
            item={item}
            onViewProfile={navigateProfile(
              item.userId,
              () => navigation.navigate('Profile'),
              () =>
                navigation.navigate('ViewProfileScreen', {
                  item
                })
            )}
            onEdit={() => handleEdit(item, forumId)}
            onDelete={() => handleDelete(item)}
            onReport={() => handleReport(item)}
          />
        )}
        keyExtractor={(item) => item.commentId}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        style={{ width: '100%' }}
      />
      <CreateComment
        onPress={() => {
          if (textChecker(comment)) {
            onCommentSend()
          } else {
            Alert.alert(
              'Cannot submit an empty comment!',
              'Fill in comment body to post.'
            )
          }
        }}
        setComment={setComment}
        setIsFocused={setIsFocused}
        comment={comment}
        isFocused={isFocused}
      />
    </KeyboardAwareScrollView>
  )
}

export default ForumPostScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  headerComponentStyle: {
    marginVertical: 7
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
