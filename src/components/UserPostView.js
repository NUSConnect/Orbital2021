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

const UserPostView = ({ route, item, navigation }) => {
  const userId = item.id.substring(0, 28)
  const [userData, setUserData] = useState(null)
  const [postData, setPostData] = useState(null)

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
        }
      })
  }

  const getPost = async () => {
    await firebase.firestore().collection('posts').doc(userId).collection('userPosts').doc(item.id).get()
      .then((documentSnapshot) => {
        setPostData(documentSnapshot.data())
      })
  }

  useEffect(() => {
    getUser()
    getPost()
  }, [])

  return (
    <View>
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.reportId}>
          Post ID: {item.id}
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
        <Card key={item.id}>
          <View style={styles.container}>
            <View
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
                    {postData ? moment(postData.postTime.toDate()).fromNow() : ''}
                  </PostTime>
                </UserInfoText>
              </UserInfo>
            </View>
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
            onPress={() => navigation.navigate('UnrestrictedViewProfileScreen', { itemId: userId })}
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
      </View>
      <Text style={styles.subHeader}>
        Reporters:
      </Text>
    </View>
  )
}

export default UserPostView

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
    flexWrap: 'wrap',
    width: DeviceWidth
  },
  subHeader: {
    fontSize: 20,
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 10
  }
})
