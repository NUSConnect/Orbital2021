import * as firebase from 'firebase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons, MaterialIcons } from 'react-native-vector-icons'
import {
  Card,
  Divider,
  Interaction,
  InteractionText,
  InteractionWrapper,
  PostText,
  PostTime,
  UserImg,
  UserInfo,
  UserInfoText,
  UserName
} from '../styles/FeedStyles'
import ProgressiveImage from './ProgressiveImage'
import DoubleTap from './DoubleTap'
import { sendPushNotification } from '../api/notifications'
import * as Haptics from 'expo-haptics'

const PostCard = ({
  route,
  item,
  onViewProfile,
  onDelete,
  onPress,
  onReport,
  onEdit
}) => {
  const currentUserId = firebase.auth().currentUser.uid
  const currentUserName = firebase.auth().currentUser.displayName
  const [vibrate, setVibrate] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [userData, setUserData] = useState(null)
  const [userLiked, setUserLiked] = useState(null)

  let commentText

  if (item.commentCount === 1) {
    commentText = '1 Comment'
  } else if (item.commentCount > 1) {
    commentText = item.commentCount + ' Comments'
  } else {
    commentText = 'Comment'
  }

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.userId)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
          if (typeof documentSnapshot.data().enableVibration !== 'undefined') {
            setVibrate(documentSnapshot.data().enableVibration)
          }
        }
      })
  }

  const getLikes = async () => {
    await firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .onSnapshot((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setLikeCount(documentSnapshot.data().likeCount)
        }
      })
  }

  const checkLiked = async () => {
    await firebase
      .firestore()
      .collection('posts')
      .doc(item.userId)
      .collection('userPosts')
      .doc(item.postId)
      .collection('likes')
      .doc(currentUserId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setUserLiked(true)
        } else {
          setUserLiked(false)
        }
      })
  }

  const likePost = async () => {
    console.log('Post ID: ' + item.postId)
    if (userLiked) {
      firebase
        .firestore()
        .collection('posts')
        .doc(item.userId)
        .collection('userPosts')
        .doc(item.postId)
        .collection('likes')
        .doc(currentUserId)
        .delete()
      firebase
        .firestore()
        .collection('posts')
        .doc(item.userId)
        .collection('userPosts')
        .doc(item.postId)
        .update({ likeCount: firebase.firestore.FieldValue.increment(-1) })
      console.log('Unlike')
      setUserLiked(false)
    } else {
      item.likeCount = item.likeCount + 1
      firebase
        .firestore()
        .collection('posts')
        .doc(item.userId)
        .collection('userPosts')
        .doc(item.postId)
        .collection('likes')
        .doc(currentUserId)
        .set({})
      firebase
        .firestore()
        .collection('posts')
        .doc(item.userId)
        .collection('userPosts')
        .doc(item.postId)
        .update({ likeCount: firebase.firestore.FieldValue.increment(1) })
      console.log('Like')
      setUserLiked(true)
      if (vibrate) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium) }

      if (item.userId !== currentUserId) {
        firebase.firestore().collection('users').doc(item.userId).get()
          .then((doc) => {
            console.log('Checking if pushToken available')
            if (doc.data().pushToken != null) {
              sendPushNotification(doc.data().pushToken.data, currentUserName, 'Liked your post!')
            }
          })
      }
    }
  }

  useEffect(() => {
    getUser()
    getLikes()
    checkLiked()
  }, [])

  return (
    <DoubleTap onDoubleTap={likePost}>
      <Card key={item.id}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => onViewProfile(currentUserId)}
            style={styles.user}
            testID='user'
          >
            <UserInfo>
              <UserImg
                source={{
                  uri: userData
                    ? userData.userImg ||
                                      'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=52e7df63-abdf-4197-9ad3-79d4be61af10'
                    : 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=52e7df63-abdf-4197-9ad3-79d4be61af10'
                }}
              />
              <UserInfoText>
                <UserName>
                  {userData
                    ? userData.name || 'Anonymous User'
                    : 'Anonymous User'}
                </UserName>
                <PostTime testID='time'>
                  {moment(item.postTime.toDate()).fromNow()}
                </PostTime>
              </UserInfoText>
            </UserInfo>
          </TouchableOpacity>
          {currentUserId === item.userId
            ? (
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.4}
                onPress={onEdit}
                testID='edit'
              >
                <MaterialIcons name='edit' size={25} />
              </TouchableOpacity>
              )
            : null}
        </View>
        <PostText testID='post'>{item.post}</PostText>
        {item.postImg != null
          ? (
            <ProgressiveImage
              defaultImageSource={require('../assets/default-img.jpg')}
              source={{ uri: item.postImg }}
              style={{ width: '100%', height: 350 }}
              resizeMode='contain'
              testID='image'
            />
            )
          : (
            <Divider />
            )}

        <InteractionWrapper>
          <Interaction onPress={likePost}>
            <Ionicons
              name={userLiked ? 'heart' : 'heart-outline'}
              size={25}
              color={userLiked ? '#dc143c' : '#333'}
            />
            <InteractionText testID='likes'>
              {likeCount === 0
                ? 'Like'
                : likeCount === 1
                  ? '1 Like'
                  : likeCount + ' Likes'}
            </InteractionText>
          </Interaction>
          <Interaction onPress={onPress} testID='commentPress'>
            <Ionicons name='md-chatbubble-outline' size={25} />
            <InteractionText testID='comments'>{commentText}</InteractionText>
          </Interaction>
          {currentUserId === item.userId
            ? (
              <Interaction onPress={() => onDelete(item.id)} testID='delete'>
                <Ionicons name='md-trash-bin' size={25} />
              </Interaction>
              )
            : (
              <Interaction onPress={() => onReport(item.id, item.userId)} testID='report'>
                <MaterialIcons name='report' size={25} />
              </Interaction>
              )}
        </InteractionWrapper>
      </Card>
    </DoubleTap>
  )
}

export default PostCard

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center'
  },
  user: {
    width: 360
  },
  button: {}
})
