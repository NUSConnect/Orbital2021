import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import {
  Card,
  Divider,
  PostText,
  PostTime,
  UserImg,
  UserInfo,
  UserInfoText,
  UserName
} from '../styles/FeedStyles'
import moment from 'moment'
import { Ionicons } from 'react-native-vector-icons'
import ProgressiveImage from './ProgressiveImage'

const DeviceWidth = Dimensions.get('window').width

const UserCommentView = ({ route, item, navigation }) => {
  const postUserId = item.postId.substring(0, 28)
  const [postCreatorData, setPostCreatorData] = useState(null)
  const [postData, setPostData] = useState(null)
  const [commentData, setCommentData] = useState(null)
  const [commenterUserData, setCommenterUserData] = useState(null)

  const getCreator = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(postUserId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setPostCreatorData(documentSnapshot.data())
        }
      })
  }

  const getPost = async () => {
    await firebase.firestore().collection('posts').doc(postUserId).collection('userPosts').doc(item.postId).get()
      .then((documentSnapshot) => {
        setPostData(documentSnapshot.data())
      })
  }

  const getComment = async () => {
    await firebase.firestore()
      .collection('posts').doc(postUserId)
      .collection('userPosts').doc(item.postId)
      .collection('comments').doc(item.id)
      .get()
      .then((documentSnapshot) => {
        setCommentData(documentSnapshot.data())
        getCommenter(documentSnapshot.data().creator)
      })
  }

  const getCommenter = async (commenterId) => {
    await firebase
      .firestore()
      .collection('users')
      .doc(commenterId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setCommenterUserData(documentSnapshot.data())
        }
      })
  }

  useEffect(() => {
    getCreator()
    getPost()
    getComment()
  }, [])

  return (
    <View>
      <Text style={styles.reportId}>
        Comment ID: {item.id}
      </Text>
      <View
        style={{
          height: 2,
          width: DeviceWidth,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
      <View style={{ alignItems: 'center', width: '100%' }}>
        <Card key={item.id}>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={() => navigation.navigate('UnrestrictedViewProfileScreen', { itemId: postUserId })}
              style={styles.user}
              testID='user'
            >
              <UserInfo>
                <UserImg
                  source={{
                    uri: postCreatorData
                      ? postCreatorData.userImg ||
                                      'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
                      : 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
                  }}
                />
                <UserInfoText>
                  <UserName>
                    {postCreatorData
                      ? postCreatorData.name || 'Anonymous User'
                      : 'Anonymous User'}
                  </UserName>
                  <PostTime testID='time'>
                    {postData ? moment(postData.postTime.toDate()).fromNow() : ''}
                  </PostTime>
                </UserInfoText>
              </UserInfo>
            </TouchableOpacity>
          </View>
          <PostText testID='post'>{postData ? postData.post : ''}</PostText>
          {postData != null && postData.postImg != null
            ? (
              <ProgressiveImage
                defaultImageSource={require('../assets/default-img.jpg')}
                source={{ uri: postData.postImg }}
                style={{ width: '100%', height: 350 }}
                resizeMode='contain'
                testID='image'
              />
              )
            : (
              <Divider />
              )}

          <View style={styles.interactionWrapper}>
            <View style={styles.interactionWrapper}>
              <Ionicons
                name='heart-outline'
                size={25}
                color='#333'
              />
              <Text style={{ fontSize: 16 }}>
                {postData === null || postData.likeCount === 0
                  ? '0 Likes'
                  : postData.likeCount === 1
                    ? '1 Like'
                    : postData.likeCount + ' Likes'}
              </Text>
            </View>
          </View>
        </Card>
        <Text style={styles.reportedComment}>
          Reported Comment
        </Text>
        <View style={styles.commentContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
              <Text
                style={styles.username}
              >
                {commenterUserData
                  ? commenterUserData.name || 'Deleted User'
                  : 'Deleted User'}
              </Text>
              <Text style={styles.moments}>
                {' ·'} {commentData ? moment(commentData.postTime.toDate()).fromNow() : ''}
              </Text>
            </View>
            <View style={styles.headerRight} />
          </View>
          <Text style={styles.text}>
            {commentData ? commentData.text : ''}
          </Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CommentScreen', { item: postData })}
        >
          <Text style={styles.buttonText}>
            View Full Post
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UnrestrictedViewProfileScreen', { itemId: commentData.creator })}
        >
          <Text style={styles.buttonText}>
            View Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 2,
          width: DeviceWidth,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
      <Text style={styles.subHeader}>
        Reporters:
      </Text>
    </View>
  )
}

export default UserCommentView

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: DeviceWidth,
    alignItems: 'center'
  },
  user: {
    width: 360
  },
  interactionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginVertical: 10
  },
  button: {
    height: 50,
    width: '50%',
    backgroundColor: 'darkorange',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    fontSize: 18,
    color: 'white'
  },
  reportId: {
    fontSize: 18,
    color: 'crimson',
    paddingLeft: 10,
    margin: 6,
    width: DeviceWidth,
    flexWrap: 'wrap'
  },
  subHeader: {
    fontSize: 20,
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 10
  },
  reportedComment: {
    fontSize: 18,
    color: 'red',
    marginRight: DeviceWidth * 0.5
  },
  commentContainer: {
    backgroundColor: 'white',
    width: DeviceWidth * 0.95,
    marginBottom: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'red',
    padding: 4
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerRight: {},
  text: {
    fontSize: 16,
    padding: 5,
    color: 'black'
  },
  username: {
    fontSize: 16,
    color: 'blue'
  },
  moments: {
    fontSize: 14,
    color: 'gray'
  }
})
