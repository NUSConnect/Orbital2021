import * as React from 'react'
import { View } from 'react-native'
import BackButton from '../../components/BackButton'
import Background from '../../components/Background'
import Button from '../../components/Button'

export default function SetupAccountScreen ({ navigation }) {
  return (
    <Background style={styles.bg}>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.buttonwrap}>
        <Button
          style={styles.accountset}
          onPress={() =>
            navigation.navigate('AddBioScreen')}
        >
          Update Bio
        </Button>
        <Button
          style={styles.accountset}
          onPress={() =>
            navigation.navigate('AddFacultyScreen')}
        >
          Add your major
        </Button>
      </View>
    </Background>
  )
}

const styles = {
  button: {
    backgroundColor: '#FFFFFF'
  },
  buttonwrap: {
    backgroundColor: '#FFFFFF',
    height: 500,
    alignItems: 'center',
    justifyContent: 'center'
  }
}
