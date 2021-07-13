import * as firebase from 'firebase'
import { Alert, Platform } from 'react-native'

export const logoutUser = () => {
  firebase.auth().signOut()
}

export const signUpUser = async ({ name, email, password }) => {
  try {
    try {
      await firebase
        .firestore()
        .collection('users')
        .get()
        .then(querySnapshot => {
          const list = []
          querySnapshot.forEach(documentSnapshot => {
            list.push(documentSnapshot.data().name)
          })
          if (list.includes(name)) {
            throw new Error('This username is already in use, please try another username.')
          }
        })
    } catch (error) {
      return {
        error: error.message
      }
    }
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Once the user creation has happened successfully, we can add the currentUser into firestore
        // with the appropriate details.
        userCredential.user.sendEmailVerification()

        const currentUserId = firebase.auth().currentUser.uid

        firebase.auth().currentUser.updateProfile({
          displayName: name
        })

        firebase
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .set({
            name: name,
            email: email,
            createdAt: firebase.firestore.Timestamp.fromDate(
              new Date()
            ),
            userImg: null,
            bio: 'Introduce yourself!'
          })
        // ensure we catch any errors at this stage to advise us if something does go wrong
          .catch((error) => {
            console.log(
              'Something went wrong with added user to firestore: ',
              error
            )
          })
        firebase
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .collection('following')
          .doc(currentUserId)
          .set({})
        firebase
          .firestore()
          .collection('users')
          .doc(currentUserId)
          .collection('following')
          .doc('H0sH7GW3dyegouLw2cTEE1PoBBt1')
          .set({})
      })

    Alert.alert('Email sent.', 'Please verify your account before signing in.')
    firebase.auth().signOut()

    return {
      user
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
    if (firebase.auth().currentUser.emailVerified) {
      await firebase
        .firestore()
        .collection('banned')
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            if (firebase.auth().currentUser.uid === documentSnapshot.id) {
              Alert.alert('You have been banned', 'Due to this ban, you will not be able to log in.')
              firebase.auth().signOut()
              return {
                user
              }
            }
          })
        })
      return {
        user
      }
    } else {
      Alert.alert(
        'Email is not verified!',
        'Resend verification email?',
        [
          {
            text: 'Resend',
            onPress: () => {
              user.user.sendEmailVerification()
            }
          },
          {
            text: 'Cancel',
            onPress: () => console.log('cancel')
          }
        ],
        {
          cancelable: false
        }
      )
      firebase.auth().signOut()
      return {
        user
      }
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}

export const sendEmailWithPassword = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    return {}
  } catch (error) {
    return {
      error: error.message
    }
  }
}

export const deleteUser = () => {
  try {
    const currentUserId = firebase.auth().currentUser.uid
    const os = Platform.OS
    if (os === 'ios') {
      Alert.alert('Are you sure?', 'This action cannot be undone', [
        {
          text: 'Delete',
          onPress: () => {
            firebase
              .firestore()
              .collection('users')
              .doc(currentUserId)
              .collection('followers')
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(documentSnapshot.id)
                    .collection('following')
                    .doc(currentUserId)
                    .delete()
                })
              })
            firebase
              .firestore()
              .collection('users')
              .doc(currentUserId)
              .collection('following')
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                  if (documentSnapshot.id !== currentUserId) {
                    firebase
                      .firestore()
                      .collection('users')
                      .doc(documentSnapshot.id)
                      .collection('followers')
                      .doc(currentUserId)
                      .delete()
                  }
                })
              })
            firebase
              .firestore()
              .collection('users')
              .doc(currentUserId)
              .delete()
            firebase.auth().currentUser.delete()
            Alert.alert(
              'Success!',
              'Your account has been deleted.'
            )
          }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel'
        }
      ])
    } else {
      Alert.alert('Are you sure?', 'This action cannot be undone', [
        {
          text: 'Cancel',
          onPress: () => console.log('cancel'),
          style: 'cancel'
        },
        {
          text: 'Delete',
          onPress: () => {
            firebase
              .firestore()
              .collection('users')
              .doc(currentUserId)
              .collection('followers')
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                  firebase
                    .firestore()
                    .collection('users')
                    .doc(documentSnapshot.id)
                    .collection('following')
                    .doc(currentUserId)
                    .delete()
                })
              })
            firebase
              .firestore()
              .collection('users')
              .doc(currentUserId)
              .collection('following')
              .get()
              .then(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
                  if (documentSnapshot.id !== currentUserId) {
                    firebase
                      .firestore()
                      .collection('users')
                      .doc(documentSnapshot.id)
                      .collection('followers')
                      .doc(currentUserId)
                      .delete()
                  }
                })
              })
            firebase
              .firestore()
              .collection('users')
              .doc(currentUserId)
              .delete()
            firebase.auth().currentUser.delete()
            Alert.alert(
              'Success!',
              'Your account has been deleted.'
            )
          }
        }
      ])
    }
  } catch (error) {
    return {
      error: error.message
    }
  }
}
