import * as firebase from 'firebase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from 'react-native-vector-icons'
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
import { sendPushNotification } from '../api/notifications'

const PostCardView = ({
  route,
  item,
  onViewProfile
}) => {
  const currentUserId = firebase.auth().currentUser.uid
  const currentUserName = firebase.auth().currentUser.displayName
  const [userData, setUserData] = useState(null)
  const [userLiked, setUserLiked] = useState(null)

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          //          console.log('User Data', documentSnapshot.data());
          setUserData(documentSnapshot.data())
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
      item.likeCount = item.likeCount - 1
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
        .update({ likeCount: item.likeCount })
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
        .update({ likeCount: item.likeCount })
      console.log('Like')
      setUserLiked(true)
      firebase.firestore().collection('users').doc(item.userId).get()
        .then((doc) => {
          console.log('Checking if pushToken available')
          if (doc.data().pushToken != null) {
            sendPushNotification(doc.data().pushToken.data, currentUserName, 'Liked your post!')
          }
        })
    }
  }

  useEffect(() => {
    getUser()
    checkLiked()
  }, [])

  return (
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
                                      'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
                  : 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
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
          <InteractionText>
            {item.likeCount === 0
              ? 'Like'
              : item.likeCount === 1
                ? '1 Like'
                : item.likeCount + ' Likes'}
          </InteractionText>
        </Interaction>
      </InteractionWrapper>
    </Card>
  )
}

export default PostCardView

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
