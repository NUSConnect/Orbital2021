import * as React from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'
import * as firebase from 'firebase'

export default function HandleReportActionsScreen ({ route, navigation }) {
  const { itemId, category } = route.params
  // const { item, itemId, category } = route.params
  // const reportedUid = category === 'users' ? itemId : item.userId

  const navigateToCategories = () => {
    navigation.goBack()
    navigation.goBack()
    navigation.goBack()
  }

  const dismissReport = async () => {
    firebase
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
          onPress={() => alert('warn')}
        >
          Issue Warning
        </Button>
        <Button
          style={styles.button}
          onPress={() => alert('ban')}
        >
          Ban user
        </Button>
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
