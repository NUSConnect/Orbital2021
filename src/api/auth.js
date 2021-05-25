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
        const currentUserId = firebase.auth().currentUser.uid
        firebase.firestore().collection('users').doc(currentUserId)
        .set({
            name: name,
            email: email,
            createdAt: firebase.firestore.Timestamp.fromDate(new Date()),
            userImg: null,
            bio:'Introduce yourself!'
        })
        //ensure we catch any errors at this stage to advise us if something does go wrong
        .catch(error => {
            console.log('Something went wrong with added user to firestore: ', error);
        })
        firebase.firestore().collection('users').doc(currentUserId).collection('following').doc(currentUserId).set({});
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