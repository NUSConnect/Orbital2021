import * as firebase from 'firebase'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Divider } from 'react-native-paper'
import { Swipeable } from 'react-native-gesture-handler'
import MessageTopTab from '../../components/MessageTopTab'
import SearchBar from '../../components/SearchBar'
import {
  Card,
  PostTime,
  TextSection,
  UserImg,
  UserImgWrapper,
  UserInfo,
  UserInfoText,
  UserName
} from '../../styles/MessageStyles'

export default function MessagesScreen ({ navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [loading, setLoading] = useState(true)
  const [threads, setThreads] = useState([])
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(false)

  useEffect(() => {
    getThreads()
    toggleHaveNewMessage()
    const _unsubscribe = navigation.addListener('focus', () =>
      getThreads()
    )
    const backNav = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault()
      backNav()
      toggleHaveNewMessage()
      navigation.goBack()
    })

    return () => {
      _unsubscribe()
    }
  }, [])

  const toggleHaveNewMessage = () => {
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .update({ haveNewMessage: false })
  }

  const deletePressed = (item) => {
    console.log('Pressed')
    Alert.alert(
      'Are you sure?',
      "Chat will be deleted from your messages (You will leave the group if it's a group chat)",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => moveToDeleted(item)
        }
      ],
      { cancelable: false }
    )
  }

  const moveToDeleted = (item) => {
    console.log('Delete')
    if (item.isGroup) {
      console.log('group')
      firebase.firestore().collection('THREADS').doc(item.id).get()
        .then((docSnapshot) => {
          const { users } = docSnapshot.data()
          const updatedUsers = users.filter(x => x !== currentUserId)

          firebase.firestore().collection('THREADS').doc(item.id).update({ users: updatedUsers })
          firebase.firestore().collection('users').doc(currentUserId).collection('openChats').doc(item.id).delete()
        })
    } else {
      console.log('dm')
      firebase.firestore().collection('THREADS').doc(item.id).get()
        .then((querySnapshot) => {
          const lastSent = querySnapshot.data().latestMessage.createdAt

          firebase.firestore().collection('users').doc(currentUserId).collection('deletedChats').doc(item.id).set({ lastSent })
          firebase.firestore().collection('users').doc(currentUserId).collection('openChats').doc(item.id).delete()
        })
    }
    Alert.alert(
      'Success',
      'Chat deleted!',
      [
        {
          text: 'OK',
          onPress: () => getThreads()
        }
      ],
      { cancelable: false }
    )
  }

  const rightSwipe = (item) => (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    })
    return (
      <TouchableOpacity
        onPress={() => deletePressed(item)}
        activeOpacity={0.6}
      >
        <View style={styles.deleteBox}>
          <Animated.Text style={{ transform: [{ scale: scale }] }}>
            Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
    )
  }

  const matchUserToThreads = async (threads) => {
    for (let k = 0; k < threads.length; k++) {
      const threadId = threads[k].id

      let users
      let isGroup
      await firebase
        .firestore()
        .collection('THREADS')
        .doc(threadId)
        .get()
        .then((doc) => {
          users = doc.data().users
          threads[k].latest = doc.data().latestMessage.createdAt
          threads[k].message = doc.data().latestMessage.text
          isGroup = doc.data().group
        })

      if (isGroup) {
        await firebase
          .firestore()
          .collection('THREADS')
          .doc(threadId)
          .get()
          .then((doc) => {
            threads[k].name = doc.data().groupName.name
            threads[k].avatar = doc.data().groupImage
            threads[k].description =
                            doc.data().groupDescription.description
            threads[k].members = doc.data().users
            threads[k].isGroup = true
          })
      } else {
        for (let i = 0; i < users.length; i++) {
          if (users[i] !== currentUserId) {
            await firebase
              .firestore()
              .collection('users')
              .doc(users[i])
              .get()
              .then((doc) => {
                if (doc.exists) {
                  threads[k].name = doc.data().name
                  threads[k].avatar = doc.data().userImg
                  threads[k].otherId = users[i]
                } else {
                  threads[k].name = 'anon'
                  threads[k].avatar = null
                }
              })
          }
        }
      }
    }
    threads.sort((x, y) => {
      return y.latest - x.latest
    })
    setLoading(false)
    setThreads(threads)
  }

  const reopenThread = (id) => {
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('deletedChats')
      .doc(id)
      .delete()
    firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('openChats')
      .doc(id)
      .set({})
  }

  const checkIfNewMessage = async (deletedThreads, openThreads) => {
    // Reopen chat if new message received
    const reopenedThreads = []

    for (let i = 0; i < deletedThreads.length; i++) {
      const threadId = deletedThreads[i].id
      const lastSent = deletedThreads[i].lastSent
      await firebase
        .firestore()
        .collection('THREADS')
        .doc(threadId)
        .get()
        .then((doc) => {
          if (doc.data().latestMessage.createdAt > lastSent) {
            reopenedThreads.push({ id: doc.id })
            reopenThread(doc.id)
          }
        })
    }
    const allOpenThreads = reopenedThreads.concat(openThreads)
    matchUserToThreads(allOpenThreads)
  }

  const getThreads = async () => {
    // Get open threads
    const openThreads = []
    const deletedThreads = []
    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('openChats')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          openThreads.push({ id: doc.id })
        })
      })
    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('deletedChats')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          deletedThreads.push({
            id: doc.id,
            lastSent: doc.data().lastSent
          })
        })
      })

    if (deletedThreads.length >= 1) {
      checkIfNewMessage(deletedThreads, openThreads)
    } else {
      matchUserToThreads(openThreads)
    }
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = threads.filter(function (item) {
        const itemData = item.name
          ? item.name.toUpperCase()
          : ''.toUpperCase()
        const textData = text.toUpperCase()
        return itemData.indexOf(textData) > -1
      })
      setFiltered(true)
      setFilteredDataSource(newData)
      setSearch(text)
    } else {
      setFilteredDataSource(threads)
      setSearch(text)
    }
  }

  return (
    <View style={styles.container}>
      <MessageTopTab
        onBack={() => {
          navigation.goBack()
          toggleHaveNewMessage()
        }}
        onPress={() => navigation.navigate('StartMessagesScreen')}
      />
      {threads.length !== 0 && !loading
        ? (
          <View style={{ flex: 1 }}>
            <SearchBar
              search={search}
              setSearch={setSearch}
              searchFilterFunction={searchFilterFunction}
              resetFilter={() => setFilteredDataSource(threads)}
            />
            <FlatList
              data={filtered ? filteredDataSource : threads}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Divider />}
              renderItem={({ item }) => (
                <Swipeable renderRightActions={rightSwipe(item)}>
                  <Card
                    onPress={() =>
                      navigation.navigate('ChatScreen', {
                        thread: item
                      })}
                  >
                    <UserInfo>
                      <UserImgWrapper>
                        <UserImg source={{ uri: item.avatar }} />
                      </UserImgWrapper>
                      <TextSection>
                        <UserInfoText>
                          <UserName>{item.name}</UserName>
                          <PostTime>
                            {moment(item.latest).fromNow()}
                          </PostTime>
                        </UserInfoText>
                        <Text style={styles.text}>
                          {item.message}
                        </Text>
                      </TextSection>
                    </UserInfo>
                  </Card>
                </Swipeable>
              )}
            />
          </View>)
        : loading
          ? (
            <View style={styles.postMessage}>
              <ActivityIndicator size='large' color='#0000ff' />
            </View>
            )
          : (
            <View style={styles.postMessage}>
              <Text style={styles.postsDescription}>
                You have no open chats!{'\n'}Try messaging someone.
              </Text>
            </View>)}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  listTitle: {
    fontSize: 22
  },
  listDescription: {
    fontSize: 16
  },
  header: {
    fontSize: 35,
    textAlign: 'right',
    backgroundColor: '#ff8c00',
    padding: 10,
    color: '#ffffff'
  },
  text: {
    color: 'black',
    fontSize: 16
  },
  deleteBox: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 80
  },
  postMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%'
  },
  postsDescription: {
    fontSize: 18,
    color: 'darkslategrey',
    width: '90%',
    textAlign: 'center'
  }
})
