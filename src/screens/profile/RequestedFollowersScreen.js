import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import SearchBar from '../../components/SearchBar'
import { sortByName } from '../../api/ranking'
import { Ionicons, Entypo } from 'react-native-vector-icons'
import { sendPushNotification } from '../../api/notifications'

export default function RequestedFollowersScreen ({ props, navigation, route }) {
  const currentUserId = firebase.auth().currentUser.uid
  const currentUserName = firebase.auth().currentUser.displayName
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  const getAllFollowing = async () => {
    const allRequestersId = []

    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .collection('followRequests')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id !== currentUserId) {
            allRequestersId.push(documentSnapshot.id)
          }
        })
      })
    console.log(allRequestersId)
    const users = []

    for (let i = 0; i < allRequestersId.length; i++) {
      const requesterId = allRequestersId[i]

      await firebase
        .firestore()
        .collection('users')
        .doc(requesterId)
        .get()
        .then(doc => {
          const { name, bio, email, createdAt } = doc.data()
          users.push({
            userId: doc.id,
            name,
            bio,
            email,
            createdAt: createdAt
          })
        })
    }
    users.sort(sortByName)
    setMasterDataSource(users)
    setLoading(false)
  }

  const acceptRequest = async (userId) => {
    setMasterDataSource(masterDataSource.filter(item => item.userId !== userId))
    setFilteredDataSource(filteredDataSource.filter(item => item.userId !== userId))

    firebase.firestore().collection('users').doc(currentUserId).collection('followRequests').doc(userId).delete()

    firebase.firestore().collection('users').doc(currentUserId).collection('followers').doc(userId).set({})
    firebase.firestore().collection('users').doc(userId).collection('following').doc(currentUserId).set({})

    firebase.firestore().collection('users').doc(userId).get()
      .then((doc) => {
        console.log('Checking if pushToken available')
        if (doc.data().pushToken != null) {
          sendPushNotification(doc.data().pushToken.data, currentUserName, 'accepted your follow request.')
        }
      })
  }

  const handleReject = (userId, userName) => {
    Alert.alert(
      'Remove request from ' + userName,
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => rejectRequest(userId)
        }
      ],
      { cancelable: false }
    )
  }

  const rejectRequest = async (userId) => {
    setMasterDataSource(masterDataSource.filter(item => item.userId !== userId))
    setFilteredDataSource(filteredDataSource.filter(item => item.userId !== userId))
    firebase.firestore().collection('users').doc(currentUserId).collection('followRequests').doc(userId).delete()
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
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
      setFilteredDataSource(masterDataSource)
      setSearch(text)
    }
  }

  const ItemView = ({ item }) => {
    return (
    // Flat List Item
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={styles.username}
          onPress={() => navigation.push('ViewProfileScreen', { item })}
        >
          {item.name}
        </Text>
        <TouchableOpacity
          style={styles.greenButton}
          onPress={() => acceptRequest(item.userId)}
        >
          <Ionicons
            name='checkmark-sharp'
            size={24}
            color='white'
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.redButton}
          onPress={() => handleReject(item.userId, item.name)}
        >
          <Entypo
            name='cross'
            size={24}
            color='white'
          />
        </TouchableOpacity>
        <View style={{ width: '2%' }} />
      </View>
    )
  }

  const ItemSeparatorView = () => {
    return (
    // Flat List Item Separator
      <View
        style={{
          height: 0.5,
          width: '100%',
          backgroundColor: '#C8C8C8'
        }}
      />
    )
  }

  useEffect(() => {
    getAllFollowing()
  }, [])

  if (loading) {
    return <ActivityIndicator />
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.subHeader}>
          <Ionicons
            name='chevron-back-outline'
            size={24}
            style={styles.icon}
            onPress={() => navigation.goBack()}
          />
          <Text style={{ fontSize: 18, alignItems: 'center' }}>
            Follow Requests
          </Text>
        </View>
        <SearchBar
          search={search}
          setSearch={setSearch}
          searchFilterFunction={searchFilterFunction}
          resetFilter={() => setFilteredDataSource(masterDataSource)}
        />
        <FlatList
          data={filtered ? filteredDataSource : masterDataSource}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={ItemSeparatorView}
          renderItem={ItemView}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  username: {
    padding: 10,
    fontSize: 20,
    width: '65%'
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 6
  },
  icon: {
    alignItems: 'center',
    marginLeft: 8,
    marginRight: 8,
    color: 'black'
  },
  greenButton: {
    alignItems: 'center',
    width: '15%',
    height: 38,
    backgroundColor: 'green',
    justifyContent: 'center',
    borderRadius: 10
  },
  redButton: {
    alignItems: 'center',
    width: '15%',
    height: 38,
    backgroundColor: 'red',
    justifyContent: 'center',
    borderRadius: 10
  }
})
