import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native'
import PostCard from '../../components/PostCard'
import TitleWithBack from '../../components/TitleWithBack'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons } from 'react-native-vector-icons'

const ViewProfileScreen = ({ navigation, route, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const defaultUri =
        'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
  const [userData, setUserData] = useState(null)
  const [posts, setPosts] = useState([])
  const [following, setFollowing] = useState(false)
  const [refreshing, setRefreshing] = useState(true)
  const [majorData, setMajorData] = useState(null)
  const [images, setImages] = useState([{}])
  const [modalVisible, setModalVisible] = useState(false);

  const { item } = route.params

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.userId)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
          setMajorData(documentSnapshot.data().major)
          setImages([{ url: documentSnapshot.data().userImg, props: {} }])
        }
      })
  }

  const getFollowing = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('following')
      .doc(item.userId)
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
        .doc(item.userId)
        .delete()
      setFollowing(false)
    } else {
      firebase
        .firestore()
        .collection('users')
        .doc(currentUserId)
        .collection('following')
        .doc(item.userId)
        .set({})
      setFollowing(true)
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
    const list = [currentUserId, item.userId]
    const threadID = concatList(list)
    const threadObj = { id: threadID, name: userData.name, otherId: item.userId }
    navigation.navigate('ChatScreen', { thread: threadObj })
  }

  const fetchUserPosts = async () => {
    try {
      const allPosts = []
      setRefreshing(true)

      await firebase
        .firestore()
        .collection('posts')
        .doc(item.userId)
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
      }

      //        console.log('Posts: ', posts);
    } catch (e) {
      console.log(e)
    }
  }

  const handlePostsReport = (postId) => {
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
            Alert.alert(
              'Post Reported!',
              'This post has been reported successfully!'
            )
        }
      ],
      { cancelable: false }
    )
  }

  const renderHeader = () => {
    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name='close-sharp' size={38} color={'white'} />
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
    console.log(item)
    getUser()
    getFollowing()
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
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
            statusBarTranslucent={true}
            transparent={true}
        >
                <ImageViewer
                    imageUrls={images}
                    renderHeader={renderHeader}
                />
        </Modal>
        <View style={styles.profileInfo}>
          <Text style={styles.name}>
            {' '}
            {userData ? userData.name : 'Anonymous User'}{' '}
          </Text>
          <Text style={styles.userInfo}>
            {' '}
            Major: {majorData || 'Undeclared'}{' '}
          </Text>
          <Text style={styles.userInfo}>
            {' '}
            {userData ? userData.bio : '.'}{' '}
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={follow}
            >
              <Text style={styles.text}>
                {following ? 'Unfollow' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <View style={styles.space} />
            <TouchableOpacity
              style={styles.button}
              onPress={message}
            >
              <Text style={styles.text}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
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
              navigation.navigate('CommentScreen', { item })}
          />
        )}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ItemSeparator}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        style={{ width: '100%', paddingBottom: 200 }}
      />
    </SafeAreaView>
  )
}

export default ViewProfileScreen

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80
  },
  profileContainer: {
    backgroundColor: '#DCDCDC',
    width: '100%',
    height: 130,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  profileInfo: {},
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
    margin: 5
  },
  name: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '600',
    paddingTop: 10
  },
  userInfo: {
    fontSize: 14,
    color: '#778899',
    fontWeight: '600',
    flexWrap: 'wrap',
    paddingLeft: 4,
    width: 280
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingLeft: 10,
    width: '95%'
  },
  button: {
    height: 40,
    backgroundColor: '#87cefa',
    borderRadius: 20,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  space: {
    width: 20
  },
  text: {
    fontSize: 16,
    color: 'white'
  },
  closeButton: {
    paddingLeft: 10,
    paddingTop: 50
  }
})
