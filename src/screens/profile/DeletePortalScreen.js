import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert
} from 'react-native'
import SearchBar from '../../components/SearchBar'
import { sortByName } from '../../api/ranking'
import { Ionicons } from 'react-native-vector-icons'

export default function DeletePortalScreen ({ props, navigation, route }) {
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  const getAllForums = async () => {
    const forums = []

    await firebase
      .firestore()
      .collection('forums')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { forumImg, forumName } = doc.data()
          forums.push({
            id: doc.id,
            forumImg,
            forumName
          })
        })
      })
    forums.sort(sortByName)
    setMasterDataSource(forums)
    setLoading(false)
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.forumName
          ? item.forumName.toUpperCase()
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

  const deleteForum = async (item) => {
    await firebase.firestore().collection('forums').doc(item.id).collection('subscribers').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          firebase.firestore().collection('users').doc(doc.id).collection('subscribedForums').doc(item.id).delete()
        })
      })

    await firebase.firestore().collection('forums').doc(item.id).collection('admins').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          firebase.firestore().collection('users').doc(doc.id).collection('forumAdmin').doc(item.id).delete()
            .then(() => {
              firebase.firestore().collection('users').doc(doc.id).collection('forumAdmin').get()
                .then((querySnapshot) => {
                  if (querySnapshot.size === 0) {
                    firebase.firestore().collection('users').doc(doc.id).update({ forumAdmin: false })
                  }
                })
            })
        })
      })

    await firebase.firestore().collection('forums').doc(item.id).delete()

    Alert.alert('Success!', 'Forum has been successfully deleted.')
    setMasterDataSource(masterDataSource.filter(forum => forum.id !== item.id))
    setFilteredDataSource(filteredDataSource.filter(forum => forum.id !== item.id))
  }

  const handleDeleteForum = async (item) => {
    Alert.alert('Delete ' + item.forumName,
      'Are you sure? This action cannot be reversed.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => deleteForum(item)
        }
      ],
      { cancelable: false }
    )
  }

  const ItemView = ({ item }) => {
    return (
    // Flat List Item
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text
          style={styles.username}
          onPress={() => navigation.push('SubForumScreen', { item })}
        >
          {item.forumName}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleDeleteForum(item)}
        >
          <Text style={styles.buttonText}>
            Delete
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
    getAllForums()
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
            Delete a Portal
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
    backgroundColor: 'red',
    justifyContent: 'center',
    borderRadius: 10
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  }
})
