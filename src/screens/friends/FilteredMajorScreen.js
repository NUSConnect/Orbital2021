import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { Ionicons } from 'react-native-vector-icons'
import SearchBar from '../../components/SearchBar'
import { sortByName } from '../../api/ranking'

export default function FilteredMajorScreen ({
  props,
  navigation,
  route,
  goBack
}) {
  const currentUserId = firebase.auth().currentUser.uid
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  const majorToFilter = route.params.major

  const getAllUsers = async () => {
    const users = []

    await firebase
      .firestore()
      .collection('users')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { name, bio, email, createdAt, major } =
                        doc.data()
          if (major === majorToFilter) {
            users.push({
              userId: doc.id,
              name,
              bio,
              email,
              createdAt: createdAt
            })
          }
        })
      })
    users.sort(sortByName)
    setMasterDataSource(users)
    setLoading(false)
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
      <Text
        style={styles.itemStyle}
        onPress={() =>
          currentUserId === item.userId
            ? navigation.navigate('Profile')
            : navigation.navigate('ViewProfileScreen', { item })}
      >
        {item.name}
      </Text>
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
            {majorToFilter}
          </Text>
        </View>
        {masterDataSource.length !== 0
          ? (
            <View style={{ flex: 1 }}>
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
            </View>)
          : (
            <View style={styles.postMessage}>
              <Text style={styles.postsDescription}>
                There{'\'s'} no one here!{'\n'}Try looking for another major.
              </Text>
            </View>)}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1
  },
  itemStyle: {
    padding: 10,
    fontSize: 20
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
  postMessage: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '50%'
  },
  postsDescription: {
    fontSize: 18,
    color: 'darkslategrey',
    width: '90%'
  }
})
