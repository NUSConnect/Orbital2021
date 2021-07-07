import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons } from 'react-native-vector-icons'

const DeviceWidth = Dimensions.get('window').width

const ProfileView = ({ route, item, navigation }) => {
  const defaultUri =
        'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=8050b8f8-493f-4e12-8fe3-6f44bb544460'
  const [userData, setUserData] = useState(null)
  const [majorData, setMajorData] = useState(null)
  const [images, setImages] = useState([{}])
  const [modalVisible, setModalVisible] = useState(false)
  const [followers, setFollowers] = useState(0)
  const [followingPeople, setFollowingPeople] = useState(0)

  const getUser = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.id)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data())
          setMajorData(documentSnapshot.data().major)
          setImages([{ url: documentSnapshot.data().userImg, props: {} }])
        }
      })
  }

  const getFollowingPeople = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.id)
      .collection('following')
      .onSnapshot(querySnapshot => {
        setFollowingPeople(querySnapshot.size - 1)
      })
  }

  const getFollowers = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(item.id)
      .collection('followers')
      .onSnapshot(querySnapshot => {
        setFollowers(querySnapshot.size)
      })
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

  useEffect(() => {
    getUser()
    getFollowers()
    getFollowingPeople()
  }, [])

  return (
    <View>
      <Text style={styles.reportId}>
        User ID: {item.id}
      </Text>
      <View
        style={{
          height: 2,
          backgroundColor: 'rgba(0,0,0,0.5)',
          marginLeft: 10,
          marginRight: 10
        }}
      />
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
          <Text style={styles.userInfo}>
            Major: {majorData || 'Undeclared'}{' '}
          </Text>
          <Text style={styles.userInfo}>
            {userData ? userData.bio : '.'}
          </Text>
          <View style={styles.following}>
            <Text style={styles.followerInfo}>
              {followers} {followers === 1 ? 'Follower' : 'Followers'}
            </Text>
            <Text style={styles.followingInfo}>
              {followingPeople} Following
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('UnrestrictedViewProfileScreen', { itemId: item.id })}
        >
          <Text style={styles.buttonText}>
            View Full Profile
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: 2,
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

export default ProfileView

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: DeviceWidth,
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
    margin: 10
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
    fontSize: 16,
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
  reportId: {
    fontSize: 18,
    color: 'crimson',
    width: DeviceWidth,
    paddingLeft: 10,
    margin: 6,
    flexWrap: 'wrap'
  },
  subHeader: {
    fontSize: 20,
    paddingLeft: 20,
    marginTop: 10,
    marginBottom: 10
  }
})
