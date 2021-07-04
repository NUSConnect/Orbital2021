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
import SearchBar from '../../components/SearchBar'
import { sortByName } from '../../api/ranking'
import { Ionicons } from 'react-native-vector-icons'

export default function FollowingScreen ({ props, navigation, route }) {
  const { userId } = route.params
  const [search, setSearch] = useState('')
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [masterDataSource, setMasterDataSource] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtered, setFiltered] = useState(false)

  const getAllFollowing = async () => {
    console.log(userId)
    const allFollowingId = []

    await firebase
      .firestore()
      .collection('users')
      .doc(userId)
      .collection('following')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(documentSnapshot => {
          if (documentSnapshot.id !== userId) {
            allFollowingId.push(documentSnapshot.id)
          }
        })
      })
    console.log(allFollowingId)
    const users = []

    for (let i = 0; i < allFollowingId.length; i++) {
      const followingId = allFollowingId[i]

      await firebase
        .firestore()
        .collection('users')
        .doc(followingId)
        .get()
        .then(doc => {
          const { name, bio, email, createdAt } = doc.data()
          users.push({
            followingId: doc.id,
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

    console.log(userId)
    console.log(allFollowingId)
    console.log(users)
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
          userId === item.followingId
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
            Following
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
  }
})
