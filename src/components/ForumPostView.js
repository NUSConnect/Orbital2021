import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import moment from 'moment'

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
    await firebase.firestore().collection('forums').doc(item.forumId).collection('forumPosts').doc(item.id).get()
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
            width: DeviceWidth * 0.9,
            backgroundColor: 'rgba(0,0,0,0.5)',
            marginLeft: 10,
            marginRight: 10
          }}
        />
        <View style={styles.container}>
          <View style={styles.postContainer}>
            <View style={styles.headerContainer}>
              <View style={styles.headerLeft}>
                <Text style={styles.regularFont}>{'Posted by '}</Text>
                <Text
                  style={styles.username}
                >
                  {userData
                    ? userData.name || 'Anonymous User'
                    : 'Anonymous User'}
                </Text>
                <Text style={styles.regularFont} testID='time'>
                  {' ·'} {postData ? moment(postData.postTime.toDate()).fromNow() : ''}
                </Text>
              </View>
              <View style={styles.headerRight} />
            </View>

            <Text style={styles.title}>
              {postData ? postData.postTitle : ''}
            </Text>
            <Text style={styles.text}>
              {postData ? postData.postBody : ''}
            </Text>

            <View style={styles.bottomContainer}>
              <Text style={styles.descriptionText}>
                {postData
                  ? postData.votes === 1
                      ? postData.votes + ' Vote'
                      : postData.votes + ' Votes'
                  : ''}
              </Text>
              <Text style={styles.descriptionText}>
                {postData
                  ? postData.commentCount === 1
                      ? postData.commentCount + ' Comment'
                      : postData.commentCount + ' Comments'
                  : ''}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ForumPostScreen', { item: postData, forumId: item.forumId, forumName: 'Reported Post' })}
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
            width: DeviceWidth * 0.9,
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
    width: DeviceWidth,
    backgroundColor: '#DCDCDC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    marginVertical: 10
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
  },
  postContainer: {
    backgroundColor: 'white',
    width: DeviceWidth * 0.98,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'black'
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: 10
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerRight: {},
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.5,
    marginLeft: DeviceWidth * 0.25
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingLeft: 10
  },
  text: {
    fontSize: 16,
    paddingLeft: 10,
    paddingRight: 15
  },
  descriptionText: {
    fontSize: 16,
    color: 'black'
  },
  regularFont: {
    fontSize: 14
  },
  username: {
    fontSize: 14,
    color: 'blue'
  }
})
