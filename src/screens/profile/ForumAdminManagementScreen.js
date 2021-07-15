import * as firebase from 'firebase'
import React, { useState, useEffect } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { Divider } from 'react-native-paper'
import GroupCreationTopTab from '../../components/GroupCreationTopTab'
import SearchBar from '../../components/SearchBar'
import {
  TextSection,
  UserImg,
  UserImgWrapper,
  UserInfo,
  UserInfoText,
  UserName
} from '../../styles/MessageStyles'
import { sortByName } from '../../api/ranking'

export default function ForumAdminManagementScreen ({ props, route, navigation }) {
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(false)

  const { forumName, forumId } = route.params
  const [users, setUsers] = useState(null)
  const [itemChecked, setItemChecked] = useState(false)
  const [currentlyAdmin, setCurrentlyAdmin] = useState(null)
  const [selectedAdmins, setSelectedAdmins] = useState([])

  const getAllUsers = async () => {
    const adminIds = {}
    await firebase.firestore().collection('forums').doc(forumId).collection('admins').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          adminIds[doc.id] = true
        })
      })
    setCurrentlyAdmin(adminIds)

    const list = []
    const isAdmin = []

    await firebase.firestore().collection('users').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { name, userImg, bio, news } = doc.data()
          if (!news) {
            const selected = adminIds[doc.id]
            list.push({
              id: doc.id,
              name: name,
              img: userImg,
              bio: bio,
              isSelected: selected
            })
            if (selected) {
              isAdmin.push({
                id: doc.id,
                name: name
              })
            }
          }
        })
      })
    list.sort(sortByName)
    setUsers(list)
    setSelectedAdmins(isAdmin)
  }

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = users.filter(function (item) {
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
      setFilteredDataSource(users)
      setSearch(text)
    }
  }

  const selectItem = (key) => {
    const list = users
    for (const item of list) {
      if (item.id === key) {
        item.isSelected = (item.isSelected == null) ? true : !item.isSelected
        if (item.isSelected) {
          setSelectedAdmins(oldArray => [...oldArray, { id: item.id, name: item.name }])
        } else {
          setSelectedAdmins(selectedAdmins.filter(forum => forum.id !== item.id))
        }
        setItemChecked((prevState) => !prevState)
        break
      }
    }
    setUsers(list)
  }

  const changeForumAdminStatus = async () => {
    if (selectedAdmins.length === 0) {
      Alert.alert(
        'A forum cannot have 0 admins!',
        'Select at least 1 user to become admin.'
      )
    } else {
      const added = {}
      for (let i = 0; i < selectedAdmins.length; i++) {
        const userId = selectedAdmins[i].id
        firebase.firestore().collection('users').doc(userId).collection('forumAdmin').doc(forumId)
          .set({ name: forumName })
        firebase.firestore().collection('users').doc(userId).update({ forumAdmin: true })

        addAdmin(userId)
        added[userId] = true
      }

      const keys = Object.keys(currentlyAdmin)
      keys.forEach((key, index) => {
        if (added[key] !== true) {
          firebase.firestore().collection('users').doc(key).collection('forumAdmin').doc(forumId).delete()
            .then(() => {
              firebase.firestore().collection('users').doc(key).collection('forumAdmin').get()
                .then((querySnapshot) => {
                  if (querySnapshot.size === 0) {
                    firebase.firestore().collection('users').doc(key).update({ forumAdmin: false })
                  }
                })
            })
          removeAdmin(key)
        }
      })
      navigation.goBack()
    }
  }

  const addAdmin = (userId) => {
    firebase.firestore().collection('forums').doc(forumId).collection('admins').doc(userId).set({})
  }

  const removeAdmin = (userId) => {
    firebase.firestore().collection('forums').doc(forumId).collection('admins').doc(userId).delete()
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <View style={styles.container}>
      <GroupCreationTopTab
        text={forumName}
        onBack={() => navigation.goBack()} onPress={() => changeForumAdminStatus()}
      />
      <View style={styles.selected}>
        <Text style={styles.subHeader}>
          Admins
        </Text>
        <FlatList
          numColumns={4}
          data={selectedAdmins}
          renderItem={({ item }) => (
            <Text style={styles.selected}>
              {item.name}
            </Text>
          )}
          keyExtractor={(item) => item.name}
          extraData={itemChecked}
        />
      </View>
      <SearchBar
        search={search}
        setSearch={setSearch}
        searchFilterFunction={searchFilterFunction}
        resetFilter={() => setFilteredDataSource(users)}
      />
      <FlatList
        data={filtered ? filteredDataSource : users}
        keyExtractor={(item) => item.name}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => selectItem(item.id)}
            style={{ width: '100%', backgroundColor: item.isSelected ? '#DDD' : '#FFF' }}
          >
            <UserInfo>
              <UserImgWrapper>
                <UserImg source={{ uri: item.img }} />
              </UserImgWrapper>
              <TextSection>
                <UserInfoText>
                  <UserName>{item.name}</UserName>
                </UserInfoText>
                <Text style={styles.text}>{item.bio}</Text>
              </TextSection>
            </UserInfo>
          </TouchableOpacity>
        )}
        extraData={itemChecked}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1
  },
  subHeader: {
    color: 'black',
    fontSize: 20,
    paddingLeft: 8
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
    fontSize: 14
  },
  selected: {
    color: 'black',
    fontSize: 16,
    paddingLeft: 8,
    paddingRight: 8
  }
})
