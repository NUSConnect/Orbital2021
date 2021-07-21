import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  PixelRatio
} from 'react-native'
import PostCard from '../../../components/PostCard'
import TitleWithBack from '../../../components/TitleWithBack'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons, MaterialIcons } from 'react-native-vector-icons'
import { sendPushNotification } from '../../../api/notifications'

const DeviceWidth = Dimensions.get('window').width
const followingFont = PixelRatio.get() <= 1.5 ? 12 : 16

// For Admins only: ignores privacy of user => To be used for managing user reports ONLY

const UnrestrictedViewProfileScreen = ({ navigation, route, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const currentUserName = firebase.auth().currentUser.displayName
  const defaultUri =
        'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
  const [name, setName] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isPrivate, setIsPrivate] = useState(false)
  const [isNewsAccount, setIsNewsAccount] = useState(false)
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState(false)
  const [requested, setRequested] = useState(false)
  const [refreshing, setRefreshing] = useState(true)
  const [loading, setLoading] = useState(true)
  const [majorData, setMajorData] = useState(null)
  const [images, setImages] = useState([{}])
  const [modalVisible, setModalVisible] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [followingPeople, setFollowingPeople] = useState(0)

  const { itemId } = route.params

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(itemId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setName(documentSnapshot.data().name)
          setUserData(documentSnapshot.data())
          setMajorData(documentSnapshot.data().major)
          setImages([{ url: documentSnapshot.data().userImg, props: {} }])
          if (documentSnapshot.data().isPrivate !== null) {
            setIsPrivate(documentSnapshot.data().isPrivate)
          }
          if (documentSnapshot.data().news !== null) {
            setIsNewsAccount(documentSnapshot.data().news)
          }
        }
      })
  }

  const getFollowingPeople = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(itemId)
      .collection('following')
      .onSnapshot(querySnapshot => {
        setFollowingPeople(querySnapshot.size - 1)
      })
  }

  const getFollowers = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(itemId)
      .collection('followers')
      .onSnapshot(querySnapshot => {
        setFollowers(querySnapshot.size)
      })
  }

  const getFollowing = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('following')
      .doc(itemId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setFollowing(true)
        } else {
          setFollowing(false)
        }
      })
  }

  const follow = async () => {
    if (following) {
      firebase
        .firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('following')
        .doc(itemId)
        .delete()
      firebase
        .firestore()
        .collection('users')
        .doc(itemId)
        .collection('followers')
        .doc(currentUserId)
        .delete()
      setFollowing(false)
    } else if (requested) {
      firebase
        .firestore()
        .collection('users')
        .doc(itemId)
        .collection('followRequests')
        .doc(currentUserId)
        .delete()
      setRequested(false)
    } else {
      if (isPrivate) {
        firebase
          .firestore()
          .collection('users')
          .doc(itemId)
          .collection('followRequests')
          .doc(currentUserId)
          .set({})
        setRequested(true)

        firebase.firestore().collection('users').doc(itemId).get()
          .then((doc) => {
            console.log('Checking if pushToken available')
            if (doc.data().pushToken != null) {
              sendPushNotification(doc.data().pushToken.data, currentUserName, 'requested to follow you!')
            }
          })
      } else {
        firebase
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .collection('following')
          .doc(itemId)
          .set({})
        firebase
          .firestore()
          .collection('users')
          .doc(itemId)
          .collection('followers')
          .doc(currentUserId)
          .set({})
        setFollowing(true)

        firebase.firestore().collection('users').doc(itemId).get()
          .then((doc) => {
            console.log('Checking if pushToken available')
            if (doc.data().pushToken != null) {
              sendPushNotification(doc.data().pushToken.data, currentUserName, 'is now following you!')
            }
          })
      }
    }
  }

  const concatList = (list) => {
    let str = ''
    list.sort()
    for (let i = 0; i < list.length; i++) {
      str = str + list[i].substring(0, 6)
    }
    return str
  }

  const message = async () => {
    const list = [currentUserId, itemId]
    const threadID = concatList(list)
    const threadObj = { id: threadID, name: userData.name, otherId: itemId }
    navigation.push('ChatScreen', { thread: threadObj })
  }

  const fetchUserPosts = async () => {
    try {
      const allPosts = []
      setRefreshing(true)

      await firebase
        .firestore()
        .collection('posts')
        .doc(itemId)
        .collection('userPosts')
        .orderBy('postTime', 'desc')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const {
              userId,
              postId,
              post,
              postImg,
              postTime,
              likeCount,
              commentCount
            } = doc.data()
            allPosts.push({
              id: doc.id,
              userId,
              userName: 'Test Name',
              userImg:
                                'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
              postId,
              postTime: postTime,
              post,
              postImg,
              likeCount,
              commentCount
            })
          })
        })

      setPosts(allPosts)

      if (refreshing) {
        setRefreshing(false)
        setLoading(false)
      }

      //        console.log('Posts: ', posts);
    } catch (e) {
      console.log(e)
    }
  }

  const handlePostsReport = (postId, userId) => {
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
            navigation.navigate('ReportPostScreen', { postId: postId, userId: userId })
        }
      ],
      { cancelable: false }
    )
  }

  const profileReport = () => {
    Alert.alert(
      'Report User',
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
            navigation.navigate('ReportUserScreen', { userId: itemId })
        }
      ],
      { cancelable: false }
    )
  }
  const renderHeader = () => {
    return (
      <View>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
          <Ionicons name='close-sharp' size={38} color='white' />
        </TouchableOpacity>
      </View>
    )
  }

  const ItemSeparator = () => (
    <View
      style={{
        height: 2,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginLeft: 10,
        marginRight: 10
      }}
    />
  )

  const handleRefresh = () => {
    setRefreshing(false)
    fetchUserPosts()
    setRefreshing(false)
  }

  useEffect(() => {
    getUser()
    getFollowing()
    getFollowers()
    getFollowingPeople()
    fetchUserPosts()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TitleWithBack onPress={() => navigation.goBack()} />
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{
              uri: userData
                ? userData.userImg || defaultUri
                : defaultUri
            }}
            style={styles.profilePic}
          />
        </TouchableOpacity>
        <Modal
          visible={modalVisible}
          transparent
          onRequestClose={() => setModalVisible(false)}
          statusBarTranslucent
        >
          <ImageViewer
            imageUrls={images}
            renderHeader={renderHeader}
          />
        </Modal>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {userData ? userData.name : 'Anonymous User'}{' '}
          </Text>
          {!isNewsAccount
            ? (
              <Text style={styles.userInfo}>
                Major: {majorData || 'Undeclared'}{' '}
              </Text>
              )
            : null}
          <Text style={styles.userInfo}>
            {userData ? userData.bio : '.'}
          </Text>
          {!isNewsAccount
            ? (
              <View style={styles.following}>
                <Text style={styles.followerInfo} onPress={() => navigation.push('FollowersScreen', { userId: itemId, username: name })}>
                  {followers} {followers === 1 ? 'Follower' : 'Followers'}
                </Text>
                <Text style={styles.followingInfo} onPress={() => navigation.push('FollowingScreen', { userId: itemId, username: name })}>
                  {followingPeople} Following
                </Text>
              </View>
              )
            : null}
        </View>
      </View>
      {!isNewsAccount && currentUserId !== itemId
        ? (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={follow}
            >
              <Text style={styles.text}>
                {following ? 'Unfollow' : requested ? 'Requested' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={message}
            >
              <Text style={styles.text}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={profileReport}
            >
              <MaterialIcons
                name='report'
                size={20}
                color='white'
              />
            </TouchableOpacity>
          </View>
          )
        : null}
      {posts.length !== 0 && !loading
        ? (
          <FlatList
            numColumns={1}
            horizontal={false}
            data={posts}
            renderItem={({ item }) => (
              <PostCard
                item={item}
                onReport={handlePostsReport}
                onViewProfile={x => x}
                onPress={() =>
                  navigation.push('CommentScreen', { item })}
              />
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ItemSeparator}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            style={{ width: '100%', paddingBottom: 200 }}
          />
          )
        : loading
          ? (
            <View style={styles.postMessage}>
              <ActivityIndicator size='large' color='#0000ff' />
            </View>
            )
          : (
            <View style={styles.postMessage}>
              <Text style={styles.postsDescription}>
                User has no posts.
              </Text>
            </View>
            )}
    </SafeAreaView>
  )
}

export default UnrestrictedViewProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 100
  },
  profileContainer: {
    backgroundColor: '#DCDCDC',
    width: '100%',
    height: DeviceWidth * 0.25 + 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  profileInfo: {},
  profilePic: {
    width: DeviceWidth * 0.25,
    height: DeviceWidth * 0.25,
    borderRadius: DeviceWidth * 0.15,
    borderWidth: 4,
    borderColor: 'white',
    margin: 5
  },
  name: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    paddingTop: 10,
    paddingLeft: 4
  },
  userInfo: {
    fontSize: 14,
    color: '#778899',
    fontWeight: '600',
    flexWrap: 'wrap',
    paddingLeft: 4,
    width: DeviceWidth * 0.75 - 10
  },
  buttonContainer: {
    backgroundColor: '#DCDCDC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: 10
  },
  button: {
    height: 40,
    width: '38%',
    backgroundColor: '#87cefa',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  smallButton: {
    height: 40,
    width: '15%',
    backgroundColor: '#87cefa',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  space: {
    width: 20
  },
  text: {
    fontSize: 18,
    color: 'white'
  },
  closeButton: {
    paddingLeft: 10,
    paddingTop: 50
  },
  following: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: DeviceWidth * 0.75 - 5,
    paddingLeft: '10%',
    paddingRight: '20%'
  },
  followerInfo: {
    fontSize: followingFont,
    color: 'darkslategrey',
    fontWeight: '600',
    flexWrap: 'wrap',
    paddingLeft: 4
  },
  followingInfo: {
    fontSize: 16,
    color: 'darkslategrey',
    fontWeight: '600',
    flexWrap: 'wrap'
  },
  postMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '30%'
  },
  postsDescription: {
    fontSize: 18,
    color: 'darkslategrey',
    width: '90%'
  }
})
