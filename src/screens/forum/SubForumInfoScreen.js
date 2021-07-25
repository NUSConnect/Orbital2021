import * as firebase from 'firebase'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View
} from 'react-native'
import {
  Card, TextSection, UserImg, UserImgWrapper, UserInfo, UserInfoText, UserName
} from '../../styles/MessageStyles'
import HeaderTopBar from '../../components/HeaderTopBar'

const DeviceWidth = Dimensions.get('window').width

const SubForumInfoScreen = ({ navigation, route }) => {
  const { forumId, forumName } = route.params
  const currentUserId = firebase.auth().currentUser.uid
  const [forumInfo, setForumInfo] = useState(null)
  const [admins, setAdmins] = useState([])

  const getForumInfo = async () => {
    await firebase
      .firestore()
      .collection('forums')
      .doc(forumId)
      .get()
      .then((documentSnapshot) => {
        setForumInfo(documentSnapshot.data())
      })
  }

  const getForumAdmins = async () => {
    const list = []
    await firebase.firestore().collection('forums').doc(forumId).collection('admins').get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          list.push(documentSnapshot.id)
        })
      })

    const adminsInfo = []

    for (const adminId of list) {
      await firebase.firestore().collection('users').doc(adminId).get()
        .then((doc) => {
          const { name, userImg, bio } = doc.data()
          adminsInfo.push({ userId: doc.id, name, userImg, bio })
        })
    }
    setAdmins(adminsInfo)
  }

  const viewProfile = (user) => {
    if (user.userId === currentUserId) {
      navigation.navigate('Profile')
    } else {
      navigation.navigate('ViewProfileScreen', { item: user })
    }
  }

  useEffect(() => {
    getForumInfo()
    getForumAdmins()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <HeaderTopBar
        onPress={() => navigation.goBack()}
        title={forumName}
      />
      <FlatList
        data={admins}
        ListHeaderComponent={
          <View>
            <View style={styles.forumContainer}>
              <Image
                source={{
                  uri: forumInfo ? forumInfo.forumImg : null
                }}
                style={styles.forumPic}
              />
              <View style={styles.forumInfo}>
                <Text style={styles.name}>
                  {' '}
                  {forumInfo ? forumInfo.forumName : null}{' '}
                </Text>
                <Text style={styles.text}>
                  {' '}
                  Description: {forumInfo ? forumInfo.forumDescription : null}{' '}
                </Text>
              </View>
            </View>

            <Text style={styles.adminHeader}>
              Admins:
            </Text>
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
        style={{ marginBottom: 10, width: '100%' }}
      />
    </SafeAreaView>
  )
}

export default SubForumInfoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'

  },
  headerComponentStyle: {
    marginVertical: 7
  },
  forumContainer: {
    backgroundColor: '#DCDCDC',
    width: '100%',
    height: DeviceWidth * 0.32,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row'
  },
  forumPic: {
    width: DeviceWidth * 0.25,
    height: DeviceWidth * 0.25,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'black',
    margin: 5
  },
  forumInfo: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  name: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '600',
    width: DeviceWidth * 0.7,
    flexWrap: 'wrap'
  },
  text: {
    fontSize: 16,
    color: '#778899',
    fontWeight: '600',
    flexWrap: 'wrap',
    paddingLeft: 4,
    width: DeviceWidth * 0.7
  },
  adminHeader: {
    fontSize: 20,
    paddingLeft: 10
  }
})
