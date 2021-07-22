import * as React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'
import * as firebase from 'firebase'
import { sendPushNotification } from '../../api/notifications'

export default function HandleReportActionsScreen ({ route, navigation }) {
  // const { itemId, category } = route.params
  const { item, itemId, category } = route.params
  const reportedUid = category === 'users' ? itemId : item.userId
  const [isSuperAdmin, setIsSuperAdmin] = React.useState(false)
  const currentUserId = firebase.auth().currentUser.uid

  React.useEffect(() => {
    checkSuperAdmin()
    console.log(currentUserId)
    console.log(isSuperAdmin)
  }, [])

  const checkSuperAdmin = async () => {
    await firebase
      .firestore()
      .collection('users')
      .doc(currentUserId)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.data().superAdmin !== null) {
          setIsSuperAdmin(documentSnapshot.data().superAdmin)
        }
      })
  }

  const navigateToCategories = () => {
    navigation.goBack()
    navigation.goBack()
    navigation.goBack()
  }

  const deleteReportedItem = async () => {
    switch (category) {
      case 'userPosts':
        await firebase
          .firestore()
          .collection('posts')
          .doc(reportedUid)
          .collection(category)
          .doc(itemId)
          .delete()
        break
      case 'userComments':
        await firebase
          .firestore()
          .collection('posts')
          .doc(item.postId.substring(0, 28))
          .collection('userPosts')
          .doc(item.postId)
          .collection('comments')
          .doc(itemId)
          .delete()
        break
      case 'forumPosts':
        await firebase
          .firestore()
          .collection('forums')
          .doc(item.forumId)
          .collection('forumPosts')
          .doc(itemId)
          .delete()
        break
      case 'forumComments':
        await firebase
          .firestore()
          .collection('forums')
          .doc(item.forumId)
          .collection('forumPosts')
          .doc(item.postId)
          .collection('comments')
          .doc(itemId)
          .delete()
        break
    }
  }

  const dismissReport = async () => {
    await firebase
      .firestore()
      .collection('reports')
      .doc(category)
      .collection('reported')
      .doc(itemId)
      .update({ actionTaken: true })
    Alert.alert('Success!', 'Report has been dismissed.')
    navigateToCategories()
  }

  const handleDismissReport = () => {
    Alert.alert('Dismiss report',
      'Are you sure? This will dismiss the report without further action.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => dismissReport()
        }
      ]
      ,
      { cancelable: false })
  }

  const issueWarning = async () => {
    deleteReportedItem()
    const increment = firebase.firestore.FieldValue.increment(1)
    await firebase
      .firestore()
      .collection('users')
      .doc(reportedUid)
      .get()
      .then(documentSnapshot => {
        if (documentSnapshot.exists) {
          firebase
            .firestore()
            .collection('users')
            .doc(reportedUid)
            .update({ numWarnings: increment })
          firebase
            .firestore()
            .collection('users')
            .doc(reportedUid)
            .get()
            .then(documentSnapshot => {
              if (documentSnapshot.data().numWarnings >= 3) {
                banUser()
              } else {
                warnUser()
              }
            })
        }
      })
    await firebase
      .firestore()
      .collection('reports')
      .doc(category)
      .collection('reported')
      .doc(itemId)
      .update({ actionTaken: true })
    Alert.alert('Success!', 'User has been issued a warning.')

    navigateToCategories()
  }

  const warnUser = async () => {
    const message = category === 'users'
      ? 'Your user profile has some elements that violates our community guidelines. Please change it as soon as possible.'
      : 'You have made a post/comment that violates our community guidelines. Please be mindful of what you post in the future.'

    await firebase.firestore().collection('users').doc(reportedUid).get()
      .then((doc) => {
        console.log('Checking if pushToken available')
        if (doc.data().pushToken != null) {
          sendPushNotification(doc.data().pushToken.data, 'Warning', message)
        }
      })

    await firebase.firestore().collection('users').doc(reportedUid)
      .update({
        warningUnchecked: true,
        warningMessage: message
      })
  }

  const handleIssueWarning = () => {
    Alert.alert('Issue warning',
      'Are you sure? This will issue a warning to the reported user and delete the offending item.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => issueWarning()
        }
      ]
      ,
      { cancelable: false })
  }

  const banUser = async () => {
    deleteReportedItem()
    await firebase
      .firestore()
      .collection('banned')
      .doc(reportedUid)
      .set({})
    await firebase
      .firestore()
      .collection('reports')
      .doc(category)
      .collection('reported')
      .doc(itemId)
      .update({ actionTaken: true })
    Alert.alert('Success!', 'User has been added to the list to be banned.')

    await firebase.firestore().collection('users').doc(reportedUid).get()
      .then((doc) => {
        console.log('Checking if pushToken available')
        if (doc.data().pushToken != null) {
          sendPushNotification(doc.data().pushToken.data, 'Ban notice', 'You have been banned for violating our community guidelines')
        }
      })

    navigateToCategories()
  }

  const handleBanUser = () => {
    Alert.alert('Ban user',
      'Are you sure? This will ban the reported user and delete the offending item.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed!'),
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => banUser()
        }
      ]
      ,
      { cancelable: false })
  }

  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.button}
          onPress={() => handleDismissReport()}
        >
          Dismiss Report
        </Button>
        <Button
          style={styles.button}
          onPress={() => handleIssueWarning()}
        >
          Issue Warning
        </Button>
        {isSuperAdmin
          ? (
            <Button
              style={styles.button}
              onPress={() => handleBanUser()}
            >
              Ban user
            </Button>)
          : null}
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    width: '100%'
  },
  buttonwrap: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
