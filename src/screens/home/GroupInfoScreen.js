import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal
} from 'react-native'
import TitleWithBack from '../../components/TitleWithBack'
import {
  Card, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName
} from '../../styles/MessageStyles'
import { sortByName } from '../../api/ranking'
import ImageViewer from 'react-native-image-zoom-viewer'
import { Ionicons, MaterialIcons } from 'react-native-vector-icons'

const GroupInfoScreen = ({ navigation, route, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const [groupInfo, setGroupInfo] = useState(null)
  const [members, setMembers] = useState([])
  const [images, setImages] = useState([{}])
  const [modalVisible, setModalVisible] = useState(false)

  const { item } = route.params

  const getGroupInfo = async () => {
    await firebase.firestore().collection('THREADS').doc(item.id).get()
      .then((doc) => {
        setGroupInfo(doc.data())
        setImages([{ url: doc.data().groupImage, props: {} }])
      })
  }

  const getMembers = async () => {
    let users = []

    await firebase.firestore().collection('THREADS').doc(item.id).get()
      .then((doc) => {
        users = doc.data().users
      })

    const list = []
    for (const memberId of users) {
      await firebase.firestore().collection('users').doc(memberId).get()
        .then((doc) => {
          const { name, userImg, bio } = doc.data()
          list.push({ userId: doc.id, name, userImg, bio })
        })
    }
    list.sort(sortByName)
    setMembers(list)
  }

  const viewProfile = (user) => {
    if (user.userId === currentUserId) {
      navigation.navigate('Profile')
    } else {
      navigation.navigate('ViewProfileScreen', { item: user })
    }
  }

  const renderHeader = () => {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
          <Ionicons name='close-sharp' size={38} color='white' />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false)
            navigation.navigate('EditGroupScreen', {
              item:
                      { id: item.id, name: groupInfo.groupName.name, description: groupInfo.groupDescription.description, avatar: groupInfo.groupImage }
            })
          }}
          style={styles.editButton}
        >
          <Ionicons name='pencil-sharp' size={38} color='white' />
        </TouchableOpacity>
      </View>
    )
  }

  useEffect(() => {
    getGroupInfo()
    getMembers()
    const _unsubscribe = navigation.addListener('focus', () => {
      getGroupInfo()
      getMembers()
    })

    return () => {
      _unsubscribe()
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <TitleWithBack onPress={() => navigation.goBack()} />
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image
            source={{
              uri: groupInfo ? groupInfo.groupImage : null
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
            {' '}
            {groupInfo ? groupInfo.groupName.name : null}{' '}
          </Text>
          <Text style={styles.userInfo}>
            {' '}
            Description: {groupInfo ? groupInfo.groupDescription.description : null}{' '}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('EditGroupScreen', {
                item:
                { id: item.id, name: groupInfo.groupName.name, description: groupInfo.groupDescription.description, avatar: groupInfo.groupImage }
              })}
            >
              <Text style={styles.text}>Edit Group</Text>
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
        data={members}
        ListHeaderComponent={
          <View style={{ width: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={styles.memberHeader}>
                Members
              </Text>
              <TouchableOpacity
                style={styles.editIcon}
                onPress={() => navigation.navigate('EditGroupMembersScreen', { threadId: item.id, name: groupInfo.groupName.name })}
              >
                <MaterialIcons name='edit' size={26} color='black' />
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
          </View>
                }
        ListHeaderComponentStyle={styles.headerComponentStyle}
        renderItem={({ item }) => (
          <Card
            onPress={() => viewProfile(item)}
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={{ uri: item.userImg || 'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=52e7df63-abdf-4197-9ad3-79d4be61af10' }} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.name}</UserName>
                </UserInfoText>
                <Text style={styles.bio}>{item.bio}</Text>
              </TextSection>
            </UserInfo>
          </Card>

        )}
        keyExtractor={(item) => item.userId}
        style={{ width: '100%', marginBottom: 40 }}
      />
    </SafeAreaView>
  )
}

export default GroupInfoScreen

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
  memberHeader: {
    fontSize: 20,
    paddingLeft: 10,
    height: 50,
    paddingVertical: 10
  },
  text: {
    fontSize: 16,
    color: 'white'
  },
  bio: {
    fontSize: 16,
    color: 'black'
  },
  closeButton: {
    paddingLeft: 10,
    paddingTop: 50
  },
  editButton: {
    paddingTop: 50,
    paddingRight: 6
  },
  editIcon: {
    marginRight: 25
  }
})
