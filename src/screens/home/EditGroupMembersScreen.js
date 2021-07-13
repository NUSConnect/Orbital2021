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

export default function EditGroupMembersScreen ({ props, route, navigation }) {
  const currentUserId = firebase.auth().currentUser.uid
  const [filteredDataSource, setFilteredDataSource] = useState([])
  const [search, setSearch] = useState('')
  const [filtered, setFiltered] = useState(false)

  const { name, threadId } = route.params
  const [users, setUsers] = useState(null)
  const [itemChecked, setItemChecked] = useState(false)
  const [currentlyMembers, setCurrentlyMembers] = useState(null)
  const [selectedMembers, setSelectedMembers] = useState([])

  const getAllUsers = async () => {
    const memberIds = {}
    await firebase.firestore().collection('THREADS').doc(threadId).get()
      .then((docSnapshot) => {
        docSnapshot.data().users.forEach((member) => {
          if (member !== currentUserId) {
            memberIds[member] = true
          }
        })
      })
    console.log(memberIds)
    setCurrentlyMembers(memberIds)

    const list = []
    const isMember = []

    await firebase.firestore().collection('users').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.id !== currentUserId && !doc.data().news) {
            const { name, userImg, bio } = doc.data()
            const selected = memberIds[doc.id]
            list.push({
              id: doc.id,
              name: name,
              img: userImg,
              bio: bio,
              isSelected: selected
            })
            if (selected) {
              isMember.push({
                id: doc.id,
                name: name
              })
            }
          }
        })
      })
    console.log(isMember)
    list.sort(sortByName)
    setUsers(list)
    setSelectedMembers(isMember)
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
          setSelectedMembers(oldArray => [...oldArray, { id: item.id, name: item.name }])
        } else {
          setSelectedMembers(selectedMembers.filter(mem => mem.id !== item.id))
        }
        setItemChecked((prevState) => !prevState)
        break
      }
    }
    setUsers(list)
  }

  const editMembers = async () => {
    if (selectedMembers.length < 1) {
      Alert.alert(
        'A group chat cannot have less than 2 members!',
        'Select at least 1 other user.'
      )
    } else if (selectedMembers.length > 4) {
      Alert.alert(
        'A group chat cannot have more than 5 members!',
        'Select at most 4 other users.'
      )
    } else {
      console.log('Members', selectedMembers)
      console.log('UserIds', selectedMembers.map(x => x.id))

      const memberIds = selectedMembers.map(x => x.id)
      memberIds.push(currentUserId)

      firebase.firestore().collection('THREADS').doc(threadId).update({ users: memberIds })
      const added = {}
      for (let i = 0; i < selectedMembers.length; i++) {
        const userId = selectedMembers[i].id
        addUser(userId)
        added[userId] = true
      }

      const keys = Object.keys(currentlyMembers)
      keys.forEach((key, index) => {
        if (added[key] !== true) {
          removeUser(key)
        }
      })
      navigation.goBack()
    }
  }

  const addUser = (userId) => {
    firebase.firestore().collection('users').doc(userId).collection('openChats').doc(threadId).set({})
  }

  const removeUser = (userId) => {
    firebase.firestore().collection('users').doc(userId).collection('openChats').doc(threadId).delete()
  }

  useEffect(() => {
    getAllUsers()
  }, [])

  return (
    <View style={styles.container}>
      <GroupCreationTopTab
        text={name}
        onBack={() => navigation.goBack()} onPress={() => editMembers()}
      />
      <View style={styles.selected}>
        <Text style={styles.subHeader}>
          Members
        </Text>
        <FlatList
          numColumns={4}
          data={selectedMembers}
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
