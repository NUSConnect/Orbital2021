import * as ImagePicker from 'expo-image-picker'
import * as firebase from 'firebase'
import React from 'react'
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  PixelRatio
} from 'react-native'
import { logoutUser } from '../../api/auth'
import Button from '../../components/Button'
import { theme } from '../../core/theme'

const nameSize = PixelRatio.get() <= 1.5 ? 16 : 22
const userInfoSize = PixelRatio.get() <= 1.5 ? 14 : 16
const followSize = PixelRatio.get() <= 1.5 ? 14 : 20
const avatarSize = PixelRatio.get() <= 1.5 ? 110 : 150

export default class ProfilePersonalScreen extends React.Component {
    state = {
      currentUserId: firebase.auth().currentUser.uid,
      defaultUri:
            'https://firebasestorage.googleapis.com/v0/b/orbital2021-a4766.appspot.com/o/profile%2Fplaceholder.png?alt=media&token=52e7df63-abdf-4197-9ad3-79d4be61af10',
      userData: null,
      uploaded: false,
      status: '',
      imageURL: '',
      bio: '',
      major: null,
      following: 0,
      followers: 0,
      requestedFollows: false,
      superAdmin: false,
      forumAdmin: false
    };

    static navigationOptions = {
      header: null
    };

    handleLoadInBrowser = () => {
      Linking.openURL('https://docs.google.com/document/d/1iCbU7dv6kQtr8h0xFe01NmVnVUM1NtYrTSJWbmPHA-I/edit')
        .catch(err => console.error("Couldn't load page", err))
    }

    handleChooseImagePress = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1]
      })

      if (!result.cancelled) {
        const userId = this.state.currentUserId
        const imagePath = 'profile/' + userId

        this.uploadImage(result.uri, imagePath)
          .then(async () => {
            console.log('Success')
            const url = await firebase
              .storage()
              .ref()
              .child(imagePath)
              .getDownloadURL()
            firebase
              .firestore()
              .collection('users')
              .doc(this.state.currentUserId)
              .update({ userImg: url })
            this.getUser()
          })
          .catch((error) => {
            console.log(error)
          })
      }
    };

    uploadImage = async (uri, imagePath) => {
      const response = await fetch(uri)
      const blob = await response.blob()

      const ref = firebase.storage().ref(imagePath)

      return ref.put(blob)
    };

    getUser = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .get()
        .then((documentSnapshot) => {
          if (documentSnapshot.exists) {
            this.setState({ userData: documentSnapshot.data() })
            this.setState({ bio: documentSnapshot.data().bio })
            this.setState({ major: documentSnapshot.data().major })
            if (documentSnapshot.data().superAdmin !== null) {
              this.setState({ superAdmin: documentSnapshot.data().superAdmin })
            }
            if (documentSnapshot.data().forumAdmin !== null) {
              this.setState({ forumAdmin: documentSnapshot.data().forumAdmin })
            }
          }
        })
    };

    getFollowing = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .collection('following')
        .onSnapshot(querySnapshot => {
          this.setState({ following: querySnapshot.size - 1 })
        })

      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .collection('followRequests')
        .onSnapshot(querySnapshot => {
          if (querySnapshot.size !== 0) {
            this.setState({ followRequests: true })
          } else {
            this.setState({ followRequests: false })
          }
        })
    }

    getFollowers = async () => {
      await firebase
        .firestore()
        .collection('users')
        .doc(this.state.currentUserId)
        .collection('followers')
        .onSnapshot(querySnapshot => {
          this.setState({ followers: querySnapshot.size })
        })
    }

    componentDidMount () {
      this.getUser()
      this.getFollowing()
      this.getFollowers()
      this._unsubscribe = this.props.navigation.addListener('focus', () => this.getUser())
    }

    componentWillUnmount () {
      this._unsubscribe()
    }

    render () {
      return (
        <SafeAreaView>
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <TouchableOpacity onPress={this.handleChooseImagePress}>
                  <Image
                    source={{
                      uri: this.state.userData
                        ? this.state.userData.userImg ||
                                              this.state.defaultUri
                        : this.state.defaultUri
                    }}
                    style={styles.avatar}
                  />
                </TouchableOpacity>
                <Text style={styles.name}>
                  {firebase.auth().currentUser.displayName}
                </Text>
                <Text style={styles.userInfo}>
                  Major: {this.state.major ? this.state.major : 'Undeclared'}
                </Text>
                <Text style={styles.userInfo}>
                  {this.state.bio}
                </Text>
                <View style={styles.following}>
                  <View>
                    <TouchableOpacity
                      style={styles.innerFollowing}
                      onPress={() => this.props.navigation.navigate('FollowersScreen', { userId: this.state.currentUserId })}
                    >
                      <Text style={styles.followWord}> {this.state.followers} </Text>
                      <Text style={styles.userInfo}> {this.state.followers === 1 ? 'Follower' : 'Followers'} </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.innerFollowing}
                      onPress={() => this.props.navigation.navigate('FollowingScreen', { userId: this.state.currentUserId })}
                    >
                      <Text style={styles.followWord}> {this.state.following} </Text>
                      <Text style={styles.userInfo}> Following </Text>
                    </TouchableOpacity>
                  </View>
                  {this.state.followRequests === true
                    ? (
                      <View>
                        <TouchableOpacity
                          style={styles.innerFollowing}
                          onPress={() => this.props.navigation.navigate('RequestedFollowersScreen')}
                        >
                          <Text style={styles.followRequests}>Follow</Text>
                          <Text style={styles.followRequests}>Requests</Text>
                        </TouchableOpacity>
                      </View>
                      )
                    : (null)}
                </View>
              </View>
            </View>

            <View style={styles.body}>
              <Button
                style={styles.accountset}
                onPress={() =>
                  this.props.navigation.navigate('SetupAccountScreen')}
              >
                Edit Profile
              </Button>
              <Button
                style={styles.accountset}
                onPress={() => this.props.navigation.navigate('AccountSettingsScreen')}
              >
                Account Settings
              </Button>
              {this.state.superAdmin
                ? (
                  <Button
                    style={styles.accountset}
                    color='darkorange'
                    onPress={() => this.props.navigation.navigate('SuperAdminScreen')}
                  >
                    Super Admin Controls
                  </Button>
                  )
                : this.state.forumAdmin
                  ? (
                    <Button
                      style={styles.accountset}
                      color='darkorange'
                      onPress={() => this.props.navigation.navigate('ForumAdminViewReportScreen')}
                    >
                      Forum Admin Controls
                    </Button>
                    )
                  : (null)}
              <Button
                style={styles.accountset}
                onPress={this.handleLoadInBrowser}
              >
                User Guide
              </Button>
              <Button
                style={styles.button}
                color='#de1738'
                onPress={logoutUser}
              >
                {' '}
                Logout{' '}
              </Button>
            </View>
          </View>
        </SafeAreaView>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface
  },
  header: {
    backgroundColor: '#DCDCDC'
  },
  headerContent: {
    padding: 30,
    alignItems: 'center'
  },
  avatar: {
    width: avatarSize,
    height: avatarSize,
    borderRadius: avatarSize / 2,
    borderWidth: 4,
    borderColor: 'white',
    marginBottom: 10
  },
  name: {
    fontSize: nameSize,
    color: '#000000',
    fontWeight: '600'
  },
  userInfo: {
    fontSize: userInfoSize,
    color: '#778899',
    fontWeight: '600'
  },
  body: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center'
  },
  item: {
    flexDirection: 'row'
  },
  infoContent: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: 5
  },
  iconContent: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: 5
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: '#FFFFFF'
  },
  accountset: {
    backgroundColor: '#FFFFFF'
  },
  logout: {
    backgroundColor: '#add8e6'
  },
  following: {
    flexDirection: 'row',
    marginTop: 10
  },
  innerFollowing: {
    alignItems: 'center',
    paddingRight: 25,
    paddingLeft: 25
  },
  followWord: {
    fontSize: followSize,
    color: '#000000',
    fontWeight: '600'
  },
  followRequests: {
    fontSize: 16,
    color: 'blue',
    fontWeight: '600'
  }
})
