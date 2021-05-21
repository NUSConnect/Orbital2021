//import firebase from 'firebase/app';
//import 'firebase/auth';
//import firestore from '@react-native-firebase/firestore';
import * as firebase from 'firebase';

export const logoutUser = () => {
  firebase.auth().signOut()
}

export const signUpUser = async ({ name, email, password }) => {
  try {
    const user = await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        //Once the user creation has happened successfully, we can add the currentUser into firestore
        //with the appropriate details.
        firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid)
        .set({
            name: name,
            email: email,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            userImg: null,
        })
        //ensure we catch any errors at this stage to advise us if something does go wrong
        .catch(error => {
            console.log('Something went wrong with added user to firestore: ', error);
        })
      })

    firebase.auth().currentUser.updateProfile({
      displayName: name,
    })
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const loginUser = async ({ email, password }) => {
  try {
    const user = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
    return { user }
  } catch (error) {
    return {
      error: error.message,
    }
  }
}

export const sendEmailWithPassword = async (email) => {
  try {
    await firebase.auth().sendPasswordResetEmail(email)
    return {}
  } catch (error) {
    return {
      error: error.message,
    }
  }
}