import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { Alert, StyleSheet, Text, TouchableOpacity, View, PixelRatio } from 'react-native'
import { Card } from 'react-native-shadow-cards'
import { useNavigation } from '@react-navigation/native'

const titleFont = PixelRatio.get() <= 1.5 ? 16 : 22
const bodyFont = PixelRatio.get() <= 1.5 ? 14 : 16

const MatchCard = ({ item, onPress }) => {
  const currentUserId = firebase.auth().currentUser.uid
  const color = item.deleted ? 'darkgray' : item.success ? '#90EE90' : '#FF7F7F'
  const [otherName, setOtherName] = useState('')
  const [otherId, setOtherId] = useState('')
  const [otherBio, setOtherBio] = useState('')
  const [otherEmail, setOtherEmail] = useState('')
  const [otherCreatedAt, setOtherCreatedAt] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupImage, setGroupImage] = useState('')
  const [groupDescription, setGroupDescription] = useState('')
  const [groupMembers, setGroupMembers] = useState([])
  const [category, setCategory] = useState('')
  const navigation = useNavigation()

  const getCategory = async () => {
    if (item.groupChatThread !== undefined) {
      await setCategory('Match Me!')
    } else if (item.id.substring(0, 6) === 'Sports') {
      await setCategory('Sports')
    } else if (item.id.substring(0, 5) === 'Study') {
      await setCategory('Study')
    } else if (item.id.substring(0, 5) === 'Music') {
      await setCategory('Music')
    } else if (item.id.substring(0, 7) === 'For Fun') {
      await setCategory('For Fun')
    }
  }

  const getOtherName = async () => {
    if (item.isGroup || item.isGroup === undefined) {
      console.log('group or fail')
    } else {
      const otherId = item.users.filter(x => x !== currentUserId)[0]
      setOtherId(otherId)
      await firebase
        .firestore()
        .collection('users')
        .doc(otherId)
        .get()
        .then(documentSnapshot => {
          const { name, bio, email, createdAt } = documentSnapshot.data()
          setOtherName(name)
          setOtherBio(bio)
          setOtherEmail(email)
          setOtherCreatedAt(createdAt)
        })
    }
  }

  const getOtherGroup = async () => {
    await firebase
      .firestore()
      .collection('THREADS')
      .doc(item.groupChatThread)
      .get()
      .then(documentSnapshot => {
        setGroupName(documentSnapshot.data().groupName.name)
        setGroupImage(documentSnapshot.data().groupImage)
        setGroupDescription(documentSnapshot.data().groupDescription.description)
        setGroupMembers(documentSnapshot.data().users)
      })
  }

  const navigateGroupChat = () => {
    const chatObj = { id: item.groupChatThread, name: groupName, description: groupDescription, members: groupMembers, isGroup: true, groupImage: groupImage }
    navigation.navigate('ChatScreen', { thread: chatObj })
  }

  const navigateProfile = () => {
    const profileObj = { userId: otherId, name: otherName, bio: otherBio, email: otherEmail, createdAt: otherCreatedAt }
    navigation.navigate('ViewProfileScreen', { item: profileObj })
  }

  const onPressFn = () => {
    if (item.deleted) {
      Alert.alert('Deleted MatchMe Group', 'You have already left this MatchMe group')
    } else if (item.isGroup === undefined) {
      console.log('Failure')
      Alert.alert('Match failed!', 'Sorry, better luck next time :(')
    } else if (item.isGroup) {
      console.log('Group')
      navigateGroupChat()
    } else {
      console.log('Individual, go to view profile')
      navigateProfile()
    }
  }

  useEffect(() => {
    if (item.isGroup) {
      getOtherGroup()
    }
    getOtherName()
    getCategory()
  }, [])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressFn} activeOpacity={0.8} testID='pressable'>
        <Card style={{ padding: 10, margin: 10, backgroundColor: color, height: 100, borderRadius: 15 }}>
          <Text style={styles.title}>{item.deleted ? 'Deleted' : item.success ? 'Success!' : 'Sorry!'}</Text>
          {item.deleted
            ? <Text style={styles.info}>You have left your {category} group created on {item.timeMatched.toDate().toDateString()}</Text>
            : item.success
              ? item.isGroup
                  ? <Text style={styles.info}>{category} successfully completed on {item.timeMatched.toDate().toDateString()}! Tap here to chat with your new group!</Text>
                  : <Text style={styles.info}>{category} Match successfully completed on {item.timeMatched.toDate().toDateString()}! Tap here to check out {otherName}{'\'s profile!'}</Text>
              : <Text style={styles.info}>Match failed, better luck next time!</Text>}
        </Card>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 5
  },
  title: {
    fontSize: titleFont,
    color: '#000000',
    fontWeight: '600'
  },
  info: {
    fontSize: bodyFont,
    color: '#000000',
    fontWeight: '300'
  }
})

export default MatchCard
