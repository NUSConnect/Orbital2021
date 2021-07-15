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
import { Ionicons } from 'react-native-vector-icons'

export default function PromoteSuperAdminScreen ({ props, navigation, route }) {
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  const getAllUsers = async () => {
    const allUsersId = []

    await firebase
      .firestore()
      .collection('users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (!documentSnapshot.data().superAdmin && !documentSnapshot.data().news) {
            allUsersId.push(documentSnapshot.id)
          }
        })
      })
    console.log(allUsersId)
    const users = []

    for (let i = 0; i < allUsersId.length; i++) {
      const uid = allUsersId[i]

      await firebase
        .firestore()
        .collection('users')
        .doc(uid)
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

  const handlePromote = (userId, userName) => {
    Alert.alert(
      'Promote ' + userName,
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => promoteUser(userId, userName)
        }
      ],
      { cancelable: false }
    )
  }

  const promoteUser = async (userId, userName) => {
    setMasterDataSource(masterDataSource.filter(item => item.userId !== userId))
    setFilteredDataSource(filteredDataSource.filter(item => item.userId !== userId))
    firebase.firestore().collection('users').doc(userId).update({ superAdmin: true })
    Alert.alert('Success!', 'Successfully promoted ' + userName + ' to SuperAdmin!')
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
          style={styles.button}
          onPress={() => handlePromote(item.userId, item.name)}
        >
          <Text style={styles.buttonText}>
            Promote
          </Text>
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
    getAllUsers()
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
            Promote SuperAdmins
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
    width: '70%'
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
  button: {
    alignItems: 'center',
    width: '25%',
    height: 38,
    backgroundColor: 'green',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  }
})
