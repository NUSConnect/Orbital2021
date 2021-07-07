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
  const postUserId = item.postId.substring(0, 28)
  const [postCreatorData, setPostCreatorData] = useState(null)
  const [postData, setPostData] = useState(null)
  const [commentData, setCommentData] = useState(null)
  const [commenterUserData, setCommenterUserData] = useState(null)
  const reportedUid = item.userId

  const getUser = async () => {
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
    await firebase.firestore().collection('forums').doc(item.forumId).collection('forumPosts').doc(item.postId).get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setPostData(documentSnapshot.data())
        }
      })
  }

  const getComment = async () => {
    await firebase.firestore()
      .collection('forums').doc(item.forumId)
      .collection('forumPosts').doc(item.postId)
      .collection('comments').doc(item.id)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setCommentData(documentSnapshot.data())
        }
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
    getUser()
    getPost()
    getComment()
    getCommenter(reportedUid)
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
                  {postCreatorData
                    ? postCreatorData.name || 'Deleted User'
                    : 'Deleted User'}
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
              {postData ? postData.postBody : '---Deleted Post---'}
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
                  {commentData ? ' · ' + moment(commentData.postTime.toDate()).fromNow() : ''}
                </Text>
              </View>
              <View style={styles.headerRight} />
            </View>
            <Text style={styles.text}>
              {commentData ? commentData.commentBody : 'Deleted Comment'}
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('ForumPostScreen', { item: postData, forumId: item.forumId, forumName: 'Reported Comment' })}
          >
            <Text style={styles.buttonText}>
              View Full Post
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('UnrestrictedViewProfileScreen', { itemId: reportedUid })}
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
    padding: 6
  }
})
